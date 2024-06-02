// Tram-Deco - declarative custom elements, using declarative shadow DOM

class TramDeco {
	// function to process template tags that have component definitions
	static processTemplate(template) {
		// for each definition in the template, define a web component
		[...template.content.children].forEach((templateElement) => {
			TramDeco.define(templateElement);
		});
	}

	static define(templateElement) {
		// set the tag name to the element name in the template
		const tagName = templateElement.tagName.toLowerCase();

		// TDElement class, which has the core functionality that all Tram-Deco
		// Web Components will need
		class BaseTDElement extends HTMLElement {
			constructor(shadowRoot) {
				super();

				if (shadowRoot) {
					// attach the shadow root, with the options used in the created declarative shadow DOM
					this.attachShadow(shadowRoot);

					// clone the shadow root content using a document range
					const shadowRootRange = document.createRange();
					shadowRootRange.selectNodeContents(shadowRoot);
					this.shadowRoot.append(shadowRootRange.cloneContents());
				}
			}
		}

		const parentClassName = templateElement.getAttribute(`td-extends`);
		const parentClass = customElements.get(parentClassName) || BaseTDElement;

		// we need to pull the constructor method separately
		const modifiedConstructor = templateElement.querySelector(`script[td-method="constructor"]`);
		class TDElement extends parentClass {
			// overrideShadowRoot will be a templateElement.shadowRoot of a sub-class (if we have one)
			// otherwise, we'll default to using the shadowRoot of this element.
			constructor(overrideShadowRoot) {
				super(overrideShadowRoot || templateElement.shadowRoot);
				eval(modifiedConstructor?.textContent || '');
			}
		}

		// pull all other script tags for methods, and add them to the prototype
		templateElement.querySelectorAll(`script[td-method]`).forEach((lifecycleScript) => {
			const methodName = lifecycleScript.getAttribute('td-method');
			TDElement.prototype[methodName] = function () {
				eval(lifecycleScript.textContent);
			};
		});

		// pull script tags for properties, and add them to the class as getters
		templateElement.querySelectorAll(`script[td-property]`).forEach((propertyScript) => {
			const propertyName = propertyScript.getAttribute('td-property');
			Object.defineProperty(TDElement, propertyName, {
				get: function () {
					return eval(propertyScript.textContent);
				},
			});
		});

		customElements.define(tagName, TDElement);
	}
}

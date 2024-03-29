// Tram-Deco - declarative custom elements, using declarative shadow DOM

class TramDeco {
	// function to process new nodes (from a mutation observer) and make component definitions
	static processTemplates(mutationRecords) {
		mutationRecords.forEach((mutationRecord) => {
			mutationRecord.addedNodes.forEach((newNode) => {
				// check if the previous element is a definition template
				// we wait until we are in the next element (most likely a #text node)
				// because that will confirm that the element has been completely parsed
				if (newNode.previousSibling?.matches?.('[td-definitions]:not(defined)')) {
					TramDeco.processTemplate(newNode.previousSibling);
				}
			});
		});
	}

	// function to process template tags that have component definitions
	static processTemplate(template) {
		// for each definition in the template, define a web component
		[...template.content.children].forEach((newElement) => {
			TramDeco.define(newElement);
		});

		// mark the template as having been processed
		template.setAttribute('defined', '');
	}

	static define(newElement) {
		// set the tag name to the element name in the template
		const tagName = newElement.tagName.toLowerCase();

		// pull the shadow root (we expect this to have been built by DSD)
		const shadowRoot = newElement.shadowRoot;

		// we have to manually pull out the attributes from the shadowRoot
		// since there's no native way to just clone the shadowRoot fragment -.-
		// we do this using a Range document fragment
		const { mode, delegatesFocus } = shadowRoot;
		const range = document.createRange();
		range.selectNodeContents(shadowRoot);

		// TDElement class, which has the core functionality that all Tram-Deco
		// Web Components will need
		class BaseTDElement extends HTMLElement {
			constructor() {
				super();

				// attach the shadow root, with the options used in the DSD
				this.attachShadow({ mode, delegatesFocus });

				// clone the shadow root content
				this.shadowRoot.append(range.cloneContents());
			}
		}

		// we need to pull the constructor method separately
		const modifiedConstructor = newElement.querySelector(`script[td-method="constructor"]`);
		class TDElement extends BaseTDElement {
			constructor() {
				super();
				eval(modifiedConstructor?.textContent || '');
			}
		}

		// pull all other script tags for methods, and add them to the prototype
		newElement.querySelectorAll(`script[td-method]`).forEach((lifecycleScript) => {
			const methodName = lifecycleScript.getAttribute('td-method');
			TDElement.prototype[methodName] = function () {
				eval(lifecycleScript.textContent);
			};
		});

		// pull script tags for properties, and add them to the class as getters
		newElement.querySelectorAll(`script[td-property]`).forEach((propertyScript) => {
			const propertyName = propertyScript.getAttribute('td-property');
			Object.defineProperty(TDElement, propertyName, {
				get: function () {
					return eval(propertyScript.textContent);
				},
			});
		});

		customElements.define(tagName, TDElement);
	}

	// function to start mutation observer that processes definition templates
	static watch() {
		// check if any existing definition templates already exist (if they do, process them)
		const definitions = document.querySelectorAll('[td-definitions]:not(defined)');
		[...definitions].forEach((definition) => TramDeco.processTemplate(definition));

		// set up mutation observer for definition templates that might appear later
		const observer = new MutationObserver(TramDeco.processTemplates);
		observer.observe(document, { subtree: true, childList: true });

		// clean up the mutation observer once the document finishes loading
		// (we don't expect more elements to load at this point)
		window.addEventListener('DOMContentLoaded', () => {
			observer.disconnect();
		});
	}

	// function to pull an external html definition
	static async import(componentPath) {
		const componentResult = await fetch(componentPath);
		const componentContent = await componentResult.text();
		const fragment = Document.parseHTMLUnsafe(componentContent);

		[...fragment.body.children].forEach((child) => {
			TramDeco.define(child);
		});
	}
}

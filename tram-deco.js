// Tram-Deco - declarative custom elements, using declarative shadow DOM

class TramDeco {
	// scripts that users can define in their elements
	static apiScripts = {
		constructor: 'td-constructor',
		connectedCallback: 'td-connectedcallback',
		disconnectedCallback: 'td-disconnectedcallback',
		adoptedCallback: 'td-adoptedcallback',
		attributeChangedCallback: 'td-attributechangedcallback',
	};

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

		// observed attributes, a space delimited set of attributes on the element being defined
		const observedAttributes = (newElement.getAttribute('td-observedattributes') || '').split(' ');

		// pull the shadow root (we expect this to have been built by DSD)
		const shadowRoot = newElement.shadowRoot;

		// we have to manually pull out the attributes from the shadowRoot
		// since there's no native way to just clone the shadowRoot fragment -.-
		// we do this using a Range document fragment
		const { mode, delegatesFocus } = shadowRoot;
		const range = document.createRange();
		range.selectNodeContents(shadowRoot);

		// pull script tags with specific behavior that we want to use in our component
		const elScripts = {};
		Object.entries(TramDeco.apiScripts).forEach(([key, elementAttribute]) => {
			const element = newElement.querySelector(`script[${elementAttribute}]`);
			const script = element?.textContent;
			elScripts[key] = script;
		});

		customElements.define(
			tagName,
			class TDElement extends HTMLElement {
				static observedAttributes = observedAttributes;

				constructor() {
					super();

					// attach the shadow root, with the options used in the DSD
					this.attachShadow({ mode, delegatesFocus });

					// clone the shadow root content
					this.shadowRoot.append(range.cloneContents());

					// if we were told to do anything else on construction, do it here
					if (elScripts.constructor) {
						eval(elScripts.constructor);
					}
				}

				connectedCallback() {
					if (elScripts.connectedCallback) {
						eval(elScripts.connectedCallback);
					}
				}

				disconnectedCallback() {
					if (elScripts.disconnectedCallback) {
						eval(elScripts.disconnectedCallback);
					}
				}

				adoptedCallback() {
					if (elScripts.adoptedCallback) {
						eval(elScripts.adoptedCallback);
					}
				}

				attributeChangedCallback() {
					if (elScripts.attributeChangedCallback) {
						eval(elScripts.attributeChangedCallback);
					}
				}
			},
		);
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

// Tram-Deco - declarative custom elements, using declarative shadow DOM

// scripts that users can define in their elements
const apiScripts = {
	constructor: 'td-constructor',
	connectedCallback: 'td-connectedcallback',
	disconnectedCallback: 'td-disconnectedcallback',
	adoptedCallback: 'td-adoptedcallback',
	attributeChangedCallback: 'td-attributechangedcallback',
};

// pull definition templates that have yet to be defined
// note: you can have more than one in a single template
const definitions = document.querySelectorAll('[td-definitions]:not([defined])');

[...definitions].forEach((definition) => {
	// for each definition in the template, define a web component
	[...definition.content.children].forEach((newElement) => {
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
		const elementAPIScripts = {};
		Object.entries(apiScripts).forEach(([key, elementAttribute]) => {
			const element = shadowRoot.querySelector(`script[${elementAttribute}]`);
			const script = element?.textContent;
			// remove element from the shadow root (so we don't call it again)
			element?.remove?.();
			elementAPIScripts[key] = script;
		});

		console.log({ elementAPIScripts });

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
					if (elementAPIScripts.constructor) {
						eval(elementAPIScripts.constructor);
					}
				}

				connectedCallback() {
					if (elementAPIScripts.connectedCallback) {
						eval(elementAPIScripts.connectedCallback);
					}
				}

				disconnectedCallback() {
					if (elementAPIScripts.disconnectedCallback) {
						eval(elementAPIScripts.disconnectedCallback);
					}
				}

				adoptedCallback() {
					if (elementAPIScripts.adoptedCallback) {
						eval(elementAPIScripts.adoptedCallback);
					}
				}

				attributeChangedCallback() {
					if (elementAPIScripts.attributeChangedCallback) {
						eval(elementAPIScripts.attributeChangedCallback);
					}
				}
			},
		);
	});

	definition.setAttribute('defined', '');
});

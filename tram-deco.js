// pull definition templates that have yet to be defined
// note: you can have more than one in a single template
const definitions = document.querySelectorAll('[td-definitions]:not([defined])');

[...definitions].forEach((definition) => {
	// for each definition in the template, define a web component
	[...definition.content.children].forEach((newElement) => {
		const tagName = newElement.tagName.toLowerCase();
		const shadowRoot = newElement.shadowRoot;

		// we have to manually pull out the attributes from the shadowRoot
		// since there's no native way to just clone the shadowRoot fragment -.-
		// we do this using a Range document fragment
		const { mode, delegatesFocus } = shadowRoot;
		const range = document.createRange();
		range.selectNodeContents(shadowRoot);

		customElements.define(
			tagName,
			class TDElement extends HTMLElement {
				constructor() {
					super();
					this.attachShadow({ mode, delegatesFocus });
				}

				connectedCallback() {
					// set a reference to the current element in the document (for use in the element's script tags)
					// we do this because there is no other elegant way to get the node that is being mounted
					// (currentScript will be undefined for scripts in shadowRoots)
					document.tdElement = this;

					// copy the shadowRoot template and append it to this element's shadowRoot
					// this will also trigger all script tags
					this.shadowRoot.append(range.cloneContents());

					// clean up the tdElement
					delete document.tdElement;
				}
			},
		);
	});

	definition.setAttribute('defined', '');
});

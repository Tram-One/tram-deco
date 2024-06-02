
(() => {
	class TramDeco{static processTemplate(e){[...e.content.children].forEach(e=>{TramDeco.define(e)})}static define(templateElement){const tagName=templateElement.tagName.toLowerCase();class BaseTDElement extends HTMLElement{constructor(e){var t;super(),e&&(this.attachShadow(e),(t=document.createRange()).selectNodeContents(e),this.shadowRoot.append(t.cloneContents()))}}const parentClassName=templateElement.getAttribute("td-extends"),parentClass=customElements.get(parentClassName)||BaseTDElement,modifiedConstructor=templateElement.querySelector('script[td-method="constructor"]');class TDElement extends parentClass{constructor(overrideShadowRoot){super(overrideShadowRoot||templateElement.shadowRoot),eval(modifiedConstructor?.textContent||"")}}templateElement.querySelectorAll("script[td-method]").forEach(lifecycleScript=>{const methodName=lifecycleScript.getAttribute("td-method");TDElement.prototype[methodName]=function(){eval(lifecycleScript.textContent)}}),templateElement.querySelectorAll("script[td-property]").forEach(propertyScript=>{const propertyName=propertyScript.getAttribute("td-property");Object.defineProperty(TDElement,propertyName,{get:function(){return eval(propertyScript.textContent)}})}),customElements.define(tagName,TDElement)}}

	const importTemplate = document.createElement('template')
	importTemplate.setHTMLUnsafe(`<spoiler-tag>
	<template shadowrootmode="open" delegatesfocus>
		<style>
			span[aria-expanded='false'] {
				display: inline-block;
				position: relative;

				&::after {
					background: black;
					border-radius: 0.5em;
					cursor: pointer;
					position: absolute;
					top: 0;
					left: 0;
					bottom: 0;
					right: 0;
					content: '';
				}
			}
			span[aria-expanded='true'] {
				color: inherit;
				background: inherit;
				cursor: inherit;
			}
		</style>

		<span part="control" role="button" aria-label="Spoiler" tabindex="0" aria-expanded="false">
			<span part="content" role="presentation" aria-hidden="true">
				<slot></slot>
			</span>
		</span>
	</template>

	<script td-method="constructor">
		this.control = this.shadowRoot.querySelector('[part="control"]');
		this.content = this.shadowRoot.querySelector('[part="content"]');

		this.reveal = () => {
			this.control.ariaLabel = null;
			this.control.role = 'presentation';
			this.control.tabIndex = -1;
			this.content.ariaHidden = 'false';
			this.control.ariaExpanded = 'true';
		};
	</script>

	<script td-method="connectedCallback">
		this.control.addEventListener('click', this.reveal, { once: true });
		this.control.addEventListener('keydown', (event) => {
			if (event.key === ' ' || event.key === 'Enter') {
				this.reveal();
			}
		});
	</script>
</spoiler-tag>
`)

	TramDeco.processTemplate(importTemplate);
})()

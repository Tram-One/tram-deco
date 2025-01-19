
(() => {
	class TramDeco{static processTemplate(e){[...e.content.children].forEach(e=>{TramDeco.define(e)})}static define(templateElement){const tagName=templateElement.tagName.toLowerCase();class BaseTDElement extends HTMLElement{constructor(e){var t;super(),e&&(this.attachShadow(e),(t=document.createRange()).selectNodeContents(e),this.shadowRoot.append(t.cloneContents()))}}const parentClassName=templateElement.getAttribute("td-extends"),parentClass=customElements.get(parentClassName)||BaseTDElement,modifiedConstructor=templateElement.querySelector('script[td-method="constructor"]');class TDElement extends parentClass{constructor(overrideShadowRoot){super(overrideShadowRoot||templateElement.shadowRoot),eval(modifiedConstructor?.textContent||"")}}templateElement.querySelectorAll("script[td-method]").forEach(lifecycleScript=>{const methodName=lifecycleScript.getAttribute("td-method");TDElement.prototype[methodName]=function(){eval(lifecycleScript.textContent)}}),templateElement.querySelectorAll("script[td-property]").forEach(propertyScript=>{const propertyName=propertyScript.getAttribute("td-property");Object.defineProperty(TDElement,propertyName,{get:function(){return eval(propertyScript.textContent)}})}),customElements.define(tagName,TDElement)}}

	const importTemplate = document.createElement('template')
	importTemplate.setHTMLUnsafe(`<header-anchor>
	<template shadowrootmode="open">
		<style>
			a {
				color: inherit;
			}
			::slotted(*)::before {
				content: '# ';
				opacity: 0.3;
			}
			::slotted(*:hover)::before {
				opacity: 0.7;
			}
			a:not(:hover) {
				text-decoration: none;
			}
		</style>

		<a><slot></slot></a>
	</template>

	<script td-method="constructor">
		new MutationObserver(() => {
			this.decorateHeader();
		}).observe(this, { childList: true });
	</script>
	<script td-method="decorateHeader">
		this.id = this.textContent.trim().toLowerCase().replace(/\\s+/g, '-');

		const link = this.shadowRoot.querySelector('a');
		link.href = \`#\${this.id}\`;
	</script>
</header-anchor>
`)

	TramDeco.processTemplate(importTemplate);
})()

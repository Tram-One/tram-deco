describe('Tram-Deco Example Components', () => {
	// per Cypress best practices (https://docs.cypress.io/guides/references/best-practices#Creating-Tiny-Tests-With-A-Single-Assertion)
	// it is often better to run all tests together, rather than having unit-like tests... so we'll comment the intent of each test,
	// rather than doing a reset between each test. The results should still be just as obvious in the cypress runner!
	it('should validate all Tram-Deco APIs and Use Cases', () => {
		// visit index.html (this works because the test page doesn't need to be hosted to work!)
		cy.visit('../example/index.html');

		/* validate that the document title is set
    (side-effect of td-method="connectedCallback") */
		cy.title().should('eq', 'Tram-Deco is Cool!');

		/* validate that the title shadowDOM is rendered as expected */
		cy.get('custom-title').shadow().find('h1').should('exist');
		cy.get('custom-title').should('have.text', 'Tram-Deco is Cool!');

		/* validate that the callout-alert can be collapsed and expanded
    (side-effect of td-property="observedAttributes" and td-method="attributeChangedCallback") */
		cy.get('callout-alert').should('have.attr', 'collapsed');
		cy.get('callout-alert').shadow().find('button').should('have.text', 'expand');
		cy.get('callout-alert').shadow().find('#content').should('not.be.visible');
		cy.get('callout-alert').shadow().find('button').click();
		cy.get('callout-alert').shadow().find('button').should('have.text', 'collapse');
		cy.get('callout-alert').shadow().find('#content').should('be.visible');
		cy.get('callout-alert').should('not.have.attr', 'collapsed');

		/* validate that the individual counters can be incremented
    (similar to previous example, testing observed attributes and attributeChangedCallback) */
		cy.get('my-counter#a').should('have.attr', 'count', '0');
		cy.get('my-counter#a').shadow().find('button').should('have.text', 'Counter: 0');
		cy.get('my-counter#a').click();
		cy.get('my-counter#a').should('have.attr', 'count', '1');
		cy.get('my-counter#a').shadow().find('button').should('have.text', 'Counter: 1');
		cy.get('my-counter#b').should('have.attr', 'count', '12');
		cy.get('my-counter#b').shadow().find('button').should('have.text', 'Counter: 12');

		/* validate that exported components are rendered as expected */
		cy.get('spoiler-tag').shadow().find('[aria-hidden="true"]').should('exist');
		cy.get('spoiler-tag').click();
		cy.get('spoiler-tag').shadow().find('[aria-hidden="false"]').should('exist');
	});
});

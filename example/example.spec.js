// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const getTextContent = async (element) => {
	return await element.evaluate((el) => el.textContent);
};

test.describe('Tram-Deco Example Components', () => {
	test('should validate all Tram-Deco APIs and Use Cases', async ({ page }) => {
		// Construct the absolute file path and use the file:// protocol
		const filePath = path.resolve(__dirname, '../example/index.html');
		await page.goto(`file://${filePath}`);

		// validate that the document title is set
		await expect(page).toHaveTitle('Tram-Deco is Cool!');

		// validate that the title shadowDOM is rendered as expected
		const customTitle = page.locator('custom-title');
		await expect(customTitle.locator('h1')).toBeVisible();
		// await expect(customTitle).toHaveText('Tram-Deco is Cool!');
		const renderedText = await getTextContent(customTitle);
		expect(renderedText).toBe('Tram-Deco is Cool!');

		// validate that the callout-alert can be collapsed and expanded
		const calloutAlert = page.locator('callout-alert');
		await expect(calloutAlert).toHaveAttribute('collapsed', '');
		await expect(calloutAlert.locator('button')).toHaveText('expand');
		await expect(calloutAlert.locator('#content')).not.toBeVisible();
		await calloutAlert.locator('button').click();
		await expect(calloutAlert.locator('button')).toHaveText('collapse');
		await expect(calloutAlert.locator('#content')).toBeVisible();
		await expect(calloutAlert).not.toHaveAttribute('collapsed', '');

		// validate that the individual counters can be incremented
		const counterA = page.locator('my-counter#a');
		await expect(counterA).toHaveAttribute('count', '0');
		await expect(counterA.locator('button')).toHaveText('Counter: 0');
		await counterA.click();
		await expect(counterA).toHaveAttribute('count', '1');
		await expect(counterA.locator('button')).toHaveText('Counter: 1');

		const counterB = page.locator('my-counter#b');
		await expect(counterB).toHaveAttribute('count', '12');
		await expect(counterB.locator('button')).toHaveText('Counter: 12');

		// validate that exported components are rendered as expected
		const spoilerTag = page.locator('spoiler-tag');
		await expect(spoilerTag.locator('[aria-hidden="true"]')).toBeVisible();
		await spoilerTag.click();
		await expect(spoilerTag.locator('[aria-hidden="false"]')).toBeVisible();

		// validate that button that implements a shadow DOM from a parent with none works as expected
		const removableButton = page.locator('red-removable-button#r');
		await expect(removableButton).toBeVisible();
		await removableButton.click();
		await expect(removableButton).not.toBeVisible();

		// validate that extended counters with different shadow DOM work as expected
		const redCounter = page.locator('my-red-counter#d');
		await expect(redCounter).toHaveAttribute('count', '10');
		await redCounter.click();
		await expect(redCounter).toHaveAttribute('count', '11');

		// validate that extended counters with nothing different work as expected
		const copiedCounter = page.locator('my-copied-counter#c');
		await expect(copiedCounter).toHaveAttribute('count', '15');
		await copiedCounter.click();
		await expect(copiedCounter).toHaveAttribute('count', '16');

		// validate that extended counters with different callbacks work as expected
		const decrementingCounter = page.locator('my-decrementing-counter#e');
		await expect(decrementingCounter).toHaveAttribute('count', '5');
		await decrementingCounter.click();
		await expect(decrementingCounter).toHaveAttribute('count', '4');
	});
});

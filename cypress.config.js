const { defineConfig } = require('cypress');

module.exports = defineConfig({
	e2e: {
		specPattern: '**.cy.js',
		supportFile: false,
		includeShadowDom: true,
		experimentalWebKitSupport: true,

		setupNodeEvents(on, config) {
			return {
				// include npm version of electron
				browsers: config.browsers.concat({
					name: 'npm-electron',
					channel: 'stable',
					family: 'chromium',
					displayName: 'NPM Electron',
					version: '32.0.1',
					path: './node_modules/.bin/electron',
					majorVersion: 32,
				}),
			};
		},
	},
});

#!/usr/bin/env node

// usage - use this script to create a javascript version of one or more component definitions
// e.g. npx tram-deco export-components your-component-definition.html

const fs = require('fs');
const path = require('path');

// check to see if there is a predefined output filename (otherwise we will try to generate one)
const outputFlagIndex = process.argv.findIndex((arg) => arg === '-o' || arg === '--output');
const customOutputFile = outputFlagIndex !== -1 ? process.argv[outputFlagIndex + 1] : null;

const filePaths = process.argv.filter((arg) => {
	return arg.match(/\.html$/);
});

if (filePaths.length === 0) {
	console.error('Please provide at least one file path as an argument.');
	process.exit(1);
}

console.log('processing', filePaths, 'for export');
const componentDefinitions = filePaths.map((filePath) => fs.readFileSync(filePath, 'utf8'));

// load the core Tram-Deco library
const coreLibrary = fs.readFileSync(path.join(__dirname, '../tram-deco.min.js')).toString();

const formattedDefinitions = componentDefinitions
	.map((componentCode) => {
		const formattedComponentCode = componentCode
			.replaceAll('\\', '\\\\')
			.replaceAll('`', '\\`')
			.replaceAll('${', '\\${');
		return formattedComponentCode;
	})
	.join('\n');

const finalTemplate = `
(() => {
	${coreLibrary}

	const importTemplate = document.createElement('template')
	importTemplate.setHTMLUnsafe(\`${formattedDefinitions}\`)

	TramDeco.processTemplate(importTemplate);
})()
`;

const isSingleFile = filePaths.length === 1;
// if we are processing a single file, use that as the file name
// if we are processing more than one file, use the directory name
const generatedOutputFileName = isSingleFile
	? path.basename(filePaths[0], '.html') + '.js'
	: path.basename(process.cwd()) + '.js';

fs.writeFileSync(customOutputFile || generatedOutputFileName, finalTemplate);

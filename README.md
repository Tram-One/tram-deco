# nite-lite

Experimental interface for Declarative Custom Elements using Declarative Shadow DOM

## example

```html
<!-- include the nite-lite library -->
<script defer src="https://unpkg.com/nite-lite@1"></script>

<!-- define some web components -->
<template nl-definitions>
	<!-- definition for a custom-title tag! -->
	<custom-title>
		<!-- declarative shadow dom for the insides -->
		<template shadowrootmode="open">
			<!-- styles, for just this element -->
			<style>
				h1 {
					color: blue;
				}
			</style>

			<!-- dom, to show on the page -->
			<h1>
				<slot>Hello World</slot>
			</h1>
			<hr />

			<!-- scripts, that run when the component mounts -->
			<script>
				document.title = document.nlElement.textContent || 'Hello World';
			</script>
		</template>
	</custom-title>
</template>

<!-- use our new element! -->
<custom-title>nite-lite is cool!</custom-title>
```

## how to use

Simply include the nite-lite script at the top of your page. In order for nite-lite to process your templates correctly,
you'll want to include the `defer` attribute in the script.

> [!important] nite-lite depends on declarative shadow DOM, which at the time of writing is not available on all
> browsers check [caniuse.com](https://caniuse.com/declarative-shadow-dom) to understand browser support and coverage
> here.

```html
<script defer src="https://unpkg.com/nite-lite@1"></script>
```

If you want the minified version you can point to that instead:

```html
<script defer src="https://unpkg.com/nite-lite@1/nite-lite.min.js"></script>
```

## what is nite-lite?

nite-lite is an experimental way to build web components in a declarative way. It uses a very minimal amount of
javascript to accomplish this, and tries to make use of existing APIs when possible.

## api

There are two non-standard things provided when using nite-lite:

1. `nl-definitions` - an attribute for template tags, that turns all elements in them into web component definitions
2. `document.nlElement` - a pointer to the current element being mounted, can be referenced in script tags when building
   components

## gotchas

When building web components with nite-lite, there are a few things to keep in mind.

### script tags shared context

Be careful when building complex logic and saving variables in script tags. All script tags share context, so if you use
`const`, and use an element twice, you are likely to get an error that the variable is already defined.

### document.currentScript is undefined

Because script tags are loaded in a shadow root, they won't have access to the element that mounted them. This is why
`document.nlElement` is provided.

## contributions / discussions

If you think this is useful or interesting, I'd love to hear your thoughts! Feel free to
[reach out to me on mastodon](https://fosstodon.org/@jrjurman), or join the
[Tram-One discord](https://discord.gg/dpBXAQC).

As for feature requests, note that this is very much intended to be an experimental project, and feature-lite, leaning
heavily on standard APIs unless absolutely necessary. If you would like a more feature rich Declarative HTML Experience,
I'd recommend checking out [Tram-Lite](https://tram-one.io/tram-lite/)!

# Tram-Deco

Experimental interface for Declarative Custom Elements using Declarative Shadow DOM

## Example

```html
<!-- include the Tram-Deco library -->
<script defer src="https://unpkg.com/tram-deco@1"></script>

<!-- define some web components -->
<template td-definitions>
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
        document.title = document.tdElement.textContent || 'Hello World';
      </script>
    </template>
  </custom-title>
</template>

<!-- use our new element! -->
<custom-title>Tram-Deco is Cool!</custom-title>
```

[Live on Codepen](https://codepen.io/JRJurman/pen/Jjzvmqz)

## How to use

Simply include the Tram-Deco script at the top of your page. In order for Tram-Deco to process your templates correctly,
you'll want to include the `defer` attribute in the script.

> [!important]
>
> Tram-Deco depends on declarative shadow DOM, which at the time of writing is not available on all browsers check
> [caniuse.com](https://caniuse.com/declarative-shadow-dom) to understand browser support and coverage here.

```html
<script defer src="https://unpkg.com/tram-deco@1"></script>
```

If you want the minified version you can point to that instead:

```html
<script defer src="https://unpkg.com/tram-deco@1/tram-deco.min.js"></script>
```

## What is Tram-Deco?

Tram-Deco is an experimental way to build web components in a declarative way. It uses a very minimal amount of
javascript to accomplish this, and tries to make use of existing APIs when possible.

## API

There are two non-standard things provided when using Tram-Deco:

1. `td-definitions` - an attribute for template tags, that turns all elements in them into web component definitions
2. `document.tdElement` - a pointer to the current element being mounted, can be referenced in script tags when building
   components

## Gotchas

When building web components with Tram-Deco, there are a few things to keep in mind.

### Script tags share context

Be careful when building complex logic and saving variables in script tags. All script tags share context, so if you use
`const`, and use an element twice, you are likely to get an error that the variable is already defined.

### document.currentScript is undefined

Because script tags are loaded in a shadow root, they won't have access to the element that mounted them. This is why
`document.tdElement` is provided.

## contributions / discussions

If you think this is useful or interesting, I'd love to hear your thoughts! Feel free to
[reach out to me on mastodon](https://fosstodon.org/@jrjurman), or join the
[Tram-One discord](https://discord.gg/dpBXAQC).

As for feature requests, note that this is very much intended to be an experimental project, and feature-lite, leaning
heavily on standard APIs unless absolutely necessary. If you would like a more feature rich Declarative HTML Experience,
I'd recommend checking out [Tram-Lite](https://tram-one.io/tram-lite/)!

# Tram-Deco

_Declarative Custom Elements using native Web Component APIs and specs._

Tram-Deco provides a more elegant interface for building Web Components, that remains as close as possible to the
existing browser APIs. Tram-Deco is an experiment to determine the value of a declarative interface for building Web
Components, without the addition of APIs that don't already exist.

## Example

```html
<!-- include the Tram-Deco library -->
<script src="https://unpkg.com/tram-deco@3"></script>
<script>
  TramDeco.watch();
</script>

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
      <script td-connectedcallback>
        document.title = this.textContent || 'Hello World';
      </script>
    </template>
  </custom-title>
</template>

<!-- use our new element! -->
<custom-title>Tram-Deco is Cool!</custom-title>
```

[Live on Codepen](https://codepen.io/JRJurman/pen/NWJeOOz)

## How to use

> [!important]
>
> Tram-Deco depends on declarative shadow DOM, which at the time of writing is not available on all browsers. Check
> [caniuse.com](https://caniuse.com/declarative-shadow-dom) to understand browser support and coverage here.

Tram-Deco exposes several different API methods that you can call to build Web Components, depending on your use case.

<dl>
<dt><code>TramDeco.watch()</code></dt>
<dd>

The most straight forward way to build Web Component definitions. The `watch()` function starts a mutation observer that
watches for template tags with the `td-definitions` attribute. When these appear in the DOM, Tram-Deco will process
them, and build the component definitions inside. When it finishes processing these, it updates the template with an
attribute `defined`.

</dd>
<dt><code>TramDeco.define(elementDefinition)</code></dt>
<dd>

The `define` function takes in a single tag with a declarative shadow dom template, and turns it into a Web Component
definition. In the above example, it is everything inside the `td-definitions` template. This is useful if you have a
single component you would like to define, potentially with a specific version of Tram-Deco.

</dd>
<dt><code>TramDeco.import(componentPath)</code></dt>
<dd>

**IMPORTANT: THIS REQUIRES `Document.parseHTMLUnsafe` WHICH IS NOT AVAILABLE IN ANY BROWSER**

The `import` function takes in a path to a component definition file, and defines all component definitions inside as
new Web Component definitions. In the above example, it is everything inside the `td-definitions` template. This is
useful if you want to save your component definitions in separate files.

</dd>
</dl>

```html
<script src="https://unpkg.com/tram-deco@3"></script>
```

If you want the minified version you can point to that instead:

```html
<script src="https://unpkg.com/tram-deco@3/tram-deco.min.js"></script>
```

## What is Tram-Deco?

Tram-Deco is an experimental way to build web components in a declarative way. It uses a very minimal amount of
javascript to accomplish this, and tries to make use of existing APIs when possible.

## API

Tram-Deco exposes the following attributes to help you build and configure declarative web components

### Top Level API

<dl>
<dt><code>td-definitions</code></dt>
<dd>
  Attribute to be used on the <code>template</code> surrounding your component definitions. You can have multiple templates,
  or just a single one for all of your definitions. These need to be on the page before Tram-Deco is loaded.
</dd>
</dl>

### Component API

These attributes can be used to provide logic for different life cycle events of your component. They follow the
standard API for Web Components.

<dl>
<dt><code>td-observedattributes</code></dt>
<dd>

Attribute to be used on a custom element tag for your component definition. This attribute defines the values for the
static `observedAttributes` on the component, and drives the `attributeChangedCallback` for your component. It should be
a space delimited list of values.

</dd>
<dt><code>td-constructor</code></dt>
<dd>

Attribute to be used on a `script` tag in your component definition. This script hooks into the `constructor` method,
and will be called when the element is being constructed, after `super()` and after we have cloned the content into the
shadow root of the element.

</dd>
<dt><code>td-connectedcallback</code></dt>
<dd>

Attribute to be used on a `script` tag in your component definition. This script hooks into the `connectedCallback`
method, and will be called when the element is appended to the DOM.

</dd>
<dt><code>td-disconnectedcallback</code></dt>
<dd>

Attribute to be used on a `script` tag in your component definition. This script hooks into the `disconnectedCallback`
method, and will be called when the element is removed from the DOM.

</dd>
<dt><code>td-adoptedcallback</code></dt>
<dd>

Attribute to be used on a `script` tag in your component definition. This script hooks into the `adoptedCallback`
method, and will be called when the element moves between documents.

</dd>
<dt><code>td-attributechangedcallback</code></dt>
<dd>

Attribute to be used on a `script` tag in your component definition. This script hooks into the
`attributeChangedCallback` method, and will be called when one of the element's attributes are added, removed, or
updated.

</dd>
</dl>

#### Example Using Component API

```html
<script src="https://unpkg.com/tram-deco@3"></script>
<script>
  TramDeco.watch();
</script>

<template td-definitions>
  <!-- td-observedattributes, to watch for attribute changes on count -->
  <my-counter td-observedattributes="count">
    <template shadowrootmode="open" shadowrootdelegatesfocus>
      <button><slot>Counter</slot>: <span>0</span></button>

      <!-- when we mount this component, add an event listener -->
      <script td-connectedcallback>
        console.log('Counter Mounted!', this);
        const button = this.shadowRoot.querySelector('button');
        button.addEventListener('click', (event) => {
          const newCount = parseInt(this.getAttribute('count')) + 1;
          this.setAttribute('count', newCount);
        });
      </script>

      <!-- when the count updates, update the template -->
      <script td-attributechangedcallback>
        const span = this.shadowRoot.querySelector('span');
        span.textContent = this.getAttribute('count');
      </script>
    </template>
  </my-counter>
</template>

<my-counter count="0">Tram-Deco</my-counter>
```

[Live on Codepen](https://codepen.io/JRJurman/pen/VwRqEBm)

## contributions / discussions

If you think this is useful or interesting, I'd love to hear your thoughts! Feel free to
[reach out to me on mastodon](https://fosstodon.org/@jrjurman), or join the
[Tram-One discord](https://discord.gg/dpBXAQC).

As for feature requests, note that this is very much intended to be an experimental project, and feature-lite, leaning
heavily on standard APIs unless absolutely necessary. If you would like a more complex Declarative HTML Experience, I'd
recommend checking out [Tram-Lite](https://tram-one.io/tram-lite/)!

# Tram-Deco

<img src="./logo.png" width="200px" alt="Tram-Deco logo, minimalistic icon that looks like the front of a red trolly car, with a yellow tinted window and three headlights, made of simple geometric shapes">

_Declarative Custom Elements using native Web Component APIs and specs._

Tram-Deco provides a more elegant interface for building Web Components, that remains as close as possible to the
existing browser APIs. Tram-Deco is an experiment to determine the value of a declarative interface for building Web
Components, without the addition of APIs that don't already exist.

<!-- prettier-ignore -->
<img src="https://img.shields.io/npm/dm/tram-deco.svg" alt="Downloads"> <img src="https://img.shields.io/npm/v/tram-deco.svg" alt="Version">
<a href="https://unpkg.com/tram-deco@6/tram-deco.min.js"><img src="https://img.shields.io/badge/gzip-670B-006369.svg?style=flat" alt="Gzipped Size"></a>
<a href="https://github.com/Tram-One/tram-deco/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/tram-deco.svg" alt="License"></a>
<a href="https://discord.gg/dpBXAQC"><img src="https://img.shields.io/badge/discord-join-5865F2.svg?style=flat" alt="Join Discord"></a>
<a href="https://codepen.io/pen?template=JjzQmaL"><img src="https://img.shields.io/badge/codepen-template-DD6369.svg?style=flat" alt="Codepen Template"></a>

## Example

```html
<!-- include the Tram-Deco library -->
<script src="https://unpkg.com/tram-deco@6"></script>

<!-- define some web components -->
<template id="componentDefinitions">
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
    </template>

    <!-- scripts, that let you define lifecycle methods -->
    <script td-method="connectedCallback">
      this.shadowRoot.querySelector('slot').addEventListener('slotchange', () => {
        document.title = this.textContent || 'Hello World';
      });
    </script>
  </custom-title>
</template>

<!-- process the template to generate new definitions -->
<script>
  TramDeco.processTemplate(componentDefinitions);
</script>

<!-- use our new element! -->
<custom-title>Tram-Deco is Cool!</custom-title>
```

[Live on Codepen](https://codepen.io/JRJurman/pen/mdYbxgw)

## How to use

There are two ways to use Tram-Deco in your project - you can either have component definitions in your served HTML
template (in template tags), or you can export the components as part of a build step to be imported with script tags.

### Template Component Definitions

If you don't want a build step, or are just building components for a dedicated static page, you can do the following to
write component definitions in your main template:

Include the Tram-Deco library (you can point to either `tram-deco.js` or `tram-deco.min.js`)

```html
<script src="https://unpkg.com/tram-deco@6/tram-deco.min.js"></script>
```

Create a template tag with your component definitions, and then use Tram-Deco to process that template

```html
<template id="myDefinitions">
  <!-- component definitions -->
</template>

<script>
  TramDeco.processTemplate(myDefinitions);
</script>
```

### Export JS Definition

> [!important]
>
> Tram-Deco import depends on `setHTMLUnsafe`, which is a recently released feature. Check
> [caniuse.com](https://caniuse.com/?search=setHTMLUnsafe) to understand browser support and coverage here.

If you want to export your component definition, to be used in other projects, or to organize the components in
different files, you can do the following:

Create a component definition file (`.html`) - this can include as many top-level component definitions as you'd like.

```html
<!-- my-counter.html -->
<my-counter>
  <template shadowrootmode="open">
    <!-- ... -->
  </template>
</my-counter>
```

Run the following command in the command line, or as part of a build step:

```sh
npx tram-deco export-components my-counter.html
```

This will create a JS file that can be imported using a standard script tag:

```html
<script src="./my-counter.js">
```

## API

### JS API

<dl>
<dt><code>TramDeco.processTemplate(templateTag)</code></dt>
<dd>

The `processTemplate` function takes in a single template tag with several component definitions, and builds Web
Component definitions for all of them in the global custom elements registry.

</dd>

<dt><code>TramDeco.define(elementDefinition)</code></dt>
<dd>

The `define` function takes in a single element definition and builds a Web Component definition for the global custom
elements registry. It is the underlying method used in `processTemplate`, and probably does not need to be called in
isolation.

</dd>
</dl>

### Component API

These attributes can be used to provide logic for different life cycle events of your component. They follow the
standard API for Web Components.

<dl>
<dt><code>td-property="propertyName"</code></dt>
<dd>

Attribute to be used on a `script` tag in your component definition. This assigned property name will be attached to the
element as a static property, and can be useful for adding `observedAttributes`, `formAssociated`, `disableInternals`,
or `disableShadow`. You can also define custom static properties for your element.

</dd>
<dt><code>td-method="methodName"</code></dt>
<dd>

Attribute to be used on a `script` tag in your component definition. The assigned method name will be attached to the
element, and can be useful for adding to the `constructor`, or setting other Web Component APIs, such as
`connectedCallback`, `disconnectedCallback`, `adoptedCallback`, or `attributeChangedCallback`. You can also define
custom methods for your element.

</dd>
</dl>

#### Example Using Component API

```html
<script src="https://unpkg.com/tram-deco@6"></script>

<template id="myCounter">
  <my-counter>
    <!-- observed attributes, to watch for attribute changes on count -->
    <script td-property="observedAttributes">
      ['count'];
    </script>

    <template shadowrootmode="open" shadowrootdelegatesfocus>
      <button><slot>Counter</slot>: <span>0</span></button>
    </template>

    <!-- when we mount this component, add an event listener -->
    <script td-method="connectedCallback">
      const button = this.shadowRoot.querySelector('button');
      button.addEventListener('click', (event) => {
        const newCount = parseInt(this.getAttribute('count')) + 1;
        this.setAttribute('count', newCount);
      });
    </script>

    <!-- when the count updates, update the template -->
    <script td-method="attributeChangedCallback">
      const span = this.shadowRoot.querySelector('span');
      span.textContent = this.getAttribute('count');
    </script>
  </my-counter>
</template>

<script>
  TramDeco.processTemplate(myCounter);
</script>

<my-counter count="0">Tram-Deco</my-counter>
```

[Live on Codepen](https://codepen.io/JRJurman/pen/RwmbMmg)

## contributions / discussions

If you think this is useful or interesting, I'd love to hear your thoughts! Feel free to
[reach out to me on mastodon](https://fosstodon.org/@jrjurman), or join the
[Tram-One discord](https://discord.gg/dpBXAQC).

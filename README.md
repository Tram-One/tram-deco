# Tram-Deco

<img src="./logo.png" width="200px" alt="Tram-Deco logo, minimalistic icon that looks like the front of a red trolly car, with a yellow tinted window and three headlights, made of simple geometric shapes">

_Declarative Custom Elements using native Web Component APIs and specs._

Tram-Deco provides a more elegant interface for building Web Components, that remains as close as possible to the
existing browser APIs. Tram-Deco is a experiment to understand what a declarative interface for building Web Components
might look like, without the addition of APIs that don't already exist.

<!-- prettier-ignore -->
<img src="https://img.shields.io/npm/dm/tram-deco.svg" alt="Downloads"> <img src="https://img.shields.io/npm/v/tram-deco.svg" alt="Version">
<a href="https://unpkg.com/tram-deco@6/tram-deco.min.js"><img src="https://img.shields.io/badge/gzip-722B-006369.svg?style=flat" alt="Gzipped Size"></a>
<a href="https://github.com/Tram-One/tram-deco/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/tram-deco.svg" alt="License"></a>
<a href="https://discord.gg/dpBXAQC"><img src="https://img.shields.io/badge/discord-join-5865F2.svg?style=flat" alt="Join Discord"></a>
<a href="https://codepen.io/pen?template=JjzQmaL"><img src="https://img.shields.io/badge/codepen-template-DD6369.svg?style=flat" alt="Codepen Template"></a>
<a href="https://chatgpt.com/g/g-wTNI3WZS6-tram-deco"><img src="https://img.shields.io/badge/gpt-tram--deco-FFCC49.svg?style=flat" alt="Codepen Template"></a>

## Example

```html
<!-- include the Tram-Deco library -->
<script src="https://unpkg.com/tram-deco@6"></script>

<!-- define some web components -->
<template id="definitions">
  <!-- definition for a custom header tag -->
  <header-anchor>
    <!-- declarative shadow dom for the insides -->
    <template shadowrootmode="open">
      <!-- styles, for just this element -->
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

      <!-- dom, to show on the page -->
      <a><slot></slot></a>
    </template>

    <!-- scripts, that let you define lifecycle and custom methods -->
    <script td-method="constructor">
      new MutationObserver(() => {
        this.decorateHeader();
      }).observe(this, { childList: true });
    </script>
    <script td-method="decorateHeader">
      this.id = this.textContent.trim().toLowerCase().replace(/\s+/g, '-');

      const link = this.shadowRoot.querySelector('a');
      link.href = `#${this.id}`;
    </script>
  </header-anchor>
</template>

<!-- process the template to generate new definitions -->
<script>
  TramDeco.processTemplate(definitions);
</script>

<!-- use our new element! -->
<header-anchor>
  <h1>Introduction</h1>
</header-anchor>
This is some introductory content
<header-anchor>
  <h2>More Details</h2>
</header-anchor>
If you want to read more, checkout the README.
```

[Live on Codepen](https://codepen.io/JRJurman/pen/RwXPqEe)

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

These attributes can be used to provide or inherit logic for different life cycle events of your component. They follow
the standard API for Web Components.

<dl>
<dt><code>td-extends="tag-name"</code></dt>
<dd>

Attribute to be used on the top-level definition tag. The class associated with the `tag-name` will be used as a parent
class when building this Web Component definition. That tag must be already registered in the `customElements` registry.

</dd>
<dt><code>td-property="propertyName"</code></dt>
<dd>

Attribute to be used on a `script` tag in your component definition. The assigned property name will be attached to the
element as a static property, and can be useful for adding `observedAttributes`, `formAssociated`, `disableInternals`,
or `disableShadow`. You can also define custom static properties for your element.

</dd>
<dt><code>td-method="methodName"</code></dt>
<dd>

Attribute to be used on a `script` tag in your component definition. The assigned method name will be attached to the
element, and can be useful for adding to the `constructor`, or setting other Web Component APIs, such as
`connectedCallback`, `disconnectedCallback`, `adoptedCallback`, or `attributeChangedCallback`. You can also define
custom methods for your element.

> [!tip]
>
> If you are using `attributeChangedCallback` you can access the parameters (`name`, `oldValue`, and `newValue`) using
> the `arguments` keyword. See the example below to see how this works!

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
      const [name, oldValue, newValue] = arguments;
      if (name === 'count') {
        const span = this.shadowRoot.querySelector('span');
        span.textContent = newValue;
      }
    </script>
  </my-counter>
</template>

<script>
  TramDeco.processTemplate(myCounter);
</script>

<my-counter count="0">Tram-Deco</my-counter>
```

[Live on Codepen](https://codepen.io/JRJurman/pen/RwmbMmg)

## Motivation

Tram-Deco was written to showcase a potential implementation of Declarative Custom Elements that could be trivially
adopted by browser implementers. While many alternatives exist, most include new custom APIs, behavior, or syntax that
would necessitate discussions, deliberations, and implementation before making progress on the true goal.

Tram-Deco strives to be as close to existing APIs as possible, so that the path to browser implementation is as direct
as possible. While many libraries exist to make Web-Component creation easier and more elegant, this library exclusively
highlights how we can leverage existing APIs to get to Declarative Custom Elements.

## contributions / discussions

If you think this is useful or interesting, I'd love to hear your thoughts! Feel free to
[reach out to me on mastodon](https://fosstodon.org/@jrjurman), or join the
[Tram-One discord](https://discord.gg/dpBXAQC).

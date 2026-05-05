---
name: "Unlayer Alpine.js"
description: "Alpine.js bindings for lightweight Unlayer editor embeds."
ecosystem: "Community SDKs"
category: "Alpine.js"
language: "JavaScript"
frameworks: ["Alpine.js", "Unlayer"]
repo: "https://github.com/community-sdks/unlayer-alpinejs"
registry: "https://www.npmjs.com/package/@community-sdks/unlayer-alpinejs"
install: "npm install @community-sdks/unlayer-alpinejs"
status: "stable"
featured: false
---

## Lightweight Unlayer Embeds With Alpine

Not every editor integration needs a full frontend framework.

Sometimes you just want to drop an editor into a page, keep the state in JavaScript, export the design, upload images, and maybe search templates.

That is where **Unlayer Alpine.js** fits.

It is a small Alpine.js adapter for `@community-sdks/unlayer-ts`, built for lightweight Unlayer editor embeds without bringing Vue, React, Livewire, or Filament into the page.

## Why Alpine

Alpine is useful when the page is mostly server-rendered but still needs small interactive islands.

That makes it a natural fit for simple admin pages, Blade views, static examples, lightweight dashboards, package demos, and custom internal tools.

Instead of creating a full SPA just to mount an email editor, you can register an Alpine component and use it directly in HTML.

The TypeScript SDK handles the common Unlayer behavior.

The Alpine adapter makes that behavior feel native inside Alpine templates.

## What It Does

The package registers an Alpine component that wraps the Unlayer TypeScript SDK.

Install it with the core SDK and Alpine:

```bash
npm install @community-sdks/unlayer-alpinejs @community-sdks/unlayer-ts alpinejs
```

Then register it with Alpine:

```ts
import Alpine from 'alpinejs'
import { registerUnlayerAlpine } from '@community-sdks/unlayer-alpinejs'

registerUnlayerAlpine(Alpine)

Alpine.start()
```

You can also choose a custom component name:

```ts
registerUnlayerAlpine(Alpine, 'unlayerEditor')
```

That gives your HTML a clean Alpine entry point for mounting and controlling the editor.

## Alpine-Friendly API

The adapter exposes editor state and methods in a way that works naturally with Alpine.

It includes state flags like:

```txt
ready
mounted
loading
error
state
templates
templatesOpen
templatesLoading
templateSearch
```

And editor methods like:

```txt
mount()
isReady()
getState()
setState(state)
loadDesign(design)
exportState()
searchTemplates(options)
refreshTemplates()
loadTemplate(slug)
chooseTemplate(templateOrSlug)
openTemplates()
closeTemplates()
setTemplateSearch(search)
```

That means the page can react to editor loading, export current HTML/design state, open a template picker, search templates, and load designs without manually wiring every Unlayer call from scratch.

## Usage Shape

The package is meant to keep the HTML simple.

You mount the component with Alpine, point it at an editor container, and call methods from buttons or UI controls.

The exact UI can stay fully application-owned.

That is important because an email editor may be used in many different places:

A newsletter builder.
A campaign template screen.
A transactional email editor.
A CMS page section.
A small internal admin tool.

The adapter provides the behavior, but the application still controls the interface.

## Template Search

The Alpine adapter can use the same template client from `@community-sdks/unlayer-ts`.

Register a template client that talks to your backend:

```ts
import Alpine from 'alpinejs'
import { registerUnlayerAlpine } from '@community-sdks/unlayer-alpinejs'
import { HttpTemplateClient } from '@community-sdks/unlayer-ts'

window.templateClient = new HttpTemplateClient({
    searchUrl: '/templates',
    loadUrl: '/templates/:slug',
})

registerUnlayerAlpine(Alpine)

Alpine.start()
```

Then your Alpine component can search and load templates through your own backend routes.

Your backend should expose routes like:

```txt
GET /templates
GET /templates/{slug}
```

Relative URLs call the same domain as the page. For example, `/templates` becomes a request to the current application domain.

If the template backend is on another domain, use full URLs:

```ts
window.templateClient = new HttpTemplateClient({
    searchUrl: 'https://api.example.com/templates',
    loadUrl: 'https://api.example.com/templates/:slug',
})
```

In that case, the API domain must allow CORS for your frontend domain.

## Browser CORS Reality

This is the practical part that matters.

Unlayer's public stock template search endpoint does not allow browser CORS requests.

So browser code should not call Unlayer's stock template API directly.

The clean flow is:

```txt
Alpine page -> Your backend template endpoint -> Unlayer template API
```

Using Axios instead of `fetch` does not bypass CORS. The browser enforces CORS before JavaScript can read the response.

That is why this adapter works nicely with `HttpTemplateClient`: the frontend talks to your backend, and your backend talks to Unlayer.

## Uploads Stay Application-Owned

Image uploads are intentionally not hardcoded into the package.

Every application has different storage rules.

One project may upload to local storage.
Another may upload to S3 or Cloudflare R2.
Another may need signed URLs, tenant-based folders, or media-library integration.

So the adapter lets the application provide an `uploadImage(file)` function and return the public URL.

```ts
uploadImage: async file => {
    return 'https://example.com/path/to/uploaded-image.png'
}
```

That keeps the package flexible and avoids forcing storage architecture into a frontend adapter.

## Development Examples

The repository includes local examples for testing the adapter.

Build the package:

```bash
npm run build
```

Serve the examples:

```bash
npm run examples:serve
```

Then open one of the example pages:

```txt
http://127.0.0.1:4174/examples/basic.html
http://127.0.0.1:4174/examples/http-template-client.html
```

The examples should be served over HTTP, not opened directly with `file://`, because browser module imports from the local filesystem are blocked.

## Why This Package Exists

Unlayer Alpine.js is not trying to be the final admin package.

It is the lightweight adapter layer.

If you need a plain browser integration, this package gives you the editor behavior without a heavy framework. If you need Laravel Livewire syncing, there is a Livewire wrapper. If you need Filament fields and resources, there is a Filament package.

This package sits in the middle nicely:

Simple enough for HTML pages.
Structured enough to reuse the TypeScript SDK.
Flexible enough to connect to custom backend routes.

## Part of the Unlayer Integration Stack

The bigger idea is to avoid rewriting the same Unlayer integration four different ways.

`unlayer-ts` provides the framework-free base.
`unlayer-alpinejs` exposes that base through Alpine.
`unlayer-livewire` connects it to Laravel and Livewire.
`filament-unlayer` makes it usable inside Filament admin panels.

Each package has its own purpose, but they share the same direction: make Unlayer easier to embed in real applications.

## Package

```bash
npm install @community-sdks/unlayer-alpinejs
```

Repository:

```txt
https://github.com/community-sdks/unlayer-alpinejs
```

Registry:

```txt
https://www.npmjs.com/pack
```


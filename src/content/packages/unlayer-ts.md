---
name: "Unlayer TS"
description: "TypeScript helpers and types for working with the Unlayer editor."
ecosystem: "Community SDKs"
category: "JavaScript / TypeScript"
language: "TypeScript"
frameworks: ["Unlayer"]
repo: "https://github.com/community-sdks/unlayer-ts"
registry: "https://www.npmjs.com/package/@community-sdks/unlayer-ts"
install: "npm install @community-sdks/unlayer-ts"
status: "stable"
featured: true
---

## A Small Core Layer for Unlayer

Unlayer is a powerful editor, but most real integrations quickly need the same things around it.

Mount the editor.
Keep editor state somewhere.
Export HTML and design JSON.
Upload images.
Search templates.
Load a selected template.
Connect browser code to backend proxy routes when CORS gets in the way.

**Unlayer TS** is the small TypeScript layer I wanted underneath all of that.

It is not tied to Vue, React, Alpine, Livewire, Filament, or any specific backend. It is the framework-free package that the rest of the Unlayer ecosystem can build on.

## Why Start With TypeScript

Before building framework adapters, the core behavior should be boring and reusable.

That is the point of this package.

Instead of repeating the same Unlayer setup logic inside every integration, the TypeScript SDK provides a shared wrapper around the editor and a typed way to work with editor state, image uploads, and templates.

The framework packages can then focus on their own job.

Alpine can focus on `x-data`.
Livewire can focus on Blade and synced state.
Filament can focus on form fields and admin resources.

The TypeScript package stays as the common base.

## What It Does

Unlayer TS gives you a framework-free editor wrapper.

You create an editor instance, pass the editor element ID, configure the display mode, provide an initial state, and mount it.

It also supports image uploads through a callback and change handling through an `onChange` callback.

```ts
import UnlayerEditor, { HttpTemplateClient } from '@community-sdks/unlayer-ts'

const templateClient = new HttpTemplateClient({
    searchUrl: '/templates',
    loadUrl: '/templates/:slug',
})

const editor = new UnlayerEditor({
    id: 'editor',
    displayMode: 'email',
    templateClient,
    state: {
        html: '',
        design: {},
    },
    uploadImage: async file => {
        const data = new FormData()

        data.append('file', file)

        const response = await fetch('/your-upload-endpoint', {
            method: 'POST',
            body: data,
        })

        const body = await response.json()

        return body.url
    },
    onChange: state => {
        console.log(state.html, state.design)
    },
})

await editor.mount()
```

That gives the application a clean object to work with instead of spreading editor setup logic across random frontend files.

## Template Search

One of the more useful parts of the package is template handling.

You can search templates through the editor wrapper:

```ts
const templates = await editor.searchTemplates({
    search: 'newsletter',
    type: 'email',
    premium: false,
    limit: 20,
    offset: 0,
    collection: '',
    sort: 'recent',
})
```

Then load a selected template by slug:

```ts
await editor.loadTemplate(templates[0].slug)
```

This is the kind of flow that shows up again and again in email builders, template pickers, campaign systems, onboarding editors, and CMS panels.

## Browser CORS Reality

The important practical detail is that browser applications cannot directly call Unlayer's public stock template search endpoint because of CORS.

So the clean browser architecture is:

```txt
Browser frontend -> Your backend endpoint -> Unlayer template API
```

That is why the package includes `HttpTemplateClient`.

Your frontend talks to your own backend routes:

```ts
templateClient: new HttpTemplateClient({
    searchUrl: '/templates',
    loadUrl: '/templates/:slug',
})
```

Your backend then proxies the request to Unlayer.

This keeps the frontend simple and avoids fighting the browser security model.

## Local or Remote Template Backends

Relative URLs call the same domain as the page.

```ts
templateClient: new HttpTemplateClient({
    searchUrl: '/templates',
    loadUrl: '/templates/:slug',
})
```

For example, `/templates` becomes a request to the current application domain.

If the template backend lives on another domain, you can use full URLs:

```ts
templateClient: new HttpTemplateClient({
    searchUrl: 'https://api.example.com/templates',
    loadUrl: 'https://api.example.com/templates/:slug',
})
```

In that case, your backend still needs to allow CORS for the frontend domain.

The browser calls your backend. Your backend calls Unlayer.

## Outside the Browser

If the SDK is used outside the browser, the direct stock template client can be used instead.

That makes the package useful both as a browser integration helper and as a lower-level SDK layer for server-side or tooling usage.

## Development Examples

The package includes local examples for testing the editor integration.

```bash
npm run build
npm run examples:serve
```

Then open the examples through the local HTTP server:

```txt
http://127.0.0.1:4173/examples/basic.html
http://127.0.0.1:4173/examples/http-template-client.html
```

The examples should be served over HTTP, not opened directly with `file://`, because browser module imports from the local filesystem are blocked.

## Why This Package Matters

This package is intentionally not the final user-facing integration.

That is the point.

It is the core layer that lets the other packages stay smaller and cleaner.

`unlayer-alpinejs` can build on top of it for lightweight browser usage.
`unlayer-livewire` can build on top of it for Laravel and Livewire state syncing.
`filament-unlayer` can build on top of it for Filament forms and admin panels.

Instead of every package solving the same editor lifecycle and template-client problem again, they can share the same TypeScript foundation.

## Package

```bash
npm install @community-sdks/unlayer-ts
```

Repository:

```txt
https://github.com/community-sdks/unlayer-ts
```

Registry:

```txt
https://www.npmjs.com/package/@community-sdks/unlayer-ts
```


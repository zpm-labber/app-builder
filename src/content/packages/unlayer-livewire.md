---
name: "Unlayer Livewire"
description: "Livewire wrapper for the Unlayer email editor."
ecosystem: "Community SDKs"
category: "Unlayer"
language: "PHP"
frameworks: ["Laravel", "Livewire"]
repo: "https://github.com/community-sdks/unlayer-livewire"
registry: "https://packagist.org/packages/community-sdks/unlayer-livewire"
install: "composer require community-sdks/unlayer-livewire"
status: "stable"
featured: true
---

## Unlayer Inside Livewire

A good email editor integration is not only about rendering the editor.

It has to keep state synced.
It has to export HTML and design JSON.
It has to upload images.
It has to load templates.
It has to work inside a Laravel application without turning the whole page into a frontend app.

**Unlayer Livewire** is a Laravel and Livewire wrapper for the Unlayer editor, built on top of the Alpine adapter and the TypeScript SDK.

The goal is simple: use Unlayer in Livewire pages while keeping the browser editor lifecycle in the frontend packages where it belongs.

## Why This Package Exists

Livewire is great when you want server-rendered Laravel pages with rich interactions.

But Unlayer is a browser editor.

That means the integration has to respect both sides:

The editor lifecycle belongs in JavaScript.
The application state belongs in Livewire.
Uploads should use Laravel storage.
Template proxy routes should live in Laravel.
The Blade usage should stay simple.

This package connects those pieces without forcing every Laravel project to rebuild the same bridge.

## Built on the Unlayer Stack

Unlayer Livewire does not try to duplicate the lower-level editor logic.

It wraps `@community-sdks/unlayer-alpinejs`, which itself wraps `@community-sdks/unlayer-ts`.

That keeps the responsibilities clean.

`unlayer-ts` handles the framework-free editor wrapper.
`unlayer-alpinejs` exposes that wrapper through Alpine.
`unlayer-livewire` connects the editor to Laravel and Livewire.

This gives the package a Laravel-friendly API while still sharing the same browser foundation as the other Unlayer packages.

## Installation

Install the PHP package:

```bash
composer require community-sdks/unlayer-livewire
```

Then install the browser asset:

```bash
php artisan unlayer-livewire:install
```

This publishes the compiled browser file to:

```txt
public/unlayer-livewire.js
```

After upgrading the package, publish the new asset again:

```bash
php artisan vendor:publish --tag=unlayer-livewire-assets --force
```

If you want to customize upload storage, publish the config too:

```bash
php artisan unlayer-livewire:install --config
```

Or publish assets and config manually:

```bash
php artisan vendor:publish --tag=unlayer-livewire-assets --force
php artisan vendor:publish --tag=unlayer-livewire-config
```

## Basic Usage

The package provides a Livewire component that can be used directly inside a Blade view.

```blade
<livewire:unlayer-livewire.editor
    :state="$content"
    display-mode="email"
    height="720px"
/>
```

The state is an array with HTML and design JSON:

```php
[
    'html' => '',
    'design' => [],
]
```

For Eloquent models, the editor content should usually be stored in a JSON column and cast to an array:

```php
protected function casts(): array
{
    return [
        'content' => 'array',
    ];
}
```

That gives the application one clean field for both rendered HTML and editable Unlayer design data.

## Livewire Methods

The PHP Livewire component exposes useful methods for controlling editor state:

```php
setState(array $state): void
loadDesign(array $design): void
clear(): void
exported(array $state): void
resolveUploadedImage(string $temporaryFilename): string
```

This is useful when the application needs to reset the editor, load a saved design, export the current state, or resolve uploaded images through Laravel storage.

The important part is that the editor state is not trapped inside the browser.

Livewire can receive it, store it, validate around it, and persist it like normal application data.

## Image Uploads

Image uploads use Livewire's JavaScript upload API.

The editor uploads a file to the component property `imageUpload`, then the component calls `resolveUploadedImage()` to store it and return the public URL.

Storage can be configured in `config/unlayer-livewire.php`:

```php
return [
    'upload' => [
        'disk' => 'public',
        'path' => 'unlayer-livewire',
        'visibility' => 'public',
    ],
];
```

Make sure the public disk is linked:

```bash
php artisan storage:link
```

This keeps uploads in Laravel instead of hardcoding storage behavior into the frontend editor wrapper.

## Stock Templates Through Laravel

Template search is one of the places where a backend wrapper matters.

Unlayer's public stock template search endpoint does not allow browser CORS requests, so browser code should not call it directly.

The clean flow is:

```txt
Livewire page -> Laravel proxy route -> Unlayer template API
```

The package includes same-origin Laravel proxy routes:

```txt
GET /unlayer-livewire/templates
GET /unlayer-livewire/templates/{template}
```

Because they are same-origin routes, the browser calls your Laravel app. Laravel then calls Unlayer from the backend.

This avoids the CORS problem and keeps the frontend integration simple.

## Template Picker

The editor can be configured with default template filters and a built-in template picker.

```blade
<livewire:unlayer-livewire.editor
    :state="$content"
    display-mode="email"
    height="720px"
    :template-picker="true"
    :template-search="[
        'search' => 'newsletter',
        'type' => 'email',
        'premium' => false,
        'limit' => 20,
        'offset' => 0,
        'collection' => '',
        'sort' => 'recent',
    ]"
/>
```

The template trigger is shown in a small toolbar above the editor. The picker opens over the editor itself, without a page backdrop.

That makes it feel like part of the editor, not like a completely separate application screen.

## Route Configuration

The template routes can be customized in `config/unlayer-livewire.php`:

```php
'routes' => [
    'prefix' => 'unlayer-livewire',
    'middleware' => ['web'],
],
```

This is useful when the editor is used inside a larger Laravel app with custom route groups, tenant middleware, auth middleware, or admin-only access.

## How Template Search Maps to Unlayer

The Livewire `template-search` values are mapped to Unlayer's request body behind the proxy.

```txt
search     -> filter.name
type       -> filter.type
premium    -> filter.premium
limit      -> perPage
offset     -> page
collection -> filter.collection
sort       -> filter.sortBy
```

The package handles that mapping so the Blade usage can stay readable.

## Examples Included

The repository includes Laravel-ready example snippets:

```txt
examples/routes/web.php.stub
examples/views/basic.blade.php
examples/views/templates.blade.php
```

The basic example renders the editor with an empty state.

The template example enables the built-in picker UI and the same-origin Laravel template proxy.

These examples are useful because editor integrations are easier to trust when they can be tested inside a real Laravel page.

## Development

The browser adapter can be built from the package repository:

```bash
npm install
npm run build
```

Then republish the built asset into a Laravel app:

```bash
php artisan vendor:publish --tag=unlayer-livewire-assets --force
```

Run TypeScript checks:

```bash
npm run typecheck
```

Format PHP:

```bash
vendor/bin/pint
```

## Why This Package Matters

This package is the Laravel bridge in the Unlayer ecosystem.

The TypeScript SDK gives a reusable editor foundation.
The Alpine adapter makes that foundation usable in lightweight browser pages.
The Livewire wrapper makes it feel at home in Laravel applications.

That matters because email editors usually live inside business software, not isolated demos.

They need uploads, saved state, template loading, proxy routes, and integration with existing Laravel models.

Unlayer Livewire keeps that integration small, focused, and reusable.

## Package

```bash
composer require community-sdks/unlayer-livewire
```

Repository:

```txt
https://github.com/community-sdks/unlayer-livewire
```

Registry:

```txt
https://packagist.org/packages/community-sdks/unlayer-livewire
```


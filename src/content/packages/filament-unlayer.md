---
name: "Filament Unlayer"
description: "Filament field and resource helpers for Unlayer-powered email editing."
ecosystem: "Community SDKs"
category: "Filament"
language: "PHP"
frameworks: ["Laravel", "Filament"]
repo: "https://github.com/community-sdks/filament-unlayer"
registry: "https://packagist.org/packages/community-sdks/filament-unlayer"
install: "composer require community-sdks/filament-unlayer"
status: "stable"
featured: true
---

## Unlayer as a Filament Field

Email and page editors usually start as a simple requirement.

Add a visual editor.
Store the HTML.
Let users change templates.
Allow image uploads.
Make it work inside the admin panel.

Then the integration gets bigger.

The editor needs to store both rendered HTML and editable design JSON. The browser runtime needs JavaScript. Templates need backend proxy routes because of CORS. Uploads need Laravel storage. And the whole thing still needs to feel like a normal Filament form field.

**Filament Unlayer** is the Filament layer for that workflow.

It wraps the Unlayer editor as a Filament field and delegates the editor runtime to the Livewire package, which already sits on top of the Alpine and TypeScript packages.

## Why This Package Exists

Filament is usually where business users actually touch the system.

A newsletter tool may have a campaign resource.
A SaaS app may have transactional email templates.
A CMS may have landing page blocks.
A CRM may have reusable email layouts.

In all of those cases, the editor should not feel like a separate app bolted onto the side.

It should behave like a field.

That is the point of this package.

## Built on the Unlayer Stack

Filament Unlayer is the top layer of the Unlayer integration stack.

`unlayer-ts` provides the framework-free TypeScript editor wrapper.
`unlayer-alpinejs` exposes that wrapper through Alpine.
`unlayer-livewire` connects the browser editor to Laravel and Livewire.
`unlayer-filament` makes the editor available as a Filament form field.

That separation matters.

The Filament package does not need to own every low-level browser concern. It can focus on the part that matters inside admin panels: field usage, form state, templates, views, and resource integration.

## Installation

Install the package with Composer:

```bash
composer require community-sdks/unlayer-filament
```

The field depends on the browser asset published by the Livewire package, so install that asset too:

```bash
php artisan unlayer-livewire:install
```

This publishes the compiled browser file to:

```txt
public/unlayer-livewire.js
```

After upgrading the Livewire package or rebuilding the browser asset locally, publish the latest file again:

```bash
php artisan vendor:publish --tag=unlayer-livewire-assets --force
```

If you want to customize upload storage or route behavior, publish the Livewire config:

```bash
php artisan unlayer-livewire:install --config
```

You can also publish the Filament field views:

```bash
php artisan vendor:publish --tag="unlayer-filament-views"
```

## Requirements

The package targets the modern Laravel and Filament stack:

```txt
PHP 8.3+
Laravel 13+
Filament 5.x
```

The current package line is for Filament 5.x.

## Model State

The field stores the editor state as an array containing both `html` and `design`.

That means the Eloquent model should cast the field to an array:

```php
protected $casts = [
    'content' => 'array',
];
```

This is important because Unlayer needs the design JSON to reopen and edit the layout later.

The generated HTML is useful for rendering and sending.
The design JSON is useful for editing.

A good integration keeps both.

## Basic Usage

Use the field like any other Filament form field:

```php
use CommunitySdk\FilamentUnlayer\Forms\Components\Unlayer;

Unlayer::make('content')
    ->required();
```

That is the main goal of the package: Unlayer should feel like a normal Filament field.

It can live inside a resource form, a custom page, or any Filament form schema where a field makes sense.

## Template Picker

The package can also enable Unlayer stock templates inside the editor.

```php
Unlayer::make('content')
    ->required()
    ->templatePicker();
```

The picker loads templates through the Livewire package's same-origin backend proxy and applies the selected design directly to the initialized editor.

That keeps the browser integration clean and avoids direct frontend calls to Unlayer's template endpoints.

## Custom Template Search

The default stock template query can be customized:

```php
Unlayer::make('content')
    ->templatePicker(options: [
        'type' => 'email',
        'premium' => false,
        'limit' => 20,
        'offset' => 0,
        'collection' => '',
        'sort' => 'recent',
    ]);
```

The type can be changed depending on the editor use case:

```php
'type' => 'email'
```

or:

```php
'type' => 'web'
```

That makes the same field useful for email editors and page-style editors.

## Custom Picker Labels

The template picker UI can also be adjusted:

```php
Unlayer::make('content')
    ->templatePicker()
    ->templatePickerOptions([
        'label' => 'Template Editor',
        'triggerLabel' => 'Search templates',
        'title' => 'Templates',
        'placeholder' => 'Search templates',
        'emptyText' => 'No templates found.',
    ]);
```

This is useful when the same field appears in different contexts.

A campaign editor may call them email templates.
A page builder may call them layouts.
A product might use its own wording.

The package should not force one label style on every application.

## Live Syncing

Live syncing is disabled by default.

That is a sensible default because visual editors can produce a lot of changes very quickly.

If every editor change should sync immediately through Livewire, it can be enabled explicitly:

```php
Unlayer::make('content')
    ->syncLive();
```

This gives the application control over the tradeoff between immediate state syncing and fewer Livewire updates.

## Additional Unlayer Options

If the application needs to pass more options into Unlayer, the field supports additional editor options:

```php
Unlayer::make('description')
    ->additionalOptions([
        'option' => 'value',
    ]);
```

Those options are merged with the defaults used by the package.

That keeps the common path simple while still allowing deeper Unlayer configuration when needed.

## Why the Proxy Matters

The built-in Livewire proxy exists for a practical reason.

Unlayer's stock template endpoints do not allow direct browser CORS requests.

The clean flow is:

```txt
Filament field -> Livewire package proxy route -> Unlayer template API
```

The browser talks to your Laravel app. Laravel talks to Unlayer.

This avoids CORS issues and gives Laravel control over routing, middleware, authentication, and future customization.

## Template Mapping

Behind the proxy, the field's template picker options map to Unlayer's upstream request shape.

```txt
search     -> filter.name
type       -> filter.type
premium    -> filter.premium
limit      -> perPage
offset     -> page
collection -> filter.collection
sort       -> filter.sortBy
```

That means the Filament API can stay readable while the backend handles the request shape expected by Unlayer.

## Quick Demo

The package ships with a quick demo installer through `zpmlabs/laravel-package-quick-demo`.

Install the package and then install the bundled demo:

```bash
composer require community-sdks/unlayer-filament
php artisan quick-demo:install unlayer-filament-demo
```

To inspect the registered demo or see route details:

```bash
php artisan quick-demo:show unlayer-filament-demo
```

The bundled demo includes an email editor tab and a web/page editor tab, both backed by isolated quick-demo data.

That is useful because editor packages are easier to evaluate when you can test the full field behavior inside a real Laravel app without wiring everything manually first.

## Where It Fits

Filament Unlayer is useful anywhere a visual editor belongs inside an admin panel.

Newsletter campaign builders.
Transactional email templates.
Marketing email layouts.
CMS page sections.
Landing page drafts.
Internal template libraries.

The package keeps the editor close to Filament's form system, while the lower-level packages handle the browser runtime and Livewire bridge.

## Small Package, Clear Layer

This package is not trying to replace Unlayer, Livewire, or Filament.

It is a focused integration layer.

That makes it easier to maintain and easier to understand.

The field is the Filament-facing piece. The Livewire package handles Laravel state and proxy routes. The Alpine package handles the browser component. The TypeScript package handles the editor wrapper.

Each layer has a job.

That is the kind of structure I like for package ecosystems: small parts, clear responsibility, and enough flexibility to compose them into real products.

## Package

```bash
composer require community-sdks/unlayer-filament
```

Repository:

```txt
https://github.com/community-sdks/unlayer-filament
```

Registry:

```txt
https://packagist.org/packages/community-sdks/unlayer-filament
```


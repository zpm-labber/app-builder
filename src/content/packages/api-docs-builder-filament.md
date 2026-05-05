---
name: "ApiDocsKit Filament"
description: "Filament integration for generating and publishing API package documentation."
ecosystem: "ZPM Packages"
category: "Filament"
language: "PHP"
frameworks: ["Laravel", "Filament"]
repo: "https://github.com/zpm-packages/filament-api-docs"
registry: "https://packagist.org/packages/zpmlabs/filament-api-docs-builder"
install: "https://packagist.org/packages/zpmlabs/filament-api-docs-builder"
status: "stable"
featured: true
---

![ApiDocsKit Filament](https://github.com/user-attachments/assets/d3ba9e91-6998-4a8c-b815-eacb0729c3a8)

## API Documentation Belongs in the Admin Panel

API documentation usually starts as a separate file.

A Markdown page.
A Postman collection.
An OpenAPI JSON file.
A static docs site that slowly gets outdated.

That works for a while, but package and product APIs change constantly.

Endpoints change.
Parameters change.
Examples change.
Authentication rules change.
Response shapes change.

**ApiDocsKit Filament** brings API documentation closer to the place where many Laravel applications are already managed: the Filament admin panel.

It gives you a structured way to create, edit, import, export, and publish API documentation from inside Filament.

## Why This Package Exists

A lot of API documentation tools are powerful, but they often live outside the application.

That creates a gap.

Developers update code in one place, maintain docs somewhere else, export collections manually, and then try to keep everything aligned.

For internal APIs, SaaS platforms, SDK ecosystems, and package documentation, that workflow becomes annoying fast.

ApiDocsKit Filament is built around a simpler idea: manage API docs as application data.

If the docs are structured data, they can be edited through Filament resources, rendered with Filament infolists, exported as Postman-style collections, imported from existing collections, and extended through custom code builders.

## What It Does

The package provides a Filament integration for building good-looking and functional API documentation.

It includes:

```txt
Filament plugin registration
API documentation resource helpers
form builder for API docs
infolist builder for public or admin display
Postman-style import action
Postman-style export/download action
configurable code builders
predefined endpoint parameters
multi-tenancy support hooks
publishable config, migrations, and views
```

That gives the application a practical documentation backend instead of a loose collection of files.

## Installation

Install the package with Composer:

```bash
composer require zpmlabs/filament-api-docs-builder
```

Then run the installer:

```bash
php artisan filament-api-docs-builder:install
```

The installer handles the normal setup flow for the package.

If you need manual control, you can publish and run migrations yourself:

```bash
php artisan vendor:publish --tag="filament-api-docs-builder-migrations"
php artisan migrate
```

You can also publish the config file:

```bash
php artisan vendor:publish --tag="filament-api-docs-builder-config"
```

And optionally publish the views:

```bash
php artisan vendor:publish --tag="filament-api-docs-builder-views"
```

## Theme Setup

If your Filament panel uses a custom Tailwind theme, add the package views to your theme source list:

```css
@source '/vendor/zpmlabs/filament-api-docs-builder/resources/views/filament/**/*';
@source '/vendor/guava/filament-icon-picker/resources/**/*';
```

The package uses Guava Icon Picker, so its views also need to be included in the Tailwind source scanning.

That keeps the generated classes available in your compiled Filament theme.

## Plugin Registration

The simplest usage is to register the plugin inside your Filament panel provider:

```php
->plugin(ZPMLabs\FilamentApiDocsBuilder\FilamentApiDocsBuilderPlugin::make())
```

That gives the panel the package's built-in integration.

For many projects, this is enough to start managing API documentation directly from Filament.

## Custom Resource Usage

If you want more control, you can create your own resource and reuse the package builders.

The form can be generated with `ApiDocsFormBuilder`:

```php
use ZPMLabs\FilamentApiDocsBuilder\Filament\Forms\ApiDocsFormBuilder;

public static function getModel(): string
{
    return config('filament-api-docs-builder.model');
}

public static function form(Form $form): Form
{
    return $form->schema(ApiDocsFormBuilder::make());
}
```

This lets your application keep its own resource structure while still using the package's API docs form schema.

## Infolist Rendering

For display pages, the package provides `ApiDocsInfolistBuilder`.

```php
use ZPMLabs\FilamentApiDocsBuilder\Filament\Infolists\ApiDocsInfolistBuilder;

public static function getResource(): string
{
    return config('filament-api-docs-builder.resource');
}

public function infolist(Infolist $infolist): Infolist
{
    $record = $this->getRecord();

    $this->heading = '[v' . $record->version . '] ' . $record->title;
    $this->subheading = $record->description;

    return $infolist->schema(ApiDocsInfolistBuilder::make($record));
}
```

That makes the same structured docs usable in admin views or public Filament pages.

If you want to expose documentation publicly, you can create a public Filament page and pass the record into the infolist builder.

## Import and Export

One of the strongest parts of the package is Postman-style import and export.

The package includes two Filament actions:

```php
use ZPMLabs\FilamentApiDocsBuilder\Filament\Actions\CollectionDownloaderAction;
use ZPMLabs\FilamentApiDocsBuilder\Filament\Actions\CollectionImporterAction;

protected function getHeaderActions(): array
{
    return [
        CollectionDownloaderAction::make('downloader'),
        CollectionImporterAction::make('importer'),
    ];
}
```

That means documentation can move in both directions.

You can import an existing Postman-style collection and turn it into editable documentation.
You can export your structured docs back into a collection format that other tools can consume.

That is useful because real teams rarely live in one documentation format forever.

## Code Builders

The package includes different code builders for generating request examples.

But it also allows custom builders through the `code_builders` config array.

That is important because API documentation often needs examples in the language or style your users actually care about.

For one package, PHP examples may matter most.
For another, JavaScript or TypeScript examples may be better.
For an internal API, cURL may be enough.
For SDK-driven products, generated examples can point users toward the official SDK style.

The package keeps that part configurable instead of hardcoding one documentation style.

## Predefined Parameters

Many APIs reuse the same parameters everywhere.

Authorization headers.
Tenant IDs.
Pagination parameters.
Locale parameters.
Common filters.
Version headers.

ApiDocsKit Filament supports predefined endpoint parameters through the `predefined_params` config array.

That avoids repeating the same setup manually for every endpoint.

For larger APIs, this is one of the small details that makes documentation maintenance less painful.

## Multi-Tenancy Support

The package also supports multi-tenancy configuration.

If your application uses tenants, you can configure the tenant model and provide tenant resolution through `getTenant`.

That makes the package useful for SaaS products where each tenant may have its own documentation set, private endpoints, or customized API surface.

This fits naturally with Filament applications because many Filament panels already have tenant-aware resources and panels.

## Where It Fits

ApiDocsKit Filament is useful for:

```txt
Laravel SaaS platforms
internal API documentation
package API documentation
SDK ecosystems
client portals
admin-managed developer portals
multi-tenant API documentation
Postman collection import/export workflows
```

The package is especially useful when API docs should be editable by maintainers from the admin panel instead of being locked inside static files.

## Why This Matters

Good documentation is not only about how it looks.

It is about whether it stays close enough to the product to remain useful.

When docs live too far away from the application, they rot.

By making API documentation a Filament-managed resource, this package makes docs easier to maintain, easier to publish, and easier to connect with real product workflows.

That is the part I like most about it.

It treats documentation as product infrastructure, not as an afterthought.

## Package

```bash
composer require zpmlabs/filament-api-docs-builder
```

Repository:

```txt
https://github.com/zpm-packages/filament-api-docs
```

Registry:

```txt
https://packagist.org/packages/zpmlabs/filament-api-docs-builder
```


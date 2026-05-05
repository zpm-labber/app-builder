---
name: "Filament Popup"
description: "Reusable popup and modal helpers for Filament applications."
ecosystem: "ZPM Packages"
category: "Filament"
language: "PHP"
frameworks: ["Laravel", "Filament"]
repo: "https://github.com/zpm-packages/filament-popup"
registry: "https://packagist.org/packages/zpm-packages/filament-popup"
install: "composer require zpm-packages/filament-popup"
status: "stable"
featured: false
---

![Filament Popup](https://github.com/user-attachments/assets/58c51f10-6612-4dd4-92e1-f0bf53d0c52b)

## Quick Previews Belong in the Table

Admin panels are full of small moments where opening a full page feels too heavy.

A user row needs a quick profile preview.
An email column needs more context.
A status icon needs details.
A record needs a small form without leaving the table.

That is where **Filament Popup** fits.

It adds reusable popup behavior directly to Filament table columns, so a column can become more than a static value. It can open a small Livewire-powered preview, form, table, Blade view, component, or schema-based UI.

## What It Does

Filament Popup adds a `popup()` API to Filament table columns.

```php
use ZPMLabs\FilamentPopup\Enums\PopUpPosition;

TextColumn::make('name')
    ->badge()
    ->popup(UserPopupInfolist::class, PopUpPosition::TopCenter)
    ->searchable();
```

The goal is simple: let table cells expose useful context without forcing the user into another page.

A popup can be opened on hover, click, right-click, or with a modifier key. It can be positioned around the trigger and configured with width, delay, offset, and interactive behavior.

## Why I Built It

Filament already gives us powerful resources, tables, forms, schemas, and Livewire integration.

But in real admin applications, I often want a middle layer between a tiny table cell and a full edit/view page.

Sometimes I only need a quick preview.
Sometimes I want to show structured record details.
Sometimes I want a small edit form.
Sometimes I want a secondary table with related data.

The first temptation is to throw rendered HTML into a `data-*` attribute and open it with plain JavaScript.

That works until it does not.

Filament forms, schema actions, validation, and table rendering need a real Livewire render cycle. Filament Popup is built around that idea instead of fighting it.

## Livewire First, Not HTML in Attributes

The table cell only stores popup metadata.

JavaScript handles the browser event and tells one global Livewire popup host to open. That host loads the Eloquent record, renders the content, manages form state, validates form input, saves data, and refreshes the table when needed.

That means the popup is not just decorative HTML.

It can behave like a real Filament UI.

## Installation

Install the package with Composer:

```bash
composer require zpmlabs/filament-popup
```

The service provider registers the column macros, assets, Livewire component, and a Filament body-end render hook for the global popup host.

If package auto-discovery is disabled, register the provider manually:

```php
ZPMLabs\FilamentPopup\FilamentPopupServiceProvider::class,
```

You can publish the config if you want to change the default popup behavior:

```bash
php artisan vendor:publish --tag=filament-popup-config
```

If your panel theme uses Tailwind source scanning, include the package views:

```css
@source '../../../../vendor/zpmlabs/filament-popup/resources/views/**/*';
```

Then publish Filament assets:

```bash
php artisan filament:assets
```

## Column API

The main API is intentionally small.

```php
TextColumn::make('name')
    ->popup(UserPopupInfolist::class, PopUpPosition::TopCenter, [
        'width' => 'md',
        'delay' => 250,
        'closeDelay' => 300,
        'offset' => 10,
        'interactive' => true,
        'trigger' => 'hover',
    ]);
```

You can also use fluent helpers:

```php
TextColumn::make('name')
    ->popup(UserPopupInfolist::class)
    ->popupPosition(PopUpPosition::TopCenter)
    ->popupWidth('md')
    ->popupDelay(300)
    ->popupCloseDelay(300)
    ->popupTrigger('hover', key: 'shift');
```

This makes the feature feel like a natural table-column extension instead of a separate modal system.

## Supported Popup Content

Filament Popup supports several content styles:

* arrays and closures returning arrays
* schema and infolist classes
* schema form classes
* Blade views
* Blade components
* table classes

That gives the package a nice range.

For simple previews, return an array.
For structured record details, use a schema or infolist.
For editing, use a schema form.
For custom markup, use Blade.
For related data, render a small table.

## Array Popups

Arrays are good for small read-only previews.

```php
TextColumn::make('name')
    ->popup(fn ($record) => [
        'Name' => $record->name,
        'Email' => $record->email,
        'Joined' => $record->created_at?->toFormattedDateString(),
    ]);
```

This is perfect for cases where you want fast context without building a separate class.

## Infolist Popups

For richer Filament content, create a class with a static `make()` method.

```php
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;

final class UserPopupInfolist
{
    public static function make(Schema $schema, mixed $record): Schema
    {
        return $schema
            ->record($record)
            ->components([
                Grid::make(2)
                    ->schema([
                        TextEntry::make('name'),
                        TextEntry::make('email'),
                        IconEntry::make('email_verified_at')
                            ->label('Verified')
                            ->boolean(),
                    ]),
            ]);
    }
}
```

Then attach it to a column:

```php
TextColumn::make('name')
    ->popup(UserPopupInfolist::class);
```

## Form Popups

Forms are the reason this package needs to be Livewire-first.

The popup host owns the form state, validates the schema, saves the record, and refreshes the table.

```php
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;

final class UserPopupForm
{
    public static function make(Schema $schema, mixed $record): Schema
    {
        return $schema
            ->record($record)
            ->statePath('popupFormData')
            ->components([
                Form::make([
                    Grid::make(2)
                        ->schema([
                            TextInput::make('name')
                                ->required(),
                            TextInput::make('email')
                                ->label('Email address')
                                ->email()
                                ->required(),
                        ])
                        ->columnSpanFull(),
                ])
                    ->footer([
                        Actions::make([
                            Action::make('cancelPopupForm')
                                ->label('Cancel')
                                ->color('gray')
                                ->action('close'),
                            Action::make('savePopupForm')
                                ->label('Save user')
                                ->action('save'),
                        ])
                            ->alignEnd(),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
```

The important detail is `statePath('popupFormData')`. That is where the popup host stores form state.

For form buttons, use string Livewire handlers like `->action('save')` and `->action('close')`.

## Different Triggers for Different Flows

Not every popup should open the same way.

Hover works well for quick previews.
Click works better for interactive content.
Right-click can expose secondary actions.
Shift-hover can keep the table clean while still giving power users fast access.

```php
TextColumn::make('name')
    ->label('Hover')
    ->badge()
    ->popup($content, PopUpPosition::TopCenter, [
        'width' => 'md',
        'trigger' => 'hover',
    ]);

TextColumn::make('email')
    ->label('Click')
    ->copyable()
    ->popup($content, PopUpPosition::MiddleRight, [
        'width' => 'lg',
        'trigger' => 'click',
    ]);
```

This makes the package useful for both simple previews and more intentional interactions.

## Example Resource Included

The package includes a ready-to-register `UserResource` for testing all supported popup formats against `App\Models\User`.

```php
use ZPMLabs\FilamentPopup\Examples\UserResource;

public function panel(Panel $panel): Panel
{
    return $panel
        ->resources([
            UserResource::class,
        ]);
}
```

The example pages cover infolist, array, Blade view, Blade component, form, and table popups.

That makes the package easier to test before integrating it into a real admin panel.

## Small Package, Big Pattern

Filament Popup is not trying to replace Filament pages or full modals.

It focuses on a very specific workflow: repeatable popup patterns inside tables.

That sounds small, but the pattern appears everywhere in admin software. Tables are often where users spend most of their time, and giving them more context without page switching can make the whole panel feel faster.

For me, this package is also part of a bigger direction: building small Filament packages that solve focused admin UI problems, while still respecting Filament and Livewire instead of bypassing them.

## Package

```bash
composer require zpmlabs/filament-popup
```

Repository:

```txt
https://github.com/zpm-packages/filament-popup
```

Registry:

```txt
https://packagist.org/packages/zpmlabs/filament-popup
```


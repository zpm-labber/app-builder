---
name: "Domain Providers"
description: "Adapters for domain registration, DNS, and provider-style integrations."
ecosystem: "ZPM Packages"
category: "Integrations"
language: "PHP"
frameworks: ["Laravel"]
repo: "https://github.com/zpm-packages/domain-providers"
registry: "https://packagist.org/packages/zpm-packages/domain-providers"
install: "composer require zpm-packages/domain-providers"
status: "concept"
featured: false
---

## One Interface for Domain Providers

Domain integrations get messy fast.

Checking availability is one flow.
Registering a domain is another.
Renewals, transfers, nameservers, DNS records, pricing, provider credentials, reseller accounts, direct accounts, supported TLDs, and provider-specific edge cases all add their own shape.

**Domain Providers** is a package ecosystem for handling domain registration, DNS, and provider-style integrations behind a shared PHP abstraction.

The goal is not to pretend every registrar works the same.

The goal is to give an application one clean way to talk to multiple providers while still respecting provider capabilities and differences.

## Why This Package Exists

A website builder, SaaS platform, hosting panel, or client portal will eventually need domain workflows.

A user wants to search for a domain.
A business wants to register it.
A builder wants to point DNS records to the published site.
A tenant might need its own provider credentials.
A platform may prefer one provider for `.com` and another for a different TLD.

Hardcoding that logic directly into the application makes the product harder to change later.

Domain Providers separates that concern into reusable packages.

The pure PHP package owns the provider abstraction and adapters. The Laravel package owns database persistence, encrypted provider config, runtime bootstrapping, queued TLD sync, and framework integration.

## Two Layers

The ecosystem is split into two main packages.

The PHP package provides the provider contracts, DTOs, operation interfaces, capability-aware abstraction, and provider adapters.

The Laravel package provides the application bridge: migrations, encrypted config storage, provider records, discovered TLD records, singleton handler registration, queues, scheduler integration, and cache invalidation.

That split is important.

The domain logic should not require Laravel.
The Laravel integration should not duplicate the provider logic.

Each layer has a job.

## Pure PHP Provider Layer

The PHP package is the provider-agnostic core.

It includes contract-aligned DTOs and operation interfaces for common domain workflows:

```txt
check availability
register domain
renew domain
transfer domain
get domain info
list domains
get nameservers
set nameservers
list DNS records
create DNS records
update DNS records
delete DNS records
get pricing
check transfer availability
provider metadata
provider capabilities
```

Provider operations are capability-aware.

That means an adapter can support one feature and explicitly reject another through an unsupported capability exception instead of failing silently or pretending support exists.

## Provider Adapters

The PHP package includes provider adapters for Spaceship and GoDaddy.

Spaceship support includes availability checks, registration, renewal, transfer, domain info, nameserver read/update, and DNS record list/create/update/delete.

GoDaddy support includes both reseller account endpoints and direct account endpoints, depending on the configured account mode.

That matters because GoDaddy direct accounts and reseller/customer flows are not the same thing.

The package keeps that distinction in configuration instead of spreading it across application code.

## Provider-Agnostic Usage

The application can work against the shared provider interface instead of being locked to one registrar.

The same high-level flow can check availability, register a domain, read nameservers, or create DNS records through whichever provider is selected.

```php
$availability = $provider->checkAvailability(new DomainName('example.com'));

if ($availability->available) {
    $provider->registerDomain(
        domain: new DomainName('example.com'),
        period: new DomainRegistrationPeriod(1),
        registrantContact: $registrant,
        nameservers: new NameserverSet([
            'ns1.example.com',
            'ns2.example.com',
        ]),
        privacyEnabled: true,
    );
}
```

This is the main value of the package: the product code can stay focused on the business flow instead of every registrar's SDK details.

## Provider Routing by TLD

The PHP package also includes a `DomainProviderHandler` for registering multiple providers and routing operations.

This is useful when the platform wants different routing behavior per TLD.

For example, one provider can be preferred for `.com`, another provider can be used only for specific extensions, and priority rules can decide fallback order.

Routing can consider:

```txt
explicit preferred provider for a TLD
only-TLD rules
except-TLD rules
priority-TLD matches
numeric provider priority
```

That is useful for real platforms because provider support is not uniform.

Some registrars are better for certain TLDs. Some providers have better pricing, better API coverage, or better regional support.

## Custom Providers

The package is designed so provider adapters do not need to live only inside the package.

Custom providers can be registered through the provider registry as classes, instances, or factories.

```php
$registry->registerClass('my-provider', MyProvider::class);

$provider = $registry->get('my-provider');
```

That keeps the core package extensible.

If a product needs Namecheap, Cloudflare, Porkbun, or an internal provider later, the application can add a new adapter without rewriting the domain workflow.

## Laravel Bridge

The Laravel package turns the provider abstraction into something usable inside a real Laravel application.

It adds database persistence for provider instances and discovered TLDs, encrypted provider credential storage, DB-driven provider bootstrapping, queued TLD sync jobs, scheduler integration, and cache invalidation hooks.

Install it with Composer:

```bash
composer require community-sdks/domain-providers-laravel
```

Then publish config and migrations:

```bash
php artisan vendor:publish --tag=domain-providers-config
php artisan vendor:publish --tag=domain-providers-migrations
php artisan migrate
```

The Laravel package intentionally keeps registrar/domain logic in the pure PHP package.

Laravel owns persistence and runtime integration.

## Database-Driven Providers

The Laravel package stores provider instances in a `domain_providers` table.

A provider row can include:

```txt
UUID primary key
tenant_id
name
driver
encrypted config
non-secret rules
priority
active status
TLD sync status fields
notes
timestamps
```

Provider credentials are stored in encrypted config, while routing and policy metadata live separately in `rules`.

That distinction is useful.

Secrets belong in encrypted config.
Provider behavior rules do not need to be encrypted.
Both should be editable and bootstrappable from the database.

## Discovered TLDs

The Laravel package also stores discovered provider TLDs in `domain_provider_tlds`.

Each row belongs to a provider and tracks the normalized extension, active status, sync timestamp, optional metadata, and placeholder pricing fields.

This gives the application a local view of what a provider supports.

That can power admin screens, domain search filters, provider selection rules, or future pricing workflows.

## Runtime Handler Assembly

At runtime, the Laravel package registers `DomainProviderHandler` as a singleton.

The build flow is database-driven:

```txt
load active providers from the database
decrypt and decode config
normalize rules
resolve provider factory by driver
instantiate provider and provider config
register provider into the handler
apply preferred TLD mappings from rules
```

This means the application does not have to manually build the handler in every service.

The configured providers become available through the container.

## Tenancy-Aware Setup

The Laravel configuration includes tenancy options.

That makes the package useful for platforms where provider credentials or provider rules differ per tenant.

A global provider can be shared across the platform, or tenant-specific providers can be included depending on configuration.

That matters for products like website builders, hosting tools, domain reseller panels, or multi-tenant SaaS systems.

Some platforms own all registrar credentials centrally. Others may allow each tenant to connect their own provider account.

The package leaves room for both.

## Provider Config Templates

The Laravel package can resolve provider-specific config templates by driver.

That is useful for building admin forms, especially in Filament.

```php
$template = app(\DomainProviders\Laravel\Services\ProviderConfigResolver::class)
    ->resolveConfigTemplateForDriver('godaddy');
```

The templates are derived from the provider config constructors in the PHP package.

That means config forms can stay aligned with provider adapter updates instead of being manually duplicated in the UI layer.

## GoDaddy and Spaceship Config

For Spaceship, the encrypted config stores credentials and environment:

```json
{
    "api_key": "your-key",
    "api_secret": "your-secret",
    "environment": "production"
}
```

For GoDaddy reseller accounts, the config includes account mode and customer ID:

```json
{
    "api_key": "your-key",
    "api_secret": "your-secret",
    "environment": "production",
    "account_mode": "reseller",
    "customer_id": "your-customer-id"
}
```

For direct GoDaddy accounts, the customer ID can be null:

```json
{
    "api_key": "your-key",
    "api_secret": "your-secret",
    "environment": "production",
    "account_mode": "direct",
    "customer_id": null
}
```

This keeps provider differences explicit and configurable.

## TLD Sync

The Laravel package includes a dispatch command for syncing provider TLDs:

```bash
php artisan domain-providers:sync-tlds-dispatch
```

It supports options for syncing one provider, applying tenant context, running inline instead of queued, and forcing sync even when the provider is not due yet.

```bash
php artisan domain-providers:sync-tlds-dispatch --provider=provider-id --inline --force
```

The queued job checks whether the provider supports TLD discovery, normalizes discovered extensions, upserts local TLD rows, updates sync timestamps, and can mark missing TLD rows inactive instead of hard-deleting them.

That last detail is important because provider support can change, but deleting historical rows immediately is often not the safest behavior.

## Rules for Provider Policy

The `rules` field stores non-secret provider policy metadata.

For example:

```json
{
    "included_tlds": ["com", "net"],
    "excluded_tlds": ["xyz"],
    "priority_tlds": ["io"],
    "preferred_tlds": ["co.uk"]
}
```

This gives the application a database-driven way to control provider routing without putting secrets and routing policy in the same field.

## Where This Fits

Domain Providers is useful for products that need domain workflows as part of a larger system.

Website builders.
Hosting dashboards.
Client portals.
Domain reseller panels.
Multi-tenant SaaS platforms.
Internal tools for DNS automation.
CMS products that publish sites to custom domains.

The package is not only about buying domains.

It is about creating a clean integration layer for provider-style domain operations.

## Why This Matters

Domain registration and DNS are not usually the core product.

They are infrastructure around the product.

But if the integration is messy, it leaks everywhere: checkout flows, site publishing, onboarding, DNS setup, tenant configuration, provider credentials, and support tooling.

A shared provider layer keeps that complexity contained.

That is the real reason this package matters.

It gives future products a reusable foundation instead of making every project start from raw registrar APIs again.

## Package

Pure PHP package:

```bash
composer require community-sdks/domain-providers-php
```

Laravel package:

```bash
composer require community-sdks/domain-providers-laravel
```

Repository:

```txt
https://github.com/community-sdks/domain-providers-php
https://github.com/community-sdks/domain-providers-laravel
```

Registry:

```txt
https://packagist.org/packages/community-sdks/domain-providers-php
https://packagist.org/packages/community-sdks/domain-providers-laravel
```


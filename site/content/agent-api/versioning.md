# Versioning

All components of this API have a single common version. This document describes its format and provides other related information.

## Format

`v<major>.<minor>`

examples: `v0.1` `v0.2`

## Endpoints

Our components have different endpoints for every version. For example here is what a URL with a version looks like for the customer API:

`api.chat.io/customer/v0.2/<req>`

or if you prefer to point always to recent version (not recommended):

`api.chat.io/customer/<req>`

## Change policy

Before we reach the `v1.0` version, new versions may introduce breaking changes. We don't know yet if that policy holds after `v1.0`. We support old versions for an undefined period of time until `v1.0`. We will add a notice in this documentation that a version is deprecated before it's removed.

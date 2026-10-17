# Security Policy

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Use GitHub's built-in private reporting feature instead:

1. Go to the [Security tab](../../security) of this repository.
2. Click **"Report a vulnerability"**.
3. Fill in the details. A maintainer will respond within 7 days.

This applies to any security issue affecting the indexer API, the documentation
site, or this repository's CI/CD configuration.

## Non-security bugs

Bugs in API behaviour that do not have a security impact (wrong data, missing
fields, incorrect calculations) should be reported via the normal
[issue templates](../../issues/new/choose).

## Scope

This repository hosts:

- `api/` — the Rust/Axum indexer (maintainer-only, see [CONTRIBUTING.md](CONTRIBUTING.md))
- `docs/` — the Next.js documentation site

If the vulnerability relates to the Soroban smart contracts, please report it
in the [`stellar-stream-hive-contract`](https://github.com/Stellar-Hive/stellar-stream-hive-contract)
repository using the same private-reporting process.

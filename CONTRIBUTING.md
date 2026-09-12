# Contributing

Thanks for taking a look. This repository publishes the source of a Chrome Web Store extension; the store build is produced from this tree.

## Ground rules

- Keep product behavior stable: this code ships to real users through the Chrome Web Store.
- Every change must pass `npm run verify` locally (the same pipeline CI runs).
- One logical change per pull request; English commit messages (Conventional Commits style).

## Setup

Node 24+, npm 10+.

```bash
git clone https://github.com/LisandroNahuelH/volume-booster.git
cd volume-booster
npm ci
npm run verify
```

## Contracts you must not break

- `src/content/main-world.ts` must not gain top-level `export` statements; `src/content/registered-main.ts` stays side-effect-only (the registered IIFE bundle depends on it). See [docs/agent-guardrails/all-sites-main-world-contract.md](docs/agent-guardrails/all-sites-main-world-contract.md).
- Keep `<all_urls>` in `host_permissions` in `public/manifest.json` (the All Sites lane depends on install-time access).
- i18n: add keys only in `public/_locales/en/messages.json`, then run `npm run i18n:generate`; never inline visible copy in TypeScript or HTML.
- Keep files small: one function per file, under 150 LOC (see [AGENTS.md](AGENTS.md)).

## Pull requests

- Run `npm run verify` and paste the tail of the output.
- Do not commit `dist/`, zips, or captured logs — CI rebuilds everything from source.
- For locale additions, follow [docs/i18n/locale-onboarding.md](docs/i18n/locale-onboarding.md).

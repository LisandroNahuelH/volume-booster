# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.15] — 2026-09-12

First public source release, matching the version published on the Chrome Web Store.

### Added

- Manual per-tab boost through a local Faust WASM DSP chain (offscreen document + AudioWorklet).
- All Sites auto-boost lane with runtime-registered IIFE content scripts (main + isolated worlds).
- Per-site settings and the Premium audio profile with offline license verification (Ed25519) and a 30-day trial.
- Anonymous heartbeat diagnostics (install/update/ping) — see [SECURITY.md → Privacy](SECURITY.md#privacy).
- English and Spanish locale catalogs with strict key parity, plus typed i18n artifacts.
- Full local verification pipeline (`npm run verify`), mirrored by CI.

[0.1.15]: https://github.com/LisandroNahuelH/volume-booster/releases/tag/v0.1.15

# Architecture

Volume Booster is a Manifest V3 Chromium extension. Everything runs locally: one service worker coordinates, one offscreen document processes audio through a Faust WASM worklet, and content scripts implement the optional All Sites lane.

## Runtime map

| Surface | Entry | Role |
|---|---|---|
| Service worker | `src/background/main.ts` | Single durable coordinator: capture requests, command routing, lifecycle, heartbeat on install/update |
| Popup | `popup.html` + `src/popup` | Boost UI, settings, premium surface, heartbeat ping |
| Offscreen document | `offscreen.html` + `src/offscreen` | WebAudio graph + Faust WASM worklet; the only place audio is processed |
| Content scripts | `src/content/*` (bundles under `dist/content-scripts/`) | Media-element sessions, controller, main-world bridge for the All Sites lane |
| Automation page | `automation.html` + `src/automation` | Automation/debug surface |

## Audio path (manual lane)

1. The user clicks Boost in the popup — a user gesture is required by `chrome.tabCapture`.
2. The service worker calls `chrome.tabCapture.getMediaStreamId` and forwards the stream id to the offscreen document.
3. The offscreen document builds a WebAudio chain ending in an AudioWorklet that runs the Faust DSP.
4. The DSP programs (`prism-premium-mono` / `prism-premium-stereo`) are compiled at build time from `faust/*.dsp` into `public/faust/**/dsp-module.wasm`.
5. The chain stages: input drive, protection, loudness normalization, lookahead/release envelope and multiband depth — parameters live in `src/shared` settings.

## All Sites lane (auto-boost)

- `chrome.scripting.registerContentScripts` registers two IIFE bundles produced by `vite.registered-content-scripts.config.ts`: `content-scripts/auto-booster-isolated.js` and `content-scripts/auto-booster-main.js`.
- The worker maintains the frame registry (`src/worker/auto-frame-registry`) and per-tab aggregates (`src/worker/auto-tab-aggregate`).
- The main-world bridge contract — no top-level exports, side-effect-only entry, `iife` output — is documented in [agent-guardrails/all-sites-main-world-contract.md](agent-guardrails/all-sites-main-world-contract.md); the e2e scenario `wait-for-attach-or-gesture` models the attach/retry behavior.

## Offscreen lifecycle

A single offscreen document exists at a time, created lazily on the first capture. MV3 service-worker suspensions are tolerated: `orchestrator.bootstrap` restores state on `onStartup`, `onInstalled` and alarms.

## Premium licensing (offline)

Premium licenses are compact fixed-length tokens signed with Ed25519. The extension embeds only the public key (`src/shared/premium-license`) and verifies signatures locally. A 30-day trial per install is tracked with alarms; advanced audio settings are sanitized for the free tier. The signing tooling is intentionally not part of this repository.

## Storage & i18n

- Settings and state live in `chrome.storage.local` (`src/shared/storage`, `boost-settings`, per-domain settings).
- Heartbeat storage keys: `prismVolumeBoosterInstallId`, `prismVolumeBoosterLastHeartbeatAt`.
- The UI is fully localized: `public/_locales/en` is canonical; `src/generated/i18n-*.ts` are typed artifacts produced by `npm run i18n:generate`.

## Build & security posture

- Build: `vite` for the main surfaces plus a second config for the registered IIFE bundles; Faust WASM compiles offline from `node_modules/@grame/faustwasm` (no network, no Docker).
- CSP: `script-src 'self' 'wasm-unsafe-eval'` — no remote code.
- The anonymous heartbeat and optional Sentry diagnostics are the only network surfaces ([SECURITY.md](../SECURITY.md)).

## Toolchain & dependency policy

Versions the CI lane verifies (Node 24, `ubuntu-latest`):

| Layer | Version | Gate |
|---|---|---|
| TypeScript | 5.9.x | `npm run typecheck` (`tsc --noEmit`) |
| Vite | 8.3.x | `npm run build` (main surfaces plus the registered IIFE bundles) |
| Vitest | 4.1.x with `@vitest/coverage-v8` 4.1.x | `npm test` |
| Stryker | 10.0.x (`core`, `typescript-checker`, `vitest-runner`) | `npm run test:mutate` (break threshold 90) |
| Faust compiler | `@grame/faustwasm` 0.18.x (compiler 2.88.0) | `npm run faust:refresh` inside `npm run build` |

Peer-locked families move in one PR: `@stryker-mutator/core` with `typescript-checker` and `vitest-runner` (`core` is an exact peer), and `vite` with `vitest` and `@vitest/coverage-v8` (coupled type surface). `.github/dependabot.yml` groups each family and holds three majors with the evidence in that file: `vitest`, `vite` and `typescript`.

Bumping `@grame/faustwasm` recompiles both DSP programs, so the shipped audio changes even when `faust/*.dsp` does not. The 0.15.7 → 0.18.3 bump (compiler 2.84.3 → 2.88.0) kept the wasm exports, the 18 UI controls and their addresses identical, matched the default-settings render to within 6.4e-7, and drifted up to 1.5e-3 peak (about −57 dBFS) only with the controls driven to extremes. There is no golden-audio test, so a bump of that package needs three checks before it lands: compare the `dist` hashes of the old and the new build, run the e2e fixtures lane on both (`node scripts/e2e/auto-booster.mjs --targets=fixtures`), and listen to a loaded `dist/` with the controls at their extremes. In that lane the manual scenario and `fixture-awaiting-gesture` fail or wedge on `main` as well — pre-existing harness defects, not regressions.

`npm run test:coverage` does not pass on `main` (measured coverage is below the configured thresholds) and `ci.yml` does not run it, so the failure is invisible to CI. See [AGENTS.md](../AGENTS.md) → Known gaps.

`ci.yml` does fail when a build leaves a tracked generated file modified, so stale committed artifacts (Faust assets under `public/faust/**` and `src/generated/faust/**`, generated i18n) cannot land unnoticed.

# AGENTS.md — the Volume Booster runbook (read this before touching anything)

You are an agent asked to build, verify, or contribute to **Volume Booster** (a Chrome MV3 extension). Follow this file top to bottom. It is self-contained: layout, exact commands, expected output, and what to do when something fails.

If you only need to *use* the extension, install it from the Chrome Web Store — this repository is the source it is built from.

## 0. Preflight — verify, then continue or stop

```bash
node --version    # expect: v24.x (CI uses Node 24)
npm --version     # expect: 10+
git --version     # any 2.x
```

If a check fails, stop and report exactly which one. Do not improvise a toolchain.

## 1. Clone to a stable path

```bash
git clone https://github.com/LisandroNahuelH/volume-booster.git
cd volume-booster
```

## 2. Install and verify (the real work)

```bash
npm ci
npm run verify
```

Expected tail: the vitest summary (`Test Files … passed`), a silent `tsc` exit, and the vite build output ending with the registered content-scripts step. Exit code 0.

`npm run verify` = popup structure check → i18n generate/check/audit → tests → typecheck → build. It is the same pipeline CI runs.

## 3. Build and load (dev)

```bash
npm run build
```

Output: `dist/` with `manifest.json` (MV3), `background.js`, `popup.html`, `offscreen.html`, `automation.html`, `content-scripts/auto-booster-main.js`, `content-scripts/auto-booster-isolated.js`, `faust/` and `_locales/`.

Load it: open `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select the `dist/` folder (not the repository root).

## 4. Verification checklist (prove it works, then report)

1. `node -e "const p=require('./package.json');const m=require('./dist/manifest.json');console.log(m.version===p.version, m.manifest_version)"` → expect `true 3`.
2. `test -f dist/content-scripts/auto-booster-main.js && test -f dist/content-scripts/auto-booster-isolated.js && echo ok` → expect `ok`.
3. `ls dist/_locales | wc -l` → expect `2`.
4. Load unpacked, open the popup on any `http(s)` tab: the boost control must render, and the service worker must be registered (chrome://extensions → the “service worker” link).
5. Optional e2e (installs browsers once): `npx playwright install chromium && npm run e2e:auto:fixtures`.

Report to the user as a short table: extension version, each checklist item, and raw failures if any.

## Failure protocol

| Symptom | Meaning | Do |
|---|---|---|
| `npm ci` fails | registry/network problem or lockfile mismatch | do not hand-edit the lockfile; retry on a clean network; report |
| `i18n:check` fails | key parity or placeholder mismatch vs `en` | fix the locale file; only allowlist via `scripts/i18n-identical-allowlist.json` |
| `i18n:audit` fails | visible copy inlined in TS/HTML | move the string into `public/_locales/en/messages.json`, then regenerate |
| Faust step fails | toolchain incomplete | re-run `npm ci`; then `npm run faust:refresh`; check `faust/*.dsp` |
| typecheck fails | TS errors | fix the reported files; `npm run typecheck` alone is faster |
| tests fail | vitest | run the single file (`npx vitest run <path>`) and read the assertion |
| build fails | vite/entry problem | inspect `vite.config.ts` entries; make sure nothing references a removed folder |
| popup blank | service worker not running | MV3 workers sleep; open the service-worker console via chrome://extensions → Errors |

Never “fix” verification by deleting tests, weakening the typecheck, or committing `dist/`.

## Contracts you must not break

- `src/content/main-world.ts`: no top-level `export` statements; `src/content/registered-main.ts` stays side-effect-only; the registered bundle stays `iife`. See [docs/agent-guardrails/all-sites-main-world-contract.md](docs/agent-guardrails/all-sites-main-world-contract.md).
- `<all_urls>` stays in `host_permissions` in `public/manifest.json` (the All Sites lane depends on install-time access).
- i18n: keys only in `en`, exact parity, no inline visible copy.
- One function per file, at most 150 LOC.

## Manual path (same steps for a human)

`git clone` → `npm ci` → `npm run build` → Load unpacked from `dist/`. Full walkthrough: [README.md](README.md) → Quick start.

## What you must not do

- Do not publish to the Chrome Web Store from an agent turn.
- Do not commit `dist/`, `node_modules/`, zips or captured logs.
- Do not add network calls outside the documented heartbeat/diagnostics surface ([SECURITY.md](SECURITY.md)).
- Do not edit tooling under `scripts/` to bypass a failing gate.

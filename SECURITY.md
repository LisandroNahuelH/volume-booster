# Security policy & privacy

## Scope of this repository

This repository contains the source of a browser extension. It does not install services or modify the operating system: building it produces an unpacked extension folder (`dist/`) that a browser loads, plus the usual npm artifacts (`node_modules/`).

| Surface | Path | Notes |
|---|---|---|
| Build output | `dist/` | Recreated by `npm run build`; safe to delete |
| Dependencies | `node_modules/` | Standard npm; `npm ci` reinstalls |
| Extension storage | `chrome.storage.local` | Popup settings, saved sites, install id — device-local, cleared on uninstall |

Nothing else is written outside this repository.

## Privacy

### What the published extension sends

| Event | When | Payload fields | Destination |
|---|---|---|---|
| `install` / `update` | Extension install or update | `v`, `product`, `event`, `extVersion`, `installId`, `installChannel`, `locale`, `timezone`, `ts` | `POST https://www.premium11.com/api/heartbeat` (header `X-Heartbeat-Key` — a client-side soft anti-spam key that ships in every copy of the extension) |
| `ping` | Popup opened, at most once per 24 h | same shape | same endpoint |
| Uninstall notice | On uninstall, Chrome opens the goodbye page once | random `installId` and extension version in the URL | `https://www.premium11.com/goodbye/volume-booster` |

The `installId` is a random UUID generated locally. There is no account, no fingerprinting, and no advertising id.

### What it never sends

Page URLs or titles, tab ids, audio, browsing history, form data, the email of a premium purchase, or license keys.

### Error diagnostics (optional)

Sentry error reporting is compiled in only when a build provides `VITE_SENTRY_DSN`. Source builds have no DSN by default and the integration becomes a no-op. When enabled, a scrubber removes URLs, titles, favicons, request data and user payloads before sending, and default PII collection is disabled. See [docs/observability/sentry.md](docs/observability/sentry.md).

### How to opt out in your own build

1. Remove the `registerHeartbeatOnInstalled()` and `registerUninstallFarewellUrl()` calls from `src/background/main.ts` and the `sendAnonymousHeartbeat("ping")` call from the popup bootstrap, **or**
2. block `www.premium11.com` at the network level, and
3. do not define `VITE_SENTRY_DSN`.

The officially published Chrome Web Store build has no toggle: the heartbeat is minimal, anonymous, and described above. Full policy: https://www.premium11.com/privacidad

## Reporting a vulnerability

- Preferred: GitHub private vulnerability reporting on this repository (Security tab → “Report a vulnerability”).
- Or email support@premium11.com with steps to reproduce and the extension version (chrome://extensions shows it).
- Do not include tokens, personal data, or third-party copyrighted content. Please do not open public issues for exploitable bugs.

## Out of scope

- The Chrome Web Store build pipeline and store listing (contact support@premium11.com).
- Third-party forks: confirm you are on `LisandroNahuelH/volume-booster` before trusting source claims.
- The websites you boost, and Chrome itself.

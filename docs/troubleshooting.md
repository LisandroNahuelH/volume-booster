# Troubleshooting

## Build failures

- `i18n:check` fails → key parity vs `en` or placeholder mismatch. Run `npm run i18n:generate` first. Only allowlist intentional English via `scripts/i18n-identical-allowlist.json`.
- `i18n:audit` fails → visible copy is inline in TS/HTML. Move it to `public/_locales/en/messages.json` and regenerate.
- Faust step fails → `npm ci` again, then `npm run faust:refresh`; check `faust/*.dsp` and `node_modules/@grame/faustwasm`.
- Single test file: `npx vitest run <path>`. Coverage: `npm run test:coverage`. Mutation (slow): `npm run test:mutate`.

## Runtime

- Popup not responding → MV3 workers sleep; open the service-worker console via chrome://extensions → “service worker” → Console/Errors.
- “Cannot capture” / disabled button → needs a user gesture on the focused tab; only `http(s)` pages; protected pages never capture.
- One site still quiet → check DRM/iframes ([limits.md](limits.md)); test the manual lane; report site + Chrome version + extension version.
- All Sites stopped working on a tab → reload the tab (scripts register at runtime), toggle All Sites off/on, and confirm both `dist/content-scripts/auto-booster-*.js` exist after a build.

## Telemetry

- Without `VITE_SENTRY_DSN`, the Sentry integration is a no-op. The heartbeat is described in [SECURITY.md](../SECURITY.md); that file also explains how to remove it in your own build.

## Load unpacked checklist

- “Load unpacked” always points to `dist/`, never the repository root.
- After every rebuild, press **Reload** on chrome://extensions before retesting.
- If the popup renders but does nothing, check the service worker console first.

# Limits

Honest edges. If something here changes, this file must change with it.

## Playback & capture

- DRM/EME-protected players (Widevine) may refuse capture or ignore the boost — no workaround exists.
- `chrome://` pages, the Chrome Web Store, other extensions' pages and some `about:` pages cannot be captured or injected.
- `tabCapture` requires a user gesture on the active tab; there is no silent start. Navigating away reloads the session.
- Boost multiplies the signal that exists: it cannot recover audio that is muted or absent at the source, nor audio that does not flow through the tab (native apps, OS mixer).

## All Sites lane

- Compatibility depends on the site: cross-origin iframes, restrictive CSP, sandboxed frames and some SPA routes may require a reload.
- The main-world bridge is a strict contract; changes that break it break All Sites even if unit tests stay green (see [agent-guardrails/all-sites-main-world-contract.md](agent-guardrails/all-sites-main-world-contract.md)).

## Performance & platform

- One offscreen document and one DSP session per tab: many simultaneous boosted tabs scale CPU with the active sessions.
- Chrome 116+ on desktop Chromium only. No Firefox, no Safari, no mobile browsers.
- Enterprise policies (or user settings) can block `<all_urls>`, disabling the All Sites lane while manual boost keeps working.

## Premium

- The 30-day trial is per install; activation is offline (no cloud sync).
- Uninstalling loses settings, trial state and the locally stored license.
- Source builds also emit the anonymous heartbeat — see [SECURITY.md](../SECURITY.md) for how to remove it.

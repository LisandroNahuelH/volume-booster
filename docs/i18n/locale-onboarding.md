# Adding a New Locale

## 1. Register the locale target

Confirm the locale exists in [`chrome-web-store-locales.json`](./chrome-web-store-locales.json).

## 2. Create the locale catalog

Create `public/_locales/<locale>/messages.json` by copying the canonical catalog [`public/_locales/en/messages.json`](../../public/_locales/en/messages.json), using the same Chrome locale code:

- `fr`
- `de`
- `pt_BR`
- `ar`

## 3. Translate only the `message` values

- Keep all keys identical to `en`.
- Do not change placeholder definitions.
- Keep descriptions only in `en`; non-English locales do not need them.

## 4. Decide if any labels must remain in English

If a key should intentionally stay identical to English, add it to:

- [`scripts/i18n-identical-allowlist.json`](../../scripts/i18n-identical-allowlist.json)

Do not rely on accidental English carry-over.

## 5. Validate the locale

```bash
npm run i18n:generate
npm run i18n:check
npm run i18n:audit
```

## 6. Final repo validation

```bash
npm run verify
```

## Common failure modes

- Missing key in the new locale
- Extra key not present in `en`
- Placeholder mismatch such as `$COUNT$` or `$DOMAIN$`
- Missing plural forms for the locale
- Copy still identical to English without allowlisting
- New UI text introduced inline in TypeScript or HTML instead of `_locales`

## Before shipping

- Check the popup in the target locale
- Check any automation or fallback surfaces that render outside the popup
- If the locale is RTL, verify document `dir`, layout alignment, and text overflow manually

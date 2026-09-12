# Third-party licenses

Volume Booster is MIT-licensed (see [LICENSE](LICENSE)). It builds with, links or embeds the following third-party components:

| Component | License | Where | Text |
|---|---|---|---|
| Faust DSP language and standard libraries (GRAME, CNCM) | LGPL-2.1-or-later, with the Faust special exception | `faust/*.dsp`, compiled WASM in `public/faust/**` | [licenses/faustwasm-COPYING.txt](licenses/faustwasm-COPYING.txt) |
| `@grame/faustwasm` (`faustwasm` npm package) | package metadata: LGPL-3.0 — distributed COPYING: LGPL-2.1-or-later with special exception | build toolchain; WASM runtime assets | [licenses/faustwasm-COPYING.txt](licenses/faustwasm-COPYING.txt) |
| Faust library metadata (`compressors.lib` etc.) | GPLv3 as declared in the compiled metadata (`public/faust/**/dsp-meta.json`) | compiled WASM metadata | embedded notices; canonical GPLv3 text: <https://www.gnu.org/licenses/gpl-3.0.txt> |
| `@sentry/browser` | MIT | optional runtime diagnostics (no-op without a DSN) | [licenses/sentry-browser-MIT.txt](licenses/sentry-browser-MIT.txt) |
| Lucide Icons (sparkles glyph in the brand mark) | ISC (portions Feather, MIT) | `public/brand/premium11-mark.svg` | [licenses/lucide-ISC.txt](licenses/lucide-ISC.txt) |
| Montserrat typeface (Julieta Ulanovsky) | SIL Open Font License 1.1 | `src/assets/fonts/montserrat/*.woff2` | [licenses/montserrat-OFL.txt](licenses/montserrat-OFL.txt) |

Brand note: the Premium11 name, logo and Chrome Web Store listing are trademarks of their owner and are not covered by the MIT grant.

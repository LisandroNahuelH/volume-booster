import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

describe("popup i18n layout contract", () => {
  const main = readFileSync(fileURLToPath(new URL("./main.ts", import.meta.url)), "utf8");
  const layout = readFileSync(fileURLToPath(new URL("./popup-i18n-layout.css", import.meta.url)), "utf8");
  const sessionBoostBar = readFileSync(fileURLToPath(new URL("./popup-session-boost-bar.css", import.meta.url)), "utf8");
  const premiumView = readFileSync(fileURLToPath(new URL("./popup-premium-view.css", import.meta.url)), "utf8");
  const qualityProtector = readFileSync(fileURLToPath(new URL("./popup-quality-protector.css", import.meta.url)), "utf8");

  it("loads the dedicated RTL override sheet from the popup entrypoint", () => {
    expect(main).toContain('import "./popup-i18n-layout.css";');
    expect(layout).toContain(':root[dir="rtl"] .quality-protector__copy');
    expect(layout).toContain(':root[dir="rtl"] .session-boost-bar__button');
    expect(layout).toContain(':root[dir="rtl"] .popup-toolbar__button[data-popup-toolbar="open-popup-premium"]::after');
    expect(layout).toContain(':root[dir="rtl"] .session-carousel__nav--previous');
    expect(layout).toContain(':root[dir="rtl"] .session-carousel__nav--next');
  });

  it("keeps long localized strings wrapped across the popup surfaces called out by the i18n plan", () => {
    expect(sessionBoostBar).toContain("text-wrap: balance;");
    expect(sessionBoostBar).toContain("overflow-wrap: anywhere;");
    expect(premiumView).toContain("flex-wrap: wrap;");
    expect(premiumView).toContain("overflow-wrap: anywhere;");
    expect(qualityProtector).toContain("overflow-wrap: anywhere;");
  });
});

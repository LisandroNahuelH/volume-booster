// @vitest-environment happy-dom

import { createPopupMainHarness } from "./test-support/create-popup-main-harness";

const POPUP_LOCALE_CASES = [
  { locale: "en", dir: "ltr", fontProfile: "latin-cyrillic-vietnamese", title: "Volume Booster by Premium11", region: "Popup quick actions", premium: "Get Premium", premiumTitle: "Activate or manage your lifetime premium license." },
  { locale: "es", dir: "ltr", fontProfile: "latin-cyrillic-vietnamese", title: "Volume Booster by Premium11", region: "Acciones rápidas del popup", premium: "Obtener Premium", premiumTitle: "Activa o administra tu licencia premium vitalicia." },
  { locale: "ar", dir: "rtl", fontProfile: "arabic-persian", title: "معزز الصوت من Premium11", region: "إجراءات النافذة المنبثقة", premium: "احصل على Premium", premiumTitle: "فعّل أو أدِر ترخيصك الدائم." },
  { locale: "ja", dir: "ltr", fontProfile: "cjk", title: "Premium11 音量ブースター", region: "ポップアップのクイック操作", premium: "Premium を入手", premiumTitle: "永久 Premium ライセンスを管理します。" },
  { locale: "zh_CN", dir: "ltr", fontProfile: "cjk", title: "Premium11 音量增强器", region: "弹出窗口快捷操作", premium: "获取 Premium", premiumTitle: "激活或管理你的终身 Premium 许可证。" }
] as const;

describe("popup main i18n locales", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  for (const localeCase of POPUP_LOCALE_CASES) {
    it(`applies locale metadata and localized toolbar copy for ${localeCase.locale}`, async () => {
      const harness = createPopupMainHarness({
        locale: localeCase.locale,
        messages: {
          popupDocumentTitle: localeCase.title,
          popupToolbarPremiumLabel: localeCase.premium,
          popupToolbarPremiumTitle: localeCase.premiumTitle,
          popupToolbarRegionLabel: localeCase.region
        }
      });

      await harness.importPopupMain();

      const toolbar = document.querySelector<HTMLElement>(".popup-toolbar");
      const premiumButton = document.querySelector<HTMLButtonElement>("[data-popup-toolbar='open-popup-premium']");

      expect(document.title).toBe(localeCase.title);
      expect(document.documentElement.lang).toBe(localeCase.locale);
      expect(document.documentElement.dir).toBe(localeCase.dir);
      expect(document.documentElement.dataset.locale).toBe(localeCase.locale);
      expect(document.documentElement.dataset.fontProfile).toBe(localeCase.fontProfile);
      expect(toolbar?.getAttribute("aria-label")).toBe(localeCase.region);
      expect(premiumButton?.textContent).toContain(localeCase.premium);
      expect(premiumButton?.getAttribute("aria-label")).toBe(localeCase.premium);
      expect(premiumButton?.title).toBe(localeCase.premiumTitle);
      expect(document.body.textContent).not.toContain("popupToolbarPremiumLabel");
    });
  }
});

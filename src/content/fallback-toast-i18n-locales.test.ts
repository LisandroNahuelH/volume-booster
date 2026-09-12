// @vitest-environment happy-dom

import { AUTO_BOOSTER_FALLBACK_TOAST_ID } from "../shared/constants";
import { AutoFallbackToast } from "./fallback-toast";

const FALLBACK_TOAST_LOCALE_CASES = [
  { locale: "en", dir: "ltr", fontProfile: "latin-cyrillic-vietnamese", fontToken: "Montserrat", title: "Automatic boosting could not finish on this page.", body: "This page blocked the automatic booster runtime. You can still boost this tab with the manual lane.", manual: "Switch to manual mode", dismiss: "Dismiss" },
  { locale: "ar", dir: "rtl", fontProfile: "arabic-persian", fontToken: "Segoe UI", title: "تعذر إكمال التعزيز التلقائي في هذه الصفحة.", body: "هذه الصفحة منعت مشغل التعزيز التلقائي. لا يزال بإمكانك تعزيز هذه الصفحة عبر المسار اليدوي.", manual: "التبديل إلى الوضع اليدوي", dismiss: "إغلاق" }
] as const;

describe("fallback toast i18n locales", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.innerHTML = "<head></head><body></body>";
  });

  for (const localeCase of FALLBACK_TOAST_LOCALE_CASES) {
    it(`localizes only the injected toast root for ${localeCase.locale}`, () => {
      document.documentElement.lang = "host-page";
      document.documentElement.dir = "ltr";
      document.documentElement.dataset.locale = "host-page";
      document.documentElement.dataset.fontProfile = "host-font-profile";
      vi.stubGlobal(
        "chrome",
        {
          i18n: {
            getMessage: vi.fn((key: string) => ({
              autoBoosterFallbackToastTitle: localeCase.title,
              autoBoosterFallbackToastPermissionBody: localeCase.body,
              autoBoosterFallbackToastManualAction: localeCase.manual,
              autoBoosterFallbackToastDismissAction: localeCase.dismiss
            })[key] ?? ""),
            getUILanguage: vi.fn(() => localeCase.locale)
          },
          runtime: {
            getURL: vi.fn((path: string) => `chrome-extension://id/${path}`)
          }
        } as unknown as typeof chrome
      );

      const toast = new AutoFallbackToast({ onDismiss: vi.fn(), onManualFallback: vi.fn() });
      toast.show({ reason: "permission_missing", tabId: 7 });
      const root = document.getElementById(AUTO_BOOSTER_FALLBACK_TOAST_ID) as HTMLDivElement | null;

      expect(document.documentElement.lang).toBe("host-page");
      expect(document.documentElement.dir).toBe("ltr");
      expect(document.documentElement.dataset.locale).toBe("host-page");
      expect(document.documentElement.dataset.fontProfile).toBe("host-font-profile");
      expect(root?.lang).toBe(localeCase.locale);
      expect(root?.dir).toBe(localeCase.dir);
      expect(root?.dataset.locale).toBe(localeCase.locale);
      expect(root?.dataset.fontProfile).toBe(localeCase.fontProfile);
      expect(root?.style.getPropertyValue("--font-ui")).toContain(localeCase.fontToken);
      expect(root?.textContent).toContain(localeCase.title);
      expect(root?.textContent).toContain(localeCase.body);
      expect(root?.textContent).toContain(localeCase.manual);
      expect(root?.textContent).toContain(localeCase.dismiss);
      expect(root?.textContent).not.toContain("autoBoosterFallbackToastTitle");
    });
  }
});

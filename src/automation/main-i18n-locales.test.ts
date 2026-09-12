// @vitest-environment happy-dom

const AUTOMATION_LOCALE_CASES = [
  { locale: "en", dir: "ltr", fontProfile: "latin-cyrillic-vietnamese", title: "Volume Booster by Premium11 Automation", heading: "Volume Booster by Premium11 Automation Bridge", body: "Internal page used by the Playwright harness to restore all-sites access when Chrome has limited it and to send extension commands.", action: "Restore all-sites access" },
  { locale: "es", dir: "ltr", fontProfile: "latin-cyrillic-vietnamese", title: "Automatización de Volume Booster by Premium11", heading: "Puente de automatización de Volume Booster by Premium11", body: "Página interna utilizada por el arnés de Playwright para restaurar el acceso global cuando Chrome lo limita y para enviar comandos a la extensión.", action: "Restaurar acceso a todos los sitios" },
  { locale: "ar", dir: "rtl", fontProfile: "arabic-persian", title: "أتمتة Premium11", heading: "جسر الأتمتة من Premium11", body: "صفحة داخلية يستخدمها Playwright لاستعادة صلاحية كل المواقع وإرسال أوامر الامتداد.", action: "استعادة وصول كل المواقع" },
  { locale: "ja", dir: "ltr", fontProfile: "cjk", title: "Premium11 自動化", heading: "Premium11 自動化ブリッジ", body: "Chrome によって制限された全サイトアクセスを Playwright が復元し、拡張コマンドを送るための内部ページです。", action: "全サイトアクセスを復元" },
  { locale: "zh_CN", dir: "ltr", fontProfile: "cjk", title: "Premium11 自动化", heading: "Premium11 自动化桥接页", body: "供 Playwright 在 Chrome 限制全站权限时恢复访问并发送扩展命令的内部页面。", action: "恢复所有站点访问权限" }
] as const;

describe("automation main i18n locales", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  for (const localeCase of AUTOMATION_LOCALE_CASES) {
    it(`applies locale metadata and localized bridge copy for ${localeCase.locale}`, async () => {
      vi.doMock("../shared/observability/sentry", () => ({ initSentryForContext: vi.fn() }));
      vi.stubGlobal(
        "chrome",
        {
          i18n: {
            getMessage: vi.fn((key: string) => ({
              automationBridgeBody: localeCase.body,
              automationBridgeTitle: localeCase.heading,
              automationDocumentTitle: localeCase.title,
              automationRestoreAllSitesAccess: localeCase.action
            })[key] ?? ""),
            getUILanguage: vi.fn(() => localeCase.locale)
          }
        } as unknown as typeof chrome
      );
      document.body.innerHTML = '<div id="app"></div>';

      await import("./main");

      expect(document.title).toBe(localeCase.title);
      expect(document.documentElement.lang).toBe(localeCase.locale);
      expect(document.documentElement.dir).toBe(localeCase.dir);
      expect(document.documentElement.dataset.locale).toBe(localeCase.locale);
      expect(document.documentElement.dataset.fontProfile).toBe(localeCase.fontProfile);
      expect(document.querySelector("h1")?.textContent).toBe(localeCase.heading);
      expect(document.querySelector("p")?.textContent?.trim()).toBe(localeCase.body);
      expect(document.querySelector<HTMLButtonElement>("[data-action='request-global-permission']")?.textContent?.trim()).toBe(
        localeCase.action
      );
      expect(document.body.textContent).not.toContain("automationBridgeTitle");
      expect(window.__PRISM_AUTOMATION__).toBeDefined();
    });
  }
});

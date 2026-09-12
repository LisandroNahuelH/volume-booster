// @vitest-environment happy-dom

import { applyElementLocalePresentation } from "./apply-element-locale-presentation";
import { getUiLocalePresentation } from "./get-ui-locale-presentation";
import { resolveUiFontProfile } from "./resolve-ui-font-profile";

describe("ui locale presentation", () => {
  it("maps RTL and complex-script locales to dedicated font profiles", () => {
    expect(resolveUiFontProfile("ar")).toBe("arabic-persian");
    expect(resolveUiFontProfile("zh_CN")).toBe("cjk");
    expect(resolveUiFontProfile("am")).toBe("ethiopic");
  });

  it("returns locale metadata and a font stack for the active locale", () => {
    expect(getUiLocalePresentation("ar")).toMatchObject({
      locale: "ar",
      dir: "rtl",
      fontProfile: "arabic-persian"
    });
    expect(getUiLocalePresentation("zh_CN").fontFamily).toContain("Microsoft YaHei UI");
  });

  it("applies locale metadata and the resolved font stack to an element root", () => {
    const root = document.createElement("div");
    const result = applyElementLocalePresentation(root, "ar");

    expect(result.dir).toBe("rtl");
    expect(root.lang).toBe("ar");
    expect(root.dir).toBe("rtl");
    expect(root.dataset.locale).toBe("ar");
    expect(root.dataset.fontProfile).toBe("arabic-persian");
    expect(root.style.getPropertyValue("--font-ui")).toContain("Noto Sans Arabic");
  });
});

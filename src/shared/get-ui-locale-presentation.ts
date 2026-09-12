import { getUiLanguage } from "./get-ui-language";
import { getUiFontStack } from "./get-ui-font-stack";
import { isRtlLocale } from "./is-rtl-locale";
import { resolveUiFontProfile } from "./resolve-ui-font-profile";
import type { UiLocalePresentation } from "./ui-locale-presentation-types";

export function getUiLocalePresentation(locale = getUiLanguage()): UiLocalePresentation {
  const fontProfile = resolveUiFontProfile(locale);
  return {
    locale,
    dir: isRtlLocale(locale) ? "rtl" : "ltr",
    fontProfile,
    fontFamily: getUiFontStack(fontProfile)
  };
}

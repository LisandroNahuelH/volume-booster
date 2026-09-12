import { getUiLocalePresentation } from "./get-ui-locale-presentation";
import type { UiLocalePresentation } from "./ui-locale-presentation-types";

export function applyElementLocalePresentation(element: HTMLElement, locale?: string): UiLocalePresentation {
  const presentation = getUiLocalePresentation(locale);
  element.lang = presentation.locale;
  element.dir = presentation.dir;
  element.dataset.locale = presentation.locale;
  element.dataset.fontProfile = presentation.fontProfile;
  element.style.setProperty("--font-ui", presentation.fontFamily);
  return presentation;
}

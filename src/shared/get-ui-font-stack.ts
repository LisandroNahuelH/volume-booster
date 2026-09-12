import { UI_FONT_PROFILE_STACKS } from "./ui-font-profile-stacks";
import type { UiFontProfile } from "./ui-locale-presentation-types";

export function getUiFontStack(fontProfile: UiFontProfile): string {
  return UI_FONT_PROFILE_STACKS[fontProfile];
}

export type UiFontProfile =
  | "latin-cyrillic-vietnamese"
  | "arabic-persian"
  | "hebrew"
  | "devanagari"
  | "bengali"
  | "gujarati"
  | "kannada"
  | "malayalam"
  | "oriya"
  | "tamil"
  | "telugu"
  | "thai"
  | "cjk"
  | "ethiopic";

export interface UiLocalePresentation {
  dir: "ltr" | "rtl";
  fontFamily: string;
  fontProfile: UiFontProfile;
  locale: string;
}

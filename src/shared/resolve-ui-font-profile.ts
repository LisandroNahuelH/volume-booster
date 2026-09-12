import type { UiFontProfile } from "./ui-locale-presentation-types";

const PROFILE_PREFIX_GROUPS: readonly [UiFontProfile, readonly string[]][] = [
  ["ethiopic", ["am"]],
  ["arabic-persian", ["ar", "fa", "ur"]],
  ["hebrew", ["he"]],
  ["devanagari", ["hi", "mr", "ne"]],
  ["bengali", ["bn"]],
  ["gujarati", ["gu"]],
  ["kannada", ["kn"]],
  ["malayalam", ["ml"]],
  ["oriya", ["or"]],
  ["tamil", ["ta"]],
  ["telugu", ["te"]],
  ["thai", ["th"]],
  ["cjk", ["ja", "ko", "zh"]]
];

export function resolveUiFontProfile(locale: string): UiFontProfile {
  const normalized = locale.toLowerCase().replace(/_/g, "-");

  for (const [profile, prefixes] of PROFILE_PREFIX_GROUPS) {
    if (prefixes.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}-`))) {
      return profile;
    }
  }

  return "latin-cyrillic-vietnamese";
}

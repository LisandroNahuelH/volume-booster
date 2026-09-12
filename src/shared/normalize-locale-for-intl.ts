export function normalizeLocaleForIntl(locale: string): string {
  return locale.replace(/_/g, "-");
}

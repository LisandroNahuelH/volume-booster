import { getBrowserLocale } from "../../../shared/runtime-i18n";
import { normalizeLocaleForIntl } from "../../../shared/normalize-locale-for-intl";

export function formatPresetValue(value: number, loadedLocale: string | null): string {
  return new Intl.NumberFormat(normalizeLocaleForIntl(loadedLocale ?? getBrowserLocale())).format(value);
}

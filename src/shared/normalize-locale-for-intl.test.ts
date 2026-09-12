import { getPluralCandidateKeys } from "./get-plural-candidate-keys";
import { normalizeLocaleForIntl } from "./normalize-locale-for-intl";

describe("normalizeLocaleForIntl", () => {
  it("converts Chrome locale codes into Intl-safe BCP 47 tags without breaking plural selection", () => {
    expect(normalizeLocaleForIntl("zh_CN")).toBe("zh-CN");
    expect(normalizeLocaleForIntl("en_US")).toBe("en-US");
    expect(() => getPluralCandidateKeys("boostingCount", 2, "zh_CN")).not.toThrow();
    expect(getPluralCandidateKeys("boostingCount", 0, "ar")).toContain("boostingCount_zero");
  });
});

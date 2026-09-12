import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

describe("chrome web store locale registry", () => {
  it("matches the current official Chrome extension locale list and keeps critical metadata for promoted locales", () => {
    const registry = JSON.parse(
      readFileSync(fileURLToPath(new URL("./chrome-web-store-locales.json", import.meta.url)), "utf8")
    ) as Array<{
      code: string;
      fontProfile: string;
      qaStatus: string;
      rtl: boolean;
      runtimeStatus: string;
      storeStatus: string;
    }>;

    expect(registry.map(({ code }) => code)).toEqual(
      "ar am bg bn ca cs da de el en en_AU en_GB en_US es es_419 et fa fi fil fr gu he hi hr hu id it ja kn ko lt lv ml mr ms nl no pl pt_BR pt_PT ro ru sk sl sr sv sw ta te th tr uk vi zh_CN zh_TW".split(
        " "
      )
    );
    expect(registry.find(({ code }) => code === "en")).toMatchObject({
      runtimeStatus: "active",
      storeStatus: "generated",
      qaStatus: "baseline-complete"
    });
    expect(registry.find(({ code }) => code === "es")).toMatchObject({
      runtimeStatus: "active",
      storeStatus: "generated",
      qaStatus: "baseline-complete"
    });
    expect(registry.find(({ code }) => code === "fa")).toMatchObject({
      fontProfile: "arabic-persian",
      rtl: true
    });
    expect(registry.find(({ code }) => code === "en_AU")).toMatchObject({
      fontProfile: "latin-cyrillic-vietnamese",
      rtl: false
    });
    expect(registry.find(({ code }) => code === "ms")).toMatchObject({
      fontProfile: "latin-cyrillic-vietnamese",
      rtl: false
    });
    expect(registry.find(({ code }) => code === "no")).toMatchObject({
      fontProfile: "latin-cyrillic-vietnamese",
      rtl: false
    });
  });
});

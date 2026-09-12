import { translate } from "../../../shared/runtime-i18n";
import { POPUP_TOOLBAR_ICON_MARKUP, getPopupToolbarItems } from "../../popup-toolbar";
import { escapeHtml } from "../util/escape-html";
import type { PopupRenderContext } from "./popup-render-types";

export function renderPopupToolbar(renderContext: PopupRenderContext): string {
  if (!renderContext.catalog) {
    return "";
  }

  const items = getPopupToolbarItems(
    renderContext.popupTheme,
    renderContext.currentView,
    renderContext.catalog,
    renderContext.isLifetimePremiumActive
  );

  return `
    <section class="popup-toolbar" aria-label="${escapeHtml(translate(renderContext.catalog, "popupToolbarRegionLabel"))}">
      <a
        class="p11-brand"
        href="https://www.premium11.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Premium11"
        title="Premium11"
      >
        <img class="p11-brand__mark" src="./brand/premium11-mark.svg" alt="" width="35" height="35" />
        <span class="p11-brand__name"></span>
      </a>
      <div class="popup-toolbar__bar">
        ${items
          .map(
            (item) => `
              <button
                class="popup-toolbar__button ${item.isActive ? "is-active" : ""} ${item.isInert ? "is-inert" : ""}"
                data-action="${item.action}"
                data-popup-toolbar="${item.action}"
                aria-label="${escapeHtml(item.label)}"
                title="${escapeHtml(item.title)}"
                ${item.isInert ? 'aria-disabled="true"' : ""}
                ${item.isActive ? 'aria-pressed="true"' : ""}
                type="button"
              >
                <span class="popup-toolbar__icon" aria-hidden="true">
                  ${POPUP_TOOLBAR_ICON_MARKUP[item.icon]}
                </span>
                ${item.visibleLabel ? `<span class="popup-toolbar__text">${escapeHtml(item.visibleLabel)}</span>` : ""}
              </button>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

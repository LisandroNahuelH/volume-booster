import { isAnyAutoStrategyAttached } from "./is-any-auto-strategy-attached";
import type { AutoBoosterControllerInternals } from "../runtime-state";

export function shouldReportAttachFailure(
  controller: AutoBoosterControllerInternals,
  generation: number
): boolean {
  if (generation !== controller.attachGeneration) {
    return false;
  }

  if (controller.state.tabId === null) {
    return false;
  }

  if (isAnyAutoStrategyAttached(controller)) {
    return false;
  }

  return controller.state.attachState === "failed";
}

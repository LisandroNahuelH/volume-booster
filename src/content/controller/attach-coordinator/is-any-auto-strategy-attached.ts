import { hasBridgeStrategy } from "./has-bridge-strategy";
import { hasMediaStrategy } from "./has-media-strategy";
import type { AutoBoosterControllerInternals } from "../runtime-state";

export function isAnyAutoStrategyAttached(
  controller: AutoBoosterControllerInternals
): boolean {
  return hasMediaStrategy(controller) || hasBridgeStrategy(controller);
}

import type { AutoBoosterControllerInternals } from "../runtime-state";

export function hasMediaStrategy(controller: AutoBoosterControllerInternals): boolean {
  return controller.trackedSessions.size > 0;
}

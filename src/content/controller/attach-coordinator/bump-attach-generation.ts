import type { AutoBoosterControllerInternals } from "../runtime-state";

export function bumpAttachGeneration(controller: AutoBoosterControllerInternals): number {
  controller.attachGeneration += 1;
  return controller.attachGeneration;
}

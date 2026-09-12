import { hasBridgeStrategy } from "./attach-coordinator/has-bridge-strategy";
import { hasMediaStrategy } from "./attach-coordinator/has-media-strategy";
import { resolveMergedAttachSnapshot } from "./attach-coordinator/resolve-merged-attach-snapshot";
import type { AutoBoosterControllerInternals } from "./runtime-state";

export function syncAttachState(controller: AutoBoosterControllerInternals): void {
  const snapshot = resolveMergedAttachSnapshot({
    enabled: controller.state.enabled,
    hasMediaStrategy: hasMediaStrategy(controller),
    hasBridgeStrategy: hasBridgeStrategy(controller),
    mediaAttachState: controller.state.attachState,
    bridgeAttachState: controller.bridgeStatus.attachState,
    mediaAttachReason: controller.state.attachReason,
    bridgeAttachReason: controller.bridgeStatus.attachReason
  });

  controller.state.attachState = snapshot.attachState;
  controller.state.attachReason = snapshot.attachReason;
  controller.state.activeStrategy = snapshot.activeStrategy;
}

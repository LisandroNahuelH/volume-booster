import type { AutoBoosterControllerInternals } from "../runtime-state";

export function hasBridgeStrategy(controller: AutoBoosterControllerInternals): boolean {
  return (
    controller.bridgeStatus.attachState === "attached" &&
    controller.bridgeStatus.activeStrategy === "web_audio_bridge"
  );
}

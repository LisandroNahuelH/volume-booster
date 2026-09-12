import type { MediaElementSessionState } from "./media-element-session-state";
import { activateMediaNativeFallbackFromFaust } from "./activate-media-native-fallback-from-faust";

export function wireMediaFaustProcessorError(state: MediaElementSessionState): void {
  state.faustNode?.addEventListener("processorerror", () => {
    activateMediaNativeFallbackFromFaust(state);
  });
}

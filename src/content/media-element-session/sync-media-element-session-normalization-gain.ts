import type { DspRuntimeParameters } from "../../shared/audio-settings";
import type { MediaElementSessionState } from "./media-element-session-state";
import { applyMediaNativeRuntimeParameters } from "./native/apply-media-native-runtime-parameters";

export function syncMediaElementSessionNormalizationGain(
  state: MediaElementSessionState,
  runtime: DspRuntimeParameters
): void {
  if (state.engineStrategy === "native_fallback" && state.nativeGraph) {
    applyMediaNativeRuntimeParameters(
      state.nativeGraph,
      runtime,
      state.latestMetrics.normalizationAppliedGainDb
    );
    return;
  }

  if (!state.faustNode || !state.asset) {
    return;
  }

  state.faustNode.setParamValue(
    state.asset.controlPaths.normalizationGainDb,
    state.latestMetrics.normalizationAppliedGainDb
  );
  state.faustNode.setParamValue(
    state.asset.controlPaths.normalizationEnabled,
    runtime.normalization.enabled ? 1 : 0
  );
}

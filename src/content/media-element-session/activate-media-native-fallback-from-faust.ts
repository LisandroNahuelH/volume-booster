import type { MediaElementSessionState } from "./media-element-session-state";
import { applyMediaElementSessionRuntimeParameters } from "./apply-media-element-session-runtime-parameters";
import { createMediaNativeFallbackGraph } from "./native/create-media-native-fallback-graph";
import { setMediaElementSessionProcessingEnabled } from "./set-media-element-session-processing-enabled";

export function activateMediaNativeFallbackFromFaust(
  state: MediaElementSessionState
): void {
  if (state.engineStrategy === "native_fallback") {
    return;
  }

  try {
    state.faustNode?.disconnect();
    state.outputAnalyserNode.disconnect();
    state.wetGainNode.disconnect();
    state.inputAnalyserNode.disconnect();
    state.sourceNode.disconnect();
    state.sourceNode.connect(state.inputAnalyserNode);
    state.sourceNode.connect(state.bypassGainNode);

    const nativeGraph = createMediaNativeFallbackGraph(
      state.audioContext,
      state.inputAnalyserNode,
      state.outputAnalyserNode
    );

    state.engineStrategy = "native_fallback";
    state.faustNode = null;
    state.asset = null;
    state.nativeGraph = nativeGraph;
    state.wetGainNode = nativeGraph.wetGain;
    applyMediaElementSessionRuntimeParameters(state);
    setMediaElementSessionProcessingEnabled(state, state.processingEnabled);
  } catch {
    // Keep best-effort graph; next refresh may recover.
  }
}

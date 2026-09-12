import type { MediaElementSessionGraph } from "./media-element-session-state";
import { createMediaPeakAnalyser } from "./create-media-peak-analyser";
import { createMediaNativeFallbackGraph } from "./native/create-media-native-fallback-graph";

export function buildMediaNativeSessionGraph(
  audioContext: AudioContext,
  sourceNode: MediaElementAudioSourceNode
): MediaElementSessionGraph {
  const inputAnalyserNode = createMediaPeakAnalyser(audioContext);
  const outputAnalyserNode = createMediaPeakAnalyser(audioContext);
  const bypassGainNode = audioContext.createGain();
  const nativeGraph = createMediaNativeFallbackGraph(
    audioContext,
    inputAnalyserNode,
    outputAnalyserNode
  );

  sourceNode.connect(inputAnalyserNode);
  sourceNode.connect(bypassGainNode);
  bypassGainNode.connect(audioContext.destination);
  bypassGainNode.gain.value = 0;
  nativeGraph.wetGain.gain.value = 1;

  return {
    audioContext,
    sourceNode,
    inputAnalyserNode,
    outputAnalyserNode,
    wetGainNode: nativeGraph.wetGain,
    bypassGainNode,
    engineStrategy: "native_fallback",
    faustNode: null,
    asset: null,
    nativeGraph
  };
}

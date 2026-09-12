import type { FaustMonoAudioWorkletNode } from "@grame/faustwasm";
import type { LoudnessEstimatorState } from "../../shared/audio-settings/internal/loudness-estimator-state";
import type {
  AdvancedAudioSettings,
  DspRuntimeMetrics
} from "../../shared/types";
import type { FaustAssetDescriptor } from "../../offscreen/faust-assets";
import type { MediaNativeFallbackGraph } from "./native/media-native-graph-types";

export type MediaEngineStrategy = "faust" | "native_fallback";

export interface MediaElementSessionGraph {
  audioContext: AudioContext;
  sourceNode: MediaElementAudioSourceNode;
  inputAnalyserNode: AnalyserNode;
  outputAnalyserNode: AnalyserNode;
  wetGainNode: GainNode;
  bypassGainNode: GainNode;
  engineStrategy: MediaEngineStrategy;
  faustNode: FaustMonoAudioWorkletNode | null;
  asset: FaustAssetDescriptor | null;
  nativeGraph: MediaNativeFallbackGraph | null;
}

export interface MediaElementSessionState extends MediaElementSessionGraph {
  mediaElement: HTMLMediaElement;
  currentGainPercent: number;
  currentSettings: AdvancedAudioSettings;
  latestMetrics: DspRuntimeMetrics;
  normalizationLoudnessState: LoudnessEstimatorState;
  processingEnabled: boolean;
}

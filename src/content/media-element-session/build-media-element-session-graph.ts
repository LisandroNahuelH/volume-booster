import type { MediaElementSessionGraph } from "./media-element-session-state";
import { buildMediaFaustSessionGraph } from "./build-media-faust-session-graph";
import { buildMediaNativeSessionGraph } from "./build-media-native-session-graph";

export async function buildMediaElementSessionGraph(
  audioContext: AudioContext,
  sourceNode: MediaElementAudioSourceNode
): Promise<MediaElementSessionGraph> {
  try {
    return await buildMediaFaustSessionGraph(audioContext, sourceNode);
  } catch {
    // Premium smooth: keep attach alive with native WebAudio when Faust/worklet fails.
    return buildMediaNativeSessionGraph(audioContext, sourceNode);
  }
}

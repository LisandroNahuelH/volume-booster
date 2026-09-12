import type { DspRuntimeParameters } from "../../../shared/audio-settings";
import { clampNumber } from "../../main-world/internal/math/clamp-number";
import { dbToGain } from "../../main-world/internal/math/db-to-gain";
import { createMediaSoftClipCurve } from "./create-media-soft-clip-curve";
import {
  MEDIA_LOW_SHELF_FREQUENCY_HZ,
  MEDIA_MAX_OUTPUT_GAIN_DB,
  MEDIA_MID_PEAK_FREQUENCY_HZ,
  MEDIA_MID_PEAK_Q,
  MEDIA_PROTECTION_DEPTH_ATTACK_FLOOR_SEC
} from "./media-native-graph-constants";
import type { MediaNativeFallbackGraph } from "./media-native-graph-types";

export function applyMediaNativeRuntimeParameters(
  fallbackGraph: MediaNativeFallbackGraph,
  runtime: DspRuntimeParameters,
  normalizationGainDb = 0
): void {
  fallbackGraph.preGain.gain.value = dbToGain(runtime.inputDriveDb + normalizationGainDb);
  fallbackGraph.lowShelf.type = "lowshelf";
  fallbackGraph.lowShelf.frequency.value = MEDIA_LOW_SHELF_FREQUENCY_HZ;
  fallbackGraph.lowShelf.gain.value =
    runtime.toneLowBandGainDb + runtime.lowBandTrimDb + runtime.lowBandMakeupDb;
  fallbackGraph.midPeak.type = "peaking";
  fallbackGraph.midPeak.frequency.value = MEDIA_MID_PEAK_FREQUENCY_HZ;
  fallbackGraph.midPeak.Q.value = MEDIA_MID_PEAK_Q;
  fallbackGraph.midPeak.gain.value =
    runtime.toneMidBandGainDb + runtime.clarityPresenceTiltDb - runtime.midHighThresholdOffsetDb * 0.08;
  fallbackGraph.compressor.threshold.value = clampNumber(
    -32 - runtime.multibandDepth * 0.14 + runtime.lowBandThresholdOffsetDb,
    -60,
    -6
  );
  fallbackGraph.compressor.knee.value = clampNumber(18 - runtime.lowBandRatioBias * 8, 0, 30);
  fallbackGraph.compressor.ratio.value = clampNumber(
    1.8 + runtime.multibandDepth * 0.11 + runtime.lowBandRatioBias * 2.4,
    1,
    20
  );
  fallbackGraph.compressor.attack.value = clampNumber(
    Math.max(runtime.lookaheadMs / 1000, MEDIA_PROTECTION_DEPTH_ATTACK_FLOOR_SEC),
    MEDIA_PROTECTION_DEPTH_ATTACK_FLOOR_SEC,
    0.2
  );
  fallbackGraph.compressor.release.value = clampNumber(runtime.releaseMs / 1000, 0.06, 1.2);
  fallbackGraph.shaper.curve = createMediaSoftClipCurve(runtime.outputSoftClipMix);
  fallbackGraph.wetGain.gain.value = dbToGain(
    Math.min(MEDIA_MAX_OUTPUT_GAIN_DB, runtime.outputCeilingDb)
  );
  fallbackGraph.dryGain.gain.value = 0;
}

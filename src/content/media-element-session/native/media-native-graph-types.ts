export type MediaNativeFallbackGraph = {
  preGain: GainNode;
  lowShelf: BiquadFilterNode;
  midPeak: BiquadFilterNode;
  compressor: DynamicsCompressorNode;
  shaper: WaveShaperNode;
  wetGain: GainNode;
  dryGain: GainNode;
};

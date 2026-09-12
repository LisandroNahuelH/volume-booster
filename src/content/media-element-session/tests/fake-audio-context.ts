class FakeNode {
  readonly connect = vi.fn();
  readonly disconnect = vi.fn();
}

class FakeAnalyserNode extends FakeNode {
  fftSize = 0;
  smoothingTimeConstant = 0;
  peak = 0;
  readonly getFloatTimeDomainData = vi.fn((buffer: Float32Array) => {
    buffer.fill(0);
    buffer[0] = this.peak;
  });
}

class FakeGainNode extends FakeNode {
  gain = { value: 0 };
}

class FakeBiquadFilterNode extends FakeNode {
  type = "lowshelf";
  frequency = { value: 0 };
  Q = { value: 0 };
  gain = { value: 0 };
}

class FakeDynamicsCompressorNode extends FakeNode {
  threshold = { value: 0 };
  knee = { value: 0 };
  ratio = { value: 0 };
  attack = { value: 0 };
  release = { value: 0 };
}

class FakeWaveShaperNode extends FakeNode {
  curve: Float32Array | null = null;
}

export class FakeAudioContext {
  static instances: FakeAudioContext[] = [];
  static nextState: AudioContextState = "running";
  static keepStateOnResume = false;
  static sourceError: unknown = null;
  static resumeError: unknown = null;

  state: AudioContextState;
  readonly destination = {};
  readonly audioWorklet = {
    addModule: vi.fn(async () => undefined)
  };
  readonly sourceNode = new FakeNode();
  readonly inputAnalyser = new FakeAnalyserNode();
  readonly outputAnalyser = new FakeAnalyserNode();
  readonly wetGainNode = new FakeGainNode();
  readonly bypassGainNode = new FakeGainNode();
  readonly createdGains: FakeGainNode[] = [];
  readonly createMediaElementSource = vi.fn((_element: HTMLMediaElement) => {
    if (FakeAudioContext.sourceError) {
      throw FakeAudioContext.sourceError;
    }

    return this.sourceNode as unknown as MediaElementAudioSourceNode;
  });
  readonly createAnalyser = vi.fn(() => {
    if (this.createAnalyser.mock.calls.length === 1) {
      return this.inputAnalyser as unknown as AnalyserNode;
    }

    if (this.createAnalyser.mock.calls.length === 2) {
      return this.outputAnalyser as unknown as AnalyserNode;
    }

    return new FakeAnalyserNode() as unknown as AnalyserNode;
  });
  readonly createGain = vi.fn(() => {
    const node = new FakeGainNode();
    this.createdGains.push(node);

    // First two gains in Faust path are wet + bypass (tests assert disconnect on these).
    if (this.createdGains.length === 1) {
      Object.assign(this.wetGainNode, node);
      return this.wetGainNode as unknown as GainNode;
    }

    if (this.createdGains.length === 2) {
      Object.assign(this.bypassGainNode, node);
      return this.bypassGainNode as unknown as GainNode;
    }

    return node as unknown as GainNode;
  });
  readonly createBiquadFilter = vi.fn(
    () => new FakeBiquadFilterNode() as unknown as BiquadFilterNode
  );
  readonly createDynamicsCompressor = vi.fn(
    () => new FakeDynamicsCompressorNode() as unknown as DynamicsCompressorNode
  );
  readonly createWaveShaper = vi.fn(
    () => new FakeWaveShaperNode() as unknown as WaveShaperNode
  );
  readonly resume = vi.fn(async () => {
    if (FakeAudioContext.resumeError) {
      throw FakeAudioContext.resumeError;
    }

    if (!FakeAudioContext.keepStateOnResume) {
      this.state = "running";
    }
  });
  readonly close = vi.fn(async () => {
    this.state = "closed";
  });

  constructor() {
    this.state = FakeAudioContext.nextState;
    FakeAudioContext.instances.push(this);
  }

  static reset() {
    FakeAudioContext.instances.length = 0;
    FakeAudioContext.nextState = "running";
    FakeAudioContext.keepStateOnResume = false;
    FakeAudioContext.sourceError = null;
    FakeAudioContext.resumeError = null;
  }
}

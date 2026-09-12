import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildMediaElementSessionGraph } from "./build-media-element-session-graph";
import { FakeAudioContext } from "./tests/fake-audio-context";

vi.mock("@grame/faustwasm", () => ({
  FaustMonoAudioWorkletNode: vi.fn(() => {
    throw new Error("faust unavailable");
  })
}));

vi.mock("../../offscreen/faust-assets", () => ({
  selectFaustAsset: () => ({
    meta: {},
    processorName: "test",
    workletModulePath: "worklet.js",
    controlPaths: {},
    loadFactory: async () => ({})
  })
}));

vi.mock("./ensure-media-worklet-module", () => ({
  ensureMediaWorkletModule: vi.fn(async () => undefined)
}));

describe("buildMediaElementSessionGraph", () => {
  beforeEach(() => {
    FakeAudioContext.reset();
  });

  it("falls back to native when Faust construction fails", async () => {
    const audioContext = new FakeAudioContext() as unknown as AudioContext;
    const sourceNode = audioContext.createMediaElementSource(
      {} as HTMLMediaElement
    );

    const graph = await buildMediaElementSessionGraph(audioContext, sourceNode);

    expect(graph.engineStrategy).toBe("native_fallback");
    expect(graph.faustNode).toBeNull();
    expect(graph.nativeGraph).not.toBeNull();
  });
});

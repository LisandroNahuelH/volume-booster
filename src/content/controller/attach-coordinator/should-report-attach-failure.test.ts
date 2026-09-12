import { describe, expect, it } from "vitest";
import { shouldReportAttachFailure } from "./should-report-attach-failure";
import type { AutoBoosterControllerInternals } from "../runtime-state";

function makeController(
  partial: Partial<AutoBoosterControllerInternals> & {
    state: AutoBoosterControllerInternals["state"];
    bridgeStatus: AutoBoosterControllerInternals["bridgeStatus"];
    trackedSessions: AutoBoosterControllerInternals["trackedSessions"];
  }
): AutoBoosterControllerInternals {
  return {
    attachGeneration: 1,
    ...partial
  } as AutoBoosterControllerInternals;
}

describe("shouldReportAttachFailure", () => {
  it("suppresses stale generation reports", () => {
    const controller = makeController({
      attachGeneration: 2,
      trackedSessions: new Map(),
      bridgeStatus: {
        attachState: "idle",
        activeStrategy: "none"
      } as AutoBoosterControllerInternals["bridgeStatus"],
      state: {
        tabId: 1,
        attachState: "failed",
        activeStrategy: "none"
      } as AutoBoosterControllerInternals["state"]
    });

    expect(shouldReportAttachFailure(controller, 1)).toBe(false);
  });

  it("suppresses when bridge is already attached", () => {
    const controller = makeController({
      attachGeneration: 1,
      trackedSessions: new Map(),
      bridgeStatus: {
        attachState: "attached",
        activeStrategy: "web_audio_bridge"
      } as AutoBoosterControllerInternals["bridgeStatus"],
      state: {
        tabId: 1,
        attachState: "failed",
        activeStrategy: "none"
      } as AutoBoosterControllerInternals["state"]
    });

    expect(shouldReportAttachFailure(controller, 1)).toBe(false);
  });

  it("allows report when truly failed", () => {
    const controller = makeController({
      attachGeneration: 1,
      trackedSessions: new Map(),
      bridgeStatus: {
        attachState: "observing",
        activeStrategy: "none"
      } as AutoBoosterControllerInternals["bridgeStatus"],
      state: {
        tabId: 1,
        attachState: "failed",
        activeStrategy: "none"
      } as AutoBoosterControllerInternals["state"]
    });

    expect(shouldReportAttachFailure(controller, 1)).toBe(true);
  });
});

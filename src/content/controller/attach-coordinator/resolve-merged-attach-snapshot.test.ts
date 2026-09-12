import { describe, expect, it } from "vitest";
import { resolveMergedAttachSnapshot } from "./resolve-merged-attach-snapshot";

describe("resolveMergedAttachSnapshot", () => {
  it("returns idle when disabled", () => {
    expect(
      resolveMergedAttachSnapshot({
        enabled: false,
        hasMediaStrategy: true,
        hasBridgeStrategy: false,
        mediaAttachState: "attached",
        bridgeAttachState: "idle"
      })
    ).toEqual({ attachState: "idle", activeStrategy: "none" });
  });

  it("prefers attached hybrid when both strategies win", () => {
    expect(
      resolveMergedAttachSnapshot({
        enabled: true,
        hasMediaStrategy: true,
        hasBridgeStrategy: true,
        mediaAttachState: "failed",
        bridgeAttachState: "failed",
        mediaAttachReason: "attach_failed"
      })
    ).toEqual({ attachState: "attached", activeStrategy: "hybrid" });
  });

  it("does not fail when a strategy is attached even if peer reported failure", () => {
    expect(
      resolveMergedAttachSnapshot({
        enabled: true,
        hasMediaStrategy: false,
        hasBridgeStrategy: true,
        mediaAttachState: "failed",
        bridgeAttachState: "attached",
        mediaAttachReason: "attach_failed"
      })
    ).toEqual({ attachState: "attached", activeStrategy: "web_audio_bridge" });
  });

  it("surfaces autoplay before hard failure", () => {
    expect(
      resolveMergedAttachSnapshot({
        enabled: true,
        hasMediaStrategy: false,
        hasBridgeStrategy: false,
        mediaAttachState: "awaiting_user_gesture",
        bridgeAttachState: "failed"
      })
    ).toEqual({
      attachState: "awaiting_user_gesture",
      attachReason: "autoplay_blocked",
      activeStrategy: "none"
    });
  });
});

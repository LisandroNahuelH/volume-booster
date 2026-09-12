import type {
  AutoActiveStrategy,
  AutoAttachReason,
  AutoAttachState
} from "../../../shared/types";

export type MergedAttachSnapshot = {
  attachState: AutoAttachState;
  attachReason?: AutoAttachReason;
  activeStrategy: AutoActiveStrategy;
};

export function resolveMergedAttachSnapshot(input: {
  enabled: boolean;
  hasMediaStrategy: boolean;
  hasBridgeStrategy: boolean;
  mediaAttachState: AutoAttachState;
  bridgeAttachState: AutoAttachState;
  mediaAttachReason?: AutoAttachReason;
  bridgeAttachReason?: AutoAttachReason;
}): MergedAttachSnapshot {
  if (!input.enabled) {
    return { attachState: "idle", activeStrategy: "none" };
  }

  if (input.hasMediaStrategy || input.hasBridgeStrategy) {
    const activeStrategy: AutoActiveStrategy =
      input.hasMediaStrategy && input.hasBridgeStrategy
        ? "hybrid"
        : input.hasBridgeStrategy
          ? "web_audio_bridge"
          : "media_element";
    return { attachState: "attached", activeStrategy };
  }

  if (
    input.mediaAttachState === "awaiting_user_gesture" ||
    input.bridgeAttachState === "awaiting_user_gesture"
  ) {
    return {
      attachState: "awaiting_user_gesture",
      attachReason: "autoplay_blocked",
      activeStrategy: "none"
    };
  }

  if (input.mediaAttachState === "failed" || input.bridgeAttachState === "failed") {
    return {
      attachState: "failed",
      attachReason:
        input.mediaAttachReason ?? input.bridgeAttachReason ?? "attach_failed",
      activeStrategy: "none"
    };
  }

  return {
    attachState: "observing",
    attachReason: "no_media",
    activeStrategy: "none"
  };
}

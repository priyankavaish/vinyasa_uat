"use client";

import { useRef, useState } from "react";

/** Shared mute/unmute control for an embedded YouTube iframe (requires `enablejsapi=1` in its src). */
export function useYoutubeMuteToggle() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(JSON.stringify({ event: "command", func: muted ? "unMute" : "mute", args: [] }), "*");
    setMuted((v) => !v);
  };

  return { iframeRef, muted, toggleMute };
}

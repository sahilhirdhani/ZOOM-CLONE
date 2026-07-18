"use client";

import { Shield, Copy, Check } from "lucide-react";

interface MeetingHeaderProps {
  meetingTitle: string;
  meetingCode: string;
  elapsedTime: number;
  formatElapsed: (secs: number) => string;
  handleCopyLink: () => void;
  copied: boolean;
  handleEndMeeting: () => void;
  isHost: boolean;
}

export default function MeetingHeader({
  meetingTitle,
  meetingCode,
  elapsedTime,
  formatElapsed,
  handleCopyLink,
  copied,
  handleEndMeeting,
  isHost,
}: MeetingHeaderProps) {
  return (
    <div className="meeting-room-header">
      <div className="meeting-room-header-left">
        <div className="meeting-room-shield">
          <Shield />
          <span>Encrypted</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>|</span>
        <span className="meeting-room-title">{meetingTitle}</span>
      </div>
      <div className="meeting-room-header-right">
        <button
          onClick={handleCopyLink}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            padding: "4px 8px",
            borderRadius: 4,
          }}
          title="Copy meeting link"
        >
          {copied ? (
            <Check style={{ width: 13, height: 13 }} />
          ) : (
            <Copy style={{ width: 13, height: 13 }} />
          )}
          <span className="meeting-code-text">{meetingCode}</span>
        </button>
        <span className="meeting-room-timer">{formatElapsed(elapsedTime)}</span>
        <button
          className="mobile-end-btn"
          onClick={handleEndMeeting}
          style={{
            background: "#E02020",
            color: "white",
            border: "none",
            padding: "4px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            marginLeft: "12px",
          }}
        >
          {isHost ? "End" : "Leave"}
        </button>
      </div>
    </div>
  );
}

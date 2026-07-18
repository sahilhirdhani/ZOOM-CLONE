"use client";

import { MicOff } from "lucide-react";
import type { Participant } from "@/lib/types";

interface VideoGridProps {
  participants: Participant[];
  localParticipantId: number | null;
  mutedIds: number[];
  isMuted: boolean;
  getGridClass: (count: number) => string;
  getAvatarColor: (name: string) => string;
  getInitials: (name: string) => string;
}

export default function VideoGrid({
  participants,
  localParticipantId,
  mutedIds,
  isMuted,
  getGridClass,
  getAvatarColor,
  getInitials,
}: VideoGridProps) {
  return (
    <div className={`meeting-room-grid ${getGridClass(participants.length)}`}>
      {participants.map((p) => (
        <div
          key={p.id}
          className={`participant-tile ${p.id === localParticipantId ? "speaking" : ""}`}
          style={{ position: "relative" }}
        >
          {p.reaction && (
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "rgba(0,0,0,0.6)",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                zIndex: 10,
              }}
            >
              {p.reaction}
            </div>
          )}
          {p.raised_hand && (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "#F5A623",
                color: "white",
                borderRadius: "4px",
                padding: "2px 6px",
                fontSize: 11,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 4,
                zIndex: 10,
              }}
              title="Hand Raised"
            >
              🖐️ Raised
            </div>
          )}
          <div
            className="participant-tile-avatar"
            style={{ background: getAvatarColor(p.display_name) }}
          >
            {getInitials(p.display_name)}
          </div>
          <div className="participant-tile-name">
            {(mutedIds.includes(p.id) || (isMuted && p.id === localParticipantId)) && (
              <MicOff style={{ width: 11, height: 11, color: "#E02020" }} />
            )}
            {p.display_name}
            {p.role === "HOST" && (
              <span style={{ fontSize: 10, opacity: 0.6 }}>(Host)</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

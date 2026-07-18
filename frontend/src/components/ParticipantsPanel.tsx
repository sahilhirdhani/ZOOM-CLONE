"use client";

import { X, MicOff, UserMinus } from "lucide-react";
import type { Participant } from "@/lib/types";

interface ParticipantsPanelProps {
  participants: Participant[];
  isOpen: boolean;
  onClose: () => void;
  onRemove?: (participantId: number) => void;
  mutedIds: number[];
  onMuteToggle?: (participantId: number) => void;
  onMuteAll?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "#0B5CFF",
  "#7B2FF7",
  "#E02020",
  "#F5A623",
  "#00A825",
  "#FF6B35",
  "#E91E8C",
  "#0EA5E9",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function ParticipantsPanel({
  participants,
  isOpen,
  onClose,
  onRemove,
  mutedIds,
  onMuteToggle,
  onMuteAll,
}: ParticipantsPanelProps) {
  if (!isOpen) return null;

  const hosts = participants.filter((p) => p.role === "HOST");
  const attendees = participants.filter((p) => p.role !== "HOST");

  return (
    <div className="participants-panel">
      <div className="participants-panel-header">
        <h3>
          Participants
          <span className="count">({participants.length})</span>
        </h3>
        <button className="participants-panel-close" onClick={onClose}>
          <X style={{ width: 16, height: 16 }} />
        </button>
      </div>

      <div className="participants-panel-actions">
        <button
          className="btn btn-sm btn-secondary"
          onClick={onMuteAll}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
          }}
        >
          <MicOff style={{ width: 12, height: 12 }} />
          Mute All
        </button>
      </div>

      <div className="participants-panel-list">
        {/* Hosts */}
        {hosts.map((p) => (
          <div key={p.id} className="participant-item">
            <div className="participant-item-left">
              <div
                className="participant-item-avatar"
                style={{ background: getAvatarColor(p.display_name) }}
              >
                {getInitials(p.display_name)}
              </div>
              <div>
                <div className="participant-item-name">
                  {p.display_name}{" "}
                  <span style={{ fontSize: 11, opacity: 0.5 }}>(Host)</span>
                </div>
                {p.email && (
                  <div className="participant-item-role">{p.email}</div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Attendees */}
        {attendees.map((p) => (
          <div key={p.id} className="participant-item">
            <div className="participant-item-left">
              <div
                className="participant-item-avatar"
                style={{ background: getAvatarColor(p.display_name) }}
              >
                {getInitials(p.display_name)}
              </div>
              <div>
                <div className="participant-item-name">{p.display_name}</div>
                {p.email && (
                  <div className="participant-item-role">{p.email}</div>
                )}
              </div>
            </div>
            <div className="participant-item-actions">
              <button
                className={`participant-action-btn ${mutedIds.includes(p.id) ? "muted" : ""}`}
                title={mutedIds.includes(p.id) ? "Unmute" : "Mute"}
                onClick={() => onMuteToggle?.(p.id)}
                style={mutedIds.includes(p.id) ? { color: "#E02020", background: "rgba(224, 32, 32, 0.1)" } : {}}
              >
                <MicOff style={{ width: 14, height: 14 }} />
              </button>
              {onRemove && (
                <button
                  className="participant-action-btn danger"
                  title="Remove"
                  onClick={() => onRemove(p.id)}
                >
                  <UserMinus style={{ width: 14, height: 14 }} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

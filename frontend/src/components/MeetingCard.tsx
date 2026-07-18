"use client";

import { Clock, Copy, Play, ExternalLink } from "lucide-react";
import type { Meeting } from "@/lib/types";
import "./MeetingCard.css";

interface MeetingCardProps {
  meeting: Meeting;
  onStart?: (meeting: Meeting) => void;
  onCopyLink?: (meeting: Meeting) => void;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function MeetingCard({
  meeting,
  onStart,
  onCopyLink,
}: MeetingCardProps) {
  const statusClass = meeting.status.toLowerCase();

  return (
    <div className="meeting-card">
      <div className="meeting-card-left">
        {/* Time Block */}
        {meeting.scheduled_at && (
          <>
            <div className="meeting-card-time-block">
              <div className="meeting-card-time">
                {formatTime(meeting.scheduled_at)}
              </div>
              <div className="meeting-card-date">
                {formatDate(meeting.scheduled_at)}
              </div>
            </div>
            <div className="meeting-card-divider" />
          </>
        )}

        {/* Info */}
        <div className="meeting-card-info">
          <div className="meeting-card-title">{meeting.title}</div>
          {meeting.description && (
            <div className="meeting-card-desc">{meeting.description}</div>
          )}
          <div className="meeting-card-meta">
            <span className={`meeting-card-badge ${statusClass}`}>
              {meeting.status === "SCHEDULED"
                ? "Upcoming"
                : meeting.status === "ACTIVE"
                ? "In Progress"
                : meeting.status === "MISSED"
                ? "Missed"
                : "Completed"}
            </span>
            <span className="meeting-card-code">{meeting.meeting_code}</span>
            {meeting.duration && (
              <span className="meeting-card-duration">
                <Clock style={{ width: 11, height: 11 }} />
                {meeting.duration} min
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="meeting-card-right">
        <div className="meeting-card-actions">
          {meeting.status === "SCHEDULED" && onStart && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onStart(meeting)}
            >
              <Play style={{ width: 12, height: 12 }} />
              Start
            </button>
          )}
          {meeting.status === "ACTIVE" && onStart && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onStart(meeting)}
            >
              <ExternalLink style={{ width: 12, height: 12 }} />
              Join
            </button>
          )}
          {onCopyLink && (
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => onCopyLink(meeting)}
              title="Copy invite link"
            >
              <Copy style={{ width: 12, height: 12 }} />
              Copy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

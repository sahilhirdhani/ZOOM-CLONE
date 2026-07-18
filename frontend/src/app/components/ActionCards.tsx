"use client";

import { Video, Plus, Calendar } from "lucide-react";

interface ActionCardsProps {
  onNewMeeting: () => void;
  onJoin: () => void;
  onSchedule: () => void;
}

export default function ActionCards({
  onNewMeeting,
  onJoin,
  onSchedule,
}: ActionCardsProps) {
  return (
    <div className="action-cards">
      <button
        className="action-card new-meeting"
        onClick={onNewMeeting}
        id="btn-new-meeting"
      >
        <div className="action-card-icon">
          <Video />
        </div>
        <span className="action-card-label">New Meeting</span>
      </button>

      <button
        className="action-card join"
        onClick={onJoin}
        id="btn-join-meeting"
      >
        <div className="action-card-icon">
          <Plus />
        </div>
        <span className="action-card-label">Join</span>
      </button>

      <button
        className="action-card schedule"
        onClick={onSchedule}
        id="btn-schedule-meeting"
      >
        <div className="action-card-icon">
          <Calendar />
        </div>
        <span className="action-card-label">Schedule</span>
      </button>
    </div>
  );
}

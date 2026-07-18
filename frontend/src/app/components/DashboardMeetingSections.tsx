"use client";

import { Calendar, CalendarDays, LogIn, AlertCircle, Video } from "lucide-react";
import MeetingCard from "@/components/MeetingCard";
import type { DashboardData, Meeting } from "@/lib/types";

interface DashboardMeetingSectionsProps {
  data: DashboardData | null;
  handleStartMeeting: (meeting: Meeting) => void;
  handleCopyLink: (meeting: Meeting) => void;
}

export default function DashboardMeetingSections({
  data,
  handleStartMeeting,
  handleCopyLink,
}: DashboardMeetingSectionsProps) {
  return (
    <>
      {/* Upcoming Meetings */}
      <section className="meetings-section">
        <div className="meetings-section-header">
          <h2>
            <CalendarDays
              style={{
                width: 18,
                height: 18,
                display: "inline",
                verticalAlign: "text-bottom",
                marginRight: 8,
                color: "var(--zoom-blue)",
              }}
            />
            Upcoming Meetings
          </h2>
          <span className="count">
            {data?.upcoming_meetings.length || 0} meetings
          </span>
        </div>

        {data?.upcoming_meetings.length ? (
          data.upcoming_meetings.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              onStart={handleStartMeeting}
              onCopyLink={handleCopyLink}
            />
          ))
        ) : (
          <div className="empty-state">
            <Calendar />
            <p>No upcoming meetings</p>
          </div>
        )}
      </section>

      {/* Recent Meetings */}
      <section className="meetings-section">
        <div className="meetings-section-header">
          <h2>
            <LogIn
              style={{
                width: 18,
                height: 18,
                display: "inline",
                verticalAlign: "text-bottom",
                marginRight: 8,
                color: "var(--zoom-text-tertiary)",
              }}
            />
            Recent Meetings
          </h2>
          <span className="count">
            {data?.recent_meetings.length || 0} meetings
          </span>
        </div>

        {data?.recent_meetings.length ? (
          data.recent_meetings.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              onCopyLink={handleCopyLink}
            />
          ))
        ) : (
          <div className="empty-state">
            <Video />
            <p>No recent meetings</p>
          </div>
        )}
      </section>

      {/* Missed Meetings */}
      <section className="meetings-section">
        <div className="meetings-section-header">
          <h2>
            <AlertCircle
              style={{
                width: 18,
                height: 18,
                display: "inline",
                verticalAlign: "text-bottom",
                marginRight: 8,
                color: "var(--zoom-red)",
              }}
            />
            Missed Meetings
          </h2>
          <span className="count">
            {data?.missed_meetings?.length || 0} meetings
          </span>
        </div>

        {data?.missed_meetings?.length ? (
          data.missed_meetings.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              onCopyLink={handleCopyLink}
            />
          ))
        ) : (
          <div className="empty-state">
            <Calendar style={{ color: "var(--zoom-red)", opacity: 0.3 }} />
            <p>No missed meetings</p>
          </div>
        )}
      </section>
    </>
  );
}

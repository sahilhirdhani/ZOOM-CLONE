"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Video,
  Plus,
  Calendar as CalendarIcon,
  LogIn,
  CalendarDays,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import "./page.css";
import TopBar from "@/components/TopBar";
import MeetingCard from "@/components/MeetingCard";
import NewMeetingModal from "@/components/NewMeetingModal";
import ScheduleModal from "@/components/ScheduleModal";
import JoinModal from "@/components/JoinModal";
import { getDashboard } from "@/lib/api";
import type { DashboardData, Meeting } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const result = await getDashboard();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (data?.user) {
      localStorage.setItem("zoom_user", JSON.stringify(data.user));
    }
  }, [data]);

  const handleStartMeeting = (meeting: Meeting) => {
    router.push(`/meeting/${meeting.meeting_code}`);
  };

  const handleCopyLink = (meeting: Meeting) => {
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || window.location.origin;
    const link = `${frontendUrl}/join?code=${meeting.meeting_code}`;
    navigator.clipboard.writeText(link);
  };

  const formatCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <>
        <Sidebar />
        <TopBar />
        <main className="main-content">
          <div className="loading-spinner" />
        </main>
      </>
    );
  }

  return (
    <>
      <Sidebar avatar={data?.user.avatar} />
      <TopBar title="Home" />

      <main className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1>
            {formatCurrentTime()} — Welcome, {data?.user.name?.split(" ")[0]}
          </h1>
          <p className="subtitle">{formatCurrentDate()}</p>
        </div>

        {/* Action Cards */}
        <div className="action-cards">
          <button
            className="action-card new-meeting"
            onClick={() => setShowNewMeeting(true)}
            id="btn-new-meeting"
          >
            <div className="action-card-icon">
              <Video />
            </div>
            <span className="action-card-label">New Meeting</span>
          </button>

          <button
            className="action-card join"
            onClick={() => setShowJoin(true)}
            id="btn-join-meeting"
          >
            <div className="action-card-icon">
              <Plus />
            </div>
            <span className="action-card-label">Join</span>
          </button>

          <button
            className="action-card schedule"
            onClick={() => setShowSchedule(true)}
            id="btn-schedule-meeting"
          >
            <div className="action-card-icon">
              <CalendarIcon />
            </div>
            <span className="action-card-label">Schedule</span>
          </button>
        </div>

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
              <CalendarIcon />
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
      </main>

      {/* Modals */}
      <NewMeetingModal
        isOpen={showNewMeeting}
        onClose={() => setShowNewMeeting(false)}
      />
      <ScheduleModal
        isOpen={showSchedule}
        onClose={() => setShowSchedule(false)}
        onScheduled={fetchDashboard}
      />
      <JoinModal isOpen={showJoin} onClose={() => setShowJoin(false)} />
    </>
  );
}

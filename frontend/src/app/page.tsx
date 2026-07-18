"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import "./page.css";
import TopBar from "@/components/TopBar";
import NewMeetingModal from "@/components/NewMeetingModal";
import ScheduleModal from "@/components/ScheduleModal";
import JoinModal from "@/components/JoinModal";
import { getDashboard } from "@/lib/api";
import type { DashboardData, Meeting } from "@/lib/types";

// Extracted Sub-components
import ActionCards from "./components/ActionCards";
import DashboardMeetingSections from "./components/DashboardMeetingSections";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [localUser, setLocalUser] = useState<any>(null);

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
    const stored = localStorage.getItem("zoom_user");
    if (stored) {
      setLocalUser(JSON.parse(stored));
    } else if (data?.user) {
      localStorage.setItem("zoom_user", JSON.stringify(data.user));
      setLocalUser(data.user);
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
      <Sidebar avatar={localUser?.avatar || data?.user.avatar} />
      <TopBar title="Home" />

      <main className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1>
            {formatCurrentTime()} — Welcome, {localUser?.name?.split(" ")[0] || data?.user.name?.split(" ")[0]}
          </h1>
          <p className="subtitle">{formatCurrentDate()}</p>
        </div>

        {/* Action Cards */}
        <ActionCards
          onNewMeeting={() => setShowNewMeeting(true)}
          onJoin={() => setShowJoin(true)}
          onSchedule={() => setShowSchedule(true)}
        />

        {/* Meeting Sections */}
        <DashboardMeetingSections
          data={data}
          handleStartMeeting={handleStartMeeting}
          handleCopyLink={handleCopyLink}
        />
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

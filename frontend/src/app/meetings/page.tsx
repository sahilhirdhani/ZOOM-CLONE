"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Video,
  Calendar,
  Clock,
  Copy,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MeetingCard from "@/components/MeetingCard";
import NewMeetingModal from "@/components/NewMeetingModal";
import ScheduleModal from "@/components/ScheduleModal";
import { getDashboard } from "@/lib/api";
import type { DashboardData, Meeting } from "@/lib/types";
import "./meetings.css";

type TabFilter = "upcoming" | "past" | "all";

export default function MeetingsPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const result = await getDashboard();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch meetings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStartMeeting = (meeting: Meeting) => {
    router.push(`/meeting/${meeting.meeting_code}`);
  };

  const handleCopyLink = (meeting: Meeting) => {
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || window.location.origin;
    const link = `${frontendUrl}/join?code=${meeting.meeting_code}`;
    navigator.clipboard.writeText(link);
  };

  const getMeetings = (): Meeting[] => {
    if (!data) return [];
    switch (activeTab) {
      case "upcoming":
        return data.upcoming_meetings;
      case "past":
        return data.recent_meetings;
      case "all":
        return [...data.upcoming_meetings, ...data.recent_meetings];
    }
  };

  const filteredMeetings = getMeetings().filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs: { key: TabFilter; label: string; icon: React.ReactNode }[] = [
    { key: "upcoming", label: "Upcoming", icon: <Calendar style={{ width: 14, height: 14 }} /> },
    { key: "past", label: "Past", icon: <Clock style={{ width: 14, height: 14 }} /> },
    { key: "all", label: "All Meetings", icon: <Video style={{ width: 14, height: 14 }} /> },
  ];

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar title="Meetings" sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <main className="main-content">
        {/* Header */}
        <div className="meetings-page-header">
          <div className="meetings-page-header-left">
            <h1>Meetings</h1>
            <p className="subtitle">Manage your scheduled and past meetings</p>
          </div>
          <div className="meetings-page-header-right">
            <button
              className="btn btn-md btn-secondary"
              onClick={() => setShowSchedule(true)}
              id="meetings-schedule-btn"
            >
              <Calendar style={{ width: 14, height: 14 }} />
              Schedule
            </button>
            <button
              className="btn btn-md btn-primary"
              onClick={() => setShowNewMeeting(true)}
              id="meetings-new-btn"
            >
              <Plus style={{ width: 14, height: 14 }} />
              New Meeting
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="meetings-page-filters">
          <div className="meetings-page-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`meetings-page-tab ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
                id={`meetings-tab-${tab.key}`}
              >
                {tab.icon}
                {tab.label}
                <span className="meetings-page-tab-count">
                  {tab.key === "upcoming" && data?.upcoming_meetings.length}
                  {tab.key === "past" && data?.recent_meetings.length}
                  {tab.key === "all" &&
                    (data ? data.upcoming_meetings.length + data.recent_meetings.length : 0)}
                </span>
              </button>
            ))}
          </div>
          <div className="meetings-page-search">
            <Search style={{ width: 14, height: 14 }} />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="meetings-search-input"
            />
          </div>
        </div>

        {/* Meeting Cards */}
        <div className="meetings-page-list">
          {loading ? (
            <div className="loading-spinner" />
          ) : filteredMeetings.length > 0 ? (
            filteredMeetings.map((m) => (
              <MeetingCard
                key={m.id}
                meeting={m}
                onStart={activeTab !== "past" ? handleStartMeeting : undefined}
                onCopyLink={handleCopyLink}
              />
            ))
          ) : (
            <div className="empty-state">
              <Video />
              <p>
                {searchQuery
                  ? "No meetings match your search"
                  : activeTab === "upcoming"
                    ? "No upcoming meetings scheduled"
                    : activeTab === "past"
                      ? "No past meetings found"
                      : "No meetings found"}
              </p>
            </div>
          )}
        </div>
      </main>

      <NewMeetingModal
        isOpen={showNewMeeting}
        onClose={() => setShowNewMeeting(false)}
      />
      <ScheduleModal
        isOpen={showSchedule}
        onClose={() => setShowSchedule(false)}
        onScheduled={fetchData}
      />
    </>
  );
}

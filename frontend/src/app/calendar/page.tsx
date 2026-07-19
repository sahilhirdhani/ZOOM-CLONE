"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  Users,
} from "lucide-react";
import { getDashboard } from "@/lib/api";
import type { Meeting } from "@/lib/types";
import "./calendar.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchMeetings = useCallback(async () => {
    try {
      const data = await getDashboard();
      setMeetings([...data.upcoming_meetings, ...data.recent_meetings]);
    } catch (err) {
      console.error("Failed to fetch meetings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(today.getDate());
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const getMeetingsForDate = (day: number): Meeting[] => {
    return meetings.filter((m) => {
      if (!m.scheduled_at) return false;
      const d = new Date(m.scheduled_at);
      return (
        d.getFullYear() === currentYear &&
        d.getMonth() === currentMonth &&
        d.getDate() === day
      );
    });
  };

  const selectedMeetings = selectedDate ? getMeetingsForDate(selectedDate) : [];

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  // Build calendar grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const formatMeetingTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar title="Calendar" sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <main className="main-content">
        <div className="calendar-layout">
          {/* Calendar Grid */}
          <div className="calendar-main">
            {/* Calendar Header */}
            <div className="calendar-header">
              <div className="calendar-header-left">
                <h1>{MONTHS[currentMonth]} {currentYear}</h1>
                <button className="btn btn-sm btn-secondary" onClick={goToToday} id="calendar-today-btn">
                  Today
                </button>
              </div>
              <div className="calendar-header-right">
                <button className="calendar-nav-btn" onClick={goToPrevMonth} id="calendar-prev-btn">
                  <ChevronLeft style={{ width: 18, height: 18 }} />
                </button>
                <button className="calendar-nav-btn" onClick={goToNextMonth} id="calendar-next-btn">
                  <ChevronRight style={{ width: 18, height: 18 }} />
                </button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="calendar-grid">
              <div className="calendar-day-headers">
                {DAYS.map((day) => (
                  <div key={day} className="calendar-day-header">{day}</div>
                ))}
              </div>

              {/* Day Cells */}
              <div className="calendar-days">
                {cells.map((day, idx) => {
                  const dayMeetings = day ? getMeetingsForDate(day) : [];
                  return (
                    <button
                      key={idx}
                      className={`calendar-day ${!day ? "empty" : ""} ${isToday(day || 0) ? "today" : ""} ${selectedDate === day && day ? "selected" : ""}`}
                      onClick={() => day && setSelectedDate(day)}
                      disabled={!day}
                      id={day ? `calendar-day-${day}` : undefined}
                    >
                      {day && (
                        <>
                          <span className="calendar-day-number">{day}</span>
                          {dayMeetings.length > 0 && (
                            <div className="calendar-day-dots">
                              {dayMeetings.slice(0, 3).map((_, i) => (
                                <div key={i} className="calendar-dot" />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Side Panel: Selected Day Detail */}
          <div className="calendar-detail">
            <div className="calendar-detail-header">
              <h2>
                {selectedDate
                  ? `${MONTHS[currentMonth]} ${selectedDate}, ${currentYear}`
                  : "Select a date"}
              </h2>
              {selectedDate && (
                <span className="calendar-detail-count">
                  {selectedMeetings.length} meeting{selectedMeetings.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {loading ? (
              <div className="loading-spinner" />
            ) : selectedMeetings.length > 0 ? (
              <div className="calendar-detail-list">
                {selectedMeetings.map((m) => (
                  <div key={m.id} className="calendar-meeting-item">
                    <div className="calendar-meeting-time">
                      <Clock style={{ width: 14, height: 14 }} />
                      {m.scheduled_at ? formatMeetingTime(m.scheduled_at) : "—"}
                    </div>
                    <div className="calendar-meeting-info">
                      <h4>{m.title}</h4>
                      {m.description && (
                        <p className="calendar-meeting-desc">{m.description}</p>
                      )}
                      <div className="calendar-meeting-meta">
                        <span className={`meeting-card-badge ${m.status.toLowerCase()}`}>
                          {m.status}
                        </span>
                        {m.duration && (
                          <span className="calendar-meeting-duration">
                            <Clock style={{ width: 11, height: 11 }} />
                            {m.duration} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedDate ? (
              <div className="calendar-detail-empty">
                <Video style={{ width: 32, height: 32, opacity: 0.3 }} />
                <p>No meetings on this day</p>
              </div>
            ) : (
              <div className="calendar-detail-empty">
                <Users style={{ width: 32, height: 32, opacity: 0.3 }} />
                <p>Click a date to see meetings</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

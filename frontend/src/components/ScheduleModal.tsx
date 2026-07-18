"use client";

import { useState } from "react";
import { X, CalendarPlus, Check, Copy } from "lucide-react";
import { scheduleMeeting } from "@/lib/api";
import "./ScheduleModal.css";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduled?: () => void;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  onScheduled,
}: ScheduleModalProps) {
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getCurrentDate);
  const [time, setTime] = useState(getCurrentTime);
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    meeting_code: string;
    meeting_link: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!title || !date || !time) return;
    setLoading(true);
    try {
      const scheduled_at = new Date(`${date}T${time}`).toISOString();
      const res = await scheduleMeeting({
        title,
        description: description || undefined,
        scheduled_at,
        duration,
      });
      setResult({
        meeting_code: res.meeting_code,
        meeting_link: res.meeting_link,
      });
      onScheduled?.();
    } catch {
      console.error("Failed to schedule meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (result) {
      navigator.clipboard.writeText(result.meeting_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setDate(getCurrentDate());
    setTime(getCurrentTime());
    setDuration(60);
    setResult(null);
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{result ? "Meeting Scheduled" : "Schedule Meeting"}</h2>
          <button className="modal-close" onClick={handleClose}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div className="modal-body">
          {!result ? (
            <>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Team Weekly Sync"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Add a description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker();
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time *</label>
                  <input
                    type="time"
                    className="form-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker();
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Duration</label>
                <select
                  className="form-select"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 50,
                  background: "var(--zoom-green-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <Check
                  style={{
                    width: 24,
                    height: 24,
                    color: "var(--zoom-green)",
                  }}
                />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                Meeting Scheduled!
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--zoom-text-secondary)",
                  marginBottom: 16,
                }}
              >
                Meeting ID: {result.meeting_code}
              </p>

              <div className="copy-link-box">
                <span className="copy-link-text">{result.meeting_link}</span>
                <button
                  className="copy-link-btn"
                  onClick={handleCopyLink}
                  title="Copy link"
                >
                  {copied ? (
                    <Check style={{ width: 14, height: 14 }} />
                  ) : (
                    <Copy style={{ width: 14, height: 14 }} />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-md btn-secondary" onClick={handleClose}>
            {result ? "Close" : "Cancel"}
          </button>
          {!result && (
            <button
              className="btn btn-md btn-primary"
              onClick={handleSubmit}
              disabled={loading || !title || !date || !time}
            >
              <CalendarPlus style={{ width: 14, height: 14 }} />
              {loading ? "Scheduling..." : "Schedule"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

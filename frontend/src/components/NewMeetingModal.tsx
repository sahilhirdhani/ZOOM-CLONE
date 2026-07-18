"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Copy, Check, Video } from "lucide-react";
import { createInstantMeeting } from "@/lib/api";

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewMeetingModal({
  isOpen,
  onClose,
}: NewMeetingModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState<{
    meeting_code: string;
    meeting_link: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateMeeting = async () => {
    setLoading(true);
    try {
      const result = await createInstantMeeting();
      setMeetingData({
        meeting_code: result.meeting_code,
        meeting_link: result.meeting_link,
      });
    } catch {
      console.error("Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (meetingData) {
      navigator.clipboard.writeText(meetingData.meeting_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStartMeeting = () => {
    if (meetingData) {
      router.push(`/meeting/${meetingData.meeting_code}`);
    }
  };

  const handleClose = () => {
    setMeetingData(null);
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Meeting</h2>
          <button className="modal-close" onClick={handleClose}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div className="modal-body">
          {!meetingData ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: "var(--zoom-blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Video style={{ width: 28, height: 28, color: "white" }} />
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                Start a New Meeting
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--zoom-text-secondary)",
                  marginBottom: 24,
                }}
              >
                Create an instant meeting and invite others to join.
              </p>
              <button
                className="btn btn-lg btn-primary"
                onClick={handleCreateMeeting}
                disabled={loading}
                style={{ width: "100%" }}
              >
                {loading ? "Creating..." : "Create Meeting"}
              </button>
            </div>
          ) : (
            <div style={{ padding: "12px 0" }}>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
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
                  Meeting Created!
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--zoom-text-secondary)",
                  }}
                >
                  Meeting ID: {meetingData.meeting_code}
                </p>
              </div>

              <div className="copy-link-box">
                <span className="copy-link-text">
                  {meetingData.meeting_link}
                </span>
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

        {meetingData && (
          <div className="modal-footer">
            <button className="btn btn-md btn-secondary" onClick={handleClose}>
              Close
            </button>
            <button
              className="btn btn-md btn-primary"
              onClick={handleStartMeeting}
            >
              <Video style={{ width: 14, height: 14 }} />
              Start Meeting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

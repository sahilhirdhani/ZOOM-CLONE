"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, LogIn } from "lucide-react";
import { joinMeeting } from "@/lib/api";
import { extractAndValidateMeetingCode } from "@/lib/utils";
import "./JoinModal.css";

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinModal({ isOpen, onClose }: JoinModalProps) {
  const router = useRouter();
  const [meetingCode, setMeetingCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    const validatedCode = extractAndValidateMeetingCode(meetingCode);
    if (!validatedCode) {
      setError("Invalid Meeting ID or Invite Link format.");
      return;
    }
    if (!displayName.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await joinMeeting({
        meeting_code: validatedCode,
        display_name: displayName.trim(),
      });
      sessionStorage.setItem(`meeting_participant_${validatedCode}`, res.participant_id.toString());
      router.push(`/meeting/${validatedCode}`);
    } catch {
      setError("Meeting not found. Please check the Meeting ID or Invite Link and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMeetingCode("");
    setDisplayName("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Join Meeting</h2>
          <button className="modal-close" onClick={handleClose}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Meeting ID or Invite Link *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter Meeting ID or Invite Link"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            />
          </div>

          {error && <div className="join-error">{error}</div>}
        </div>

        <div className="modal-footer">
          <button className="btn btn-md btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="btn btn-md btn-primary"
            onClick={handleJoin}
            disabled={loading || !meetingCode.trim() || !displayName.trim()}
          >
            <LogIn style={{ width: 14, height: 14 }} />
            {loading ? "Joining..." : "Join"}
          </button>
        </div>
      </div>
    </div>
  );
}

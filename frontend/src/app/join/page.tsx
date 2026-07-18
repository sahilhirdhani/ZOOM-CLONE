"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Video, LogIn } from "lucide-react";
import { joinMeeting } from "@/lib/api";
import { extractAndValidateMeetingCode } from "@/lib/utils";
import "./join.css";

export default function JoinPage() {
  const router = useRouter();
  const [meetingCode, setMeetingCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setError(
        "Meeting not found. Please check the Meeting ID or Invite Link and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-page">
      <div className="join-container">
        <div className="join-logo">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#0B5CFF" />
            <path
              d="M7 10.5C7 9.67 7.67 9 8.5 9H15.5C16.33 9 17 9.67 17 10.5V17.5C17 18.33 16.33 19 15.5 19H8.5C7.67 19 7 18.33 7 17.5V10.5Z"
              fill="white"
            />
            <path d="M18 12L21 9.5V18.5L18 16V12Z" fill="white" />
          </svg>
          <span>Zoom</span>
        </div>

        <h1>Join Meeting</h1>
        <p>Enter the meeting ID or invite link and your name to join</p>

        <form className="join-form" onSubmit={handleJoin}>
          <div className="form-group">
            <label className="form-label">Meeting ID or Invite Link</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter Meeting ID or Invite Link"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          {error && <div className="join-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-lg btn-primary"
            disabled={loading || !meetingCode.trim() || !displayName.trim()}
          >
            <LogIn style={{ width: 16, height: 16 }} />
            {loading ? "Joining..." : "Join Meeting"}
          </button>
        </form>

        <div className="join-back">
          <Link href="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

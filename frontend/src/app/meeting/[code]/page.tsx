"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import ParticipantsPanel from "@/components/ParticipantsPanel";
import ChatPanel from "@/components/ChatPanel";
import {
  getMeetingDetail,
  endMeeting,
  removeParticipant,
  muteParticipant,
  muteAllParticipants,
  raiseHand,
  sendReaction,
  sendMessage,
  getMessages,
} from "@/lib/api";
import type { Meeting, Participant, Message } from "@/lib/types";
import "./meeting.css";

// Extracted Sub-components
import MeetingHeader from "./components/MeetingHeader";
import VideoGrid from "./components/VideoGrid";
import MeetingToolbar from "./components/MeetingToolbar";

const avatarColors = [
  "#0B5CFF",
  "#7B2FF7",
  "#E02020",
  "#F5A623",
  "#00A825",
  "#FF6B35",
  "#E91E8C",
  "#0EA5E9",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getGridClass(count: number): string {
  if (count === 1) return "grid-1";
  if (count === 2) return "grid-2";
  if (count <= 4) return "grid-4";
  return "grid-many";
}

export default function MeetingRoomPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [localParticipantId, setLocalParticipantId] = useState<number | null>(null);

  useEffect(() => {
    const storedId = sessionStorage.getItem(`meeting_participant_${code}`);
    if (storedId) {
      setLocalParticipantId(parseInt(storedId, 10));
    } else {
      const storedUser = localStorage.getItem("zoom_user");
      if (storedUser && participants.length > 0) {
        const user = JSON.parse(storedUser);
        const hostPart = participants.find((p) => p.role === "HOST");
        if (hostPart && (hostPart.email === user.email || hostPart.display_name === user.name)) {
          setLocalParticipantId(hostPart.id);
          sessionStorage.setItem(`meeting_participant_${code}`, hostPart.id.toString());
        }
      }
    }
  }, [code, participants]);

  const localParticipant = participants.find((p) => p.id === localParticipantId);
  const isHost = localParticipant?.role === "HOST";

  // Toolbar state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showReactionsMenu, setShowReactionsMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Muted participants tracking
  const [mutedIds, setMutedIds] = useState<number[]>([]);

  const handleMuteToggle = async (id: number) => {
    const isTargetMuted = mutedIds.includes(id);
    const nextMuted = !isTargetMuted;
    try {
      await muteParticipant(id, nextMuted, localParticipantId || undefined);
      setMutedIds((prev) =>
        nextMuted ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((mid) => mid !== id)
      );
      if (id === localParticipantId) {
        setIsMuted(nextMuted);
      }
    } catch (err) {
      console.error("Failed to toggle participant mute status:", err);
    }
  };

  const handleMuteAll = async () => {
    try {
      await muteAllParticipants(code, localParticipantId || undefined);
      const allIds = participants.map((p) => p.id);
      setMutedIds(allIds);
    } catch (err) {
      console.error("Failed to mute all participants:", err);
    }
  };

  const toggleLocalMute = async () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (localParticipantId) {
      try {
        await muteParticipant(localParticipantId, nextMuted, localParticipantId);
        setMutedIds((prev) =>
          nextMuted
            ? prev.includes(localParticipantId) ? prev : [...prev, localParticipantId]
            : prev.filter((id) => id !== localParticipantId)
        );
      } catch (err) {
        console.error("Failed to toggle local mute on backend:", err);
      }
    }
  };

  // Timer
  const [elapsed, setElapsed] = useState(0);

  const fetchMeeting = useCallback(async () => {
    try {
      const data = await getMeetingDetail(code);
      setMeeting(data.meeting);
      setParticipants(data.participants);
      setMeetingLink(data.meeting_link);
      try {
        const msgs = await getMessages(code);
        setMessages(msgs);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    } catch {
      setError("Meeting not found");
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchMeeting();
    const interval = setInterval(fetchMeeting, 2000);
    return () => clearInterval(interval);
  }, [fetchMeeting]);

  useEffect(() => {
    const dbMutedIds = participants.filter((p) => p.is_muted).map((p) => p.id);
    setMutedIds(dbMutedIds);
    if (localParticipantId) {
      const localPart = participants.find((p) => p.id === localParticipantId);
      if (localPart) {
        setIsMuted(localPart.is_muted);
        setIsHandRaised(localPart.raised_hand);
      }
    }
  }, [participants, localParticipantId]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatElapsed = (secs: number): string => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleEndMeeting = async () => {
    try {
      if (isHost) {
        await endMeeting(code);
      } else if (localParticipantId) {
        await removeParticipant(localParticipantId, localParticipantId);
      }
      router.push("/");
    } catch {
      console.error("Failed to leave or end meeting");
    }
  };

  const handleRemoveParticipant = async (participantId: number) => {
    try {
      await removeParticipant(participantId, localParticipantId || undefined);
      setParticipants((prev) => prev.filter((p) => p.id !== participantId));
    } catch {
      console.error("Failed to remove participant");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleHand = async () => {
    if (!localParticipantId) return;
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);
    try {
      await raiseHand(localParticipantId, nextState);
    } catch (err) {
      console.error("Failed to toggle hand raise:", err);
    }
  };

  const handleSendReaction = async (emoji: string) => {
    if (!localParticipantId) return;
    try {
      await sendReaction(localParticipantId, emoji);
      setShowReactionsMenu(false);
      setTimeout(async () => {
        try {
          await sendReaction(localParticipantId, null);
        } catch {}
      }, 3000);
    } catch (err) {
      console.error("Failed to send reaction:", err);
    }
  };

  const handleSendChatMessage = async (content: string) => {
    if (!localParticipant) return;
    try {
      const newMsg = await sendMessage(code, localParticipant.display_name, content);
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error("Failed to send chat message:", err);
    }
  };

  if (loading) {
    return (
      <div
        className="meeting-room"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div
        className="meeting-room"
        style={{
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Meeting Not Found</h2>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              marginBottom: 20,
              fontSize: 14,
            }}
          >
            The meeting you&apos;re looking for doesn&apos;t exist or has ended.
          </p>
          <button
            className="btn btn-md btn-primary"
            onClick={() => router.push("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="meeting-room">
      {/* Header */}
      <MeetingHeader
        meetingTitle={meeting.title}
        meetingCode={meeting.meeting_code}
        elapsedTime={elapsed}
        formatElapsed={formatElapsed}
        handleCopyLink={handleCopyLink}
        copied={copied}
        handleEndMeeting={handleEndMeeting}
        isHost={isHost}
      />

      {/* Content */}
      <div className="meeting-room-content">
        {/* Video Grid */}
        <VideoGrid
          participants={participants}
          localParticipantId={localParticipantId}
          mutedIds={mutedIds}
          isMuted={isMuted}
          getGridClass={getGridClass}
          getAvatarColor={getAvatarColor}
          getInitials={getInitials}
        />

        {/* Participants Panel */}
        <ParticipantsPanel
          participants={participants}
          isOpen={showParticipants}
          onClose={() => setShowParticipants(false)}
          onRemove={isHost ? handleRemoveParticipant : undefined}
          mutedIds={mutedIds}
          onMuteToggle={isHost ? handleMuteToggle : undefined}
          onMuteAll={isHost ? handleMuteAll : undefined}
        />

        {/* Chat Panel */}
        <ChatPanel
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          messages={messages}
          onSendMessage={handleSendChatMessage}
        />
      </div>

      {/* Toolbar */}
      <MeetingToolbar
        isMuted={isMuted}
        toggleLocalMute={toggleLocalMute}
        isVideoOff={isVideoOff}
        setIsVideoOff={setIsVideoOff}
        showParticipants={showParticipants}
        setShowParticipants={setShowParticipants}
        showChat={showChat}
        setShowChat={setShowChat}
        isHandRaised={isHandRaised}
        handleToggleHand={handleToggleHand}
        showReactionsMenu={showReactionsMenu}
        setShowReactionsMenu={setShowReactionsMenu}
        handleSendReaction={handleSendReaction}
        showMoreMenu={showMoreMenu}
        setShowMoreMenu={setShowMoreMenu}
        handleCopyLink={handleCopyLink}
        handleEndMeeting={handleEndMeeting}
        isHost={isHost}
      />
    </div>
  );
}

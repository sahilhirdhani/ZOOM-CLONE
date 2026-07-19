"use client";

import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  Users,
  MessageSquare,
  Hand,
  Smile,
  MoreHorizontal,
  Copy,
  PhoneOff,
} from "lucide-react";
import { useLocalParticipant } from "@livekit/components-react";

interface MeetingToolbarProps {
  isMuted: boolean;
  toggleLocalMute: () => void;
  isVideoOff: boolean;
  setIsVideoOff: (off: boolean) => void;
  showParticipants: boolean;
  setShowParticipants: (show: boolean) => void;
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  isHandRaised: boolean;
  handleToggleHand: () => void;
  showReactionsMenu: boolean;
  setShowReactionsMenu: (show: boolean) => void;
  handleSendReaction: (emoji: string) => void;
  showMoreMenu: boolean;
  setShowMoreMenu: (show: boolean) => void;
  handleCopyLink: () => void;
  handleEndMeeting: () => void;
  isHost: boolean;
}

export default function MeetingToolbar({
  isMuted,
  toggleLocalMute,
  isVideoOff,
  setIsVideoOff,
  showParticipants,
  setShowParticipants,
  showChat,
  setShowChat,
  isHandRaised,
  handleToggleHand,
  showReactionsMenu,
  setShowReactionsMenu,
  handleSendReaction,
  showMoreMenu,
  setShowMoreMenu,
  handleCopyLink,
  handleEndMeeting,
  isHost,
}: MeetingToolbarProps) {
  const { localParticipant } = useLocalParticipant();
  const isScreenSharing = localParticipant.isScreenShareEnabled;

  const toggleScreenShare = async () => {
    try {
      await localParticipant.setScreenShareEnabled(!isScreenSharing);
    } catch (e) {
      console.error("Failed to share screen", e);
    }
  };

  return (
    <div className="meeting-toolbar">
      <button
        className={`toolbar-btn ${isMuted ? "muted" : ""}`}
        onClick={toggleLocalMute}
      >
        {isMuted ? <MicOff /> : <Mic />}
        <span>{isMuted ? "Unmute" : "Mute"}</span>
      </button>

      <button
        className={`toolbar-btn ${isVideoOff ? "muted" : ""}`}
        onClick={() => setIsVideoOff(!isVideoOff)}
      >
        {isVideoOff ? <VideoOff /> : <VideoIcon />}
        <span>{isVideoOff ? "Start Video" : "Stop Video"}</span>
      </button>

      <button 
        className={`toolbar-btn ${isScreenSharing ? "active" : ""}`}
        onClick={toggleScreenShare}
        style={isScreenSharing ? { color: "#00A825" } : {}}
      >
        <Monitor />
        <span>{isScreenSharing ? "Stop Sharing" : "Share"}</span>
      </button>

      <button
        className={`toolbar-btn ${showParticipants ? "active" : ""}`}
        onClick={() => {
          setShowParticipants(!showParticipants);
          setShowChat(false);
        }}
      >
        <Users />
        <span>Participants</span>
      </button>

      <button
        className={`toolbar-btn ${showChat ? "active" : ""}`}
        onClick={() => {
          setShowChat(!showChat);
          setShowParticipants(false);
        }}
      >
        <MessageSquare />
        <span>Chat</span>
      </button>

      <button
        className={`toolbar-btn ${isHandRaised ? "active" : ""}`}
        onClick={handleToggleHand}
        style={isHandRaised ? { color: "#F5A623" } : {}}
      >
        <Hand />
        <span>{isHandRaised ? "Lower Hand" : "Raise Hand"}</span>
      </button>

      <div style={{ position: "relative" }}>
        <button
          className={`toolbar-btn ${showReactionsMenu ? "active" : ""}`}
          onClick={() => setShowReactionsMenu(!showReactionsMenu)}
        >
          <Smile />
          <span>Reactions</span>
        </button>
        {showReactionsMenu && (
          <div
            className="reactions-menu"
            style={{
              position: "absolute",
              bottom: "70px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#2D2D30",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "8px",
              display: "flex",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              zIndex: 100,
            }}
          >
            {["👏", "👍", "❤️", "😂", "😮", "🎉"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleSendReaction(emoji)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <button
          className={`toolbar-btn ${showMoreMenu ? "active" : ""}`}
          onClick={() => {
            setShowMoreMenu(!showMoreMenu);
            setShowReactionsMenu(false);
          }}
        >
          <MoreHorizontal />
          <span>More</span>
        </button>
        {showMoreMenu && (
          <div
            className="more-menu"
            style={{
              position: "absolute",
              bottom: "70px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#2D2D30",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "6px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              zIndex: 100,
              minWidth: "150px",
            }}
          >
            <button
              onClick={() => {
                handleCopyLink();
                setShowMoreMenu(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "4px",
                textAlign: "left",
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "none")
              }
            >
              <Copy style={{ width: 14, height: 14 }} />
              Share Link
            </button>

            {isHost && (
              <button
                onClick={() => {
                  handleEndMeeting();
                  setShowMoreMenu(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#E02020",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  textAlign: "left",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(224,32,32,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <PhoneOff style={{ width: 14, height: 14 }} />
                End Meeting
              </button>
            )}
          </div>
        )}
      </div>

      <button className="toolbar-btn-end" onClick={handleEndMeeting}>
        <PhoneOff style={{ width: 18, height: 18 }} />
        <span>{isHost ? "End" : "Leave"}</span>
      </button>
    </div>
  );
}

"use client";

import { MicOff } from "lucide-react";
import type { Participant as DBParticipant } from "@/lib/types";
import { useParticipants, useTracks, VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";

interface VideoGridProps {
  participants: DBParticipant[];
  localParticipantId: number | null;
  mutedIds: number[];
  isMuted: boolean;
  getGridClass: (count: number) => string;
  getAvatarColor: (name: string) => string;
  getInitials: (name: string) => string;
}

export default function VideoGrid({
  participants: dbParticipants,
  localParticipantId,
  mutedIds,
  isMuted,
  getGridClass,
  getAvatarColor,
  getInitials,
}: VideoGridProps) {
  const lkParticipants = useParticipants();

  // Combine DB participants with LiveKit participants based on name/identity
  // For a real production app, you'd rely entirely on LiveKit's metadata or DB metadata sync.
  // Here we'll map them so we can preserve our custom reactions/raised hands from the DB.
  
  return (
    <div className={`meeting-room-grid ${getGridClass(lkParticipants.length || dbParticipants.length)}`}>
      {lkParticipants.map((lkP) => {
        const dbP = dbParticipants.find((p) => p.display_name === lkP.identity);
        const name = lkP.identity || "Unknown";
        const isMutedState = lkP.isMicrophoneEnabled === false;
        
        // Find tracks
        const cameraPublication = lkP.getTrackPublication(Track.Source.Camera);
        const isVideoEnabled = cameraPublication?.isSubscribed && cameraPublication?.track;
        
        const screenPublication = lkP.getTrackPublication(Track.Source.ScreenShare);
        const isScreenEnabled = screenPublication?.isSubscribed && screenPublication?.track;

        const tiles = [];

        // Screen share tile
        if (isScreenEnabled) {
          tiles.push(
            <div
              key={`${lkP.sid}-screen`}
              className="participant-tile screen-share-tile"
              style={{ position: "relative", gridColumn: "1 / -1", height: "auto", aspectRatio: "16/9" }}
            >
              <VideoTrack 
                trackRef={{ participant: lkP, publication: screenPublication, source: Track.Source.ScreenShare }}
                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "12px", background: "black" }}
              />
              <div className="participant-tile-name" style={{ zIndex: 10 }}>
                {name}&apos;s Screen
              </div>
            </div>
          );
        }

        // Camera / Avatar tile
        tiles.push(
          <div
            key={`${lkP.sid}-camera`}
            className={`participant-tile ${lkP.isSpeaking ? "speaking" : ""}`}
            style={{ position: "relative" }}
          >
            {dbP?.reaction && (
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  zIndex: 10,
                }}
              >
                {dbP.reaction}
              </div>
            )}
            {dbP?.raised_hand && (
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  background: "#F5A623",
                  color: "white",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  fontSize: 11,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  zIndex: 10,
                }}
                title="Hand Raised"
              >
                🖐️ Raised
              </div>
            )}
            
            {isVideoEnabled ? (
              <VideoTrack 
                trackRef={{ participant: lkP, publication: cameraPublication, source: Track.Source.Camera }}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
              />
            ) : (
              <div
                className="participant-tile-avatar"
                style={{ background: getAvatarColor(name) }}
              >
                {getInitials(name)}
              </div>
            )}

            <div className="participant-tile-name" style={{ zIndex: 10 }}>
              {isMutedState && (
                <MicOff style={{ width: 11, height: 11, color: "#E02020" }} />
              )}
              {name}
              {dbP?.role === "HOST" && (
                <span style={{ fontSize: 10, opacity: 0.6 }}>(Host)</span>
              )}
            </div>
          </div>
        );

        return tiles;
      })}
    </div>
  );
}

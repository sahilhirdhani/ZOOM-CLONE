import axios from "axios";
import type {
  DashboardData,
  InstantMeetingResponse,
  ScheduleMeetingRequest,
  JoinMeetingRequest,
  JoinMeetingResponse,
  MeetingDetail,
  Meeting,
  Participant,
  Message,
} from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getDashboard(): Promise<DashboardData> {
  const res = await api.get("/dashboard");
  return res.data;
}

export async function createInstantMeeting(): Promise<InstantMeetingResponse> {
  const res = await api.post("/meetings/instant");
  return res.data;
}

export async function scheduleMeeting(
  data: ScheduleMeetingRequest
): Promise<InstantMeetingResponse> {
  const res = await api.post("/meetings/schedule", data);
  return res.data;
}

export async function joinMeeting(
  data: JoinMeetingRequest
): Promise<JoinMeetingResponse> {
  const res = await api.post("/meetings/join", data);
  return res.data;
}

export async function getMeetingDetail(code: string): Promise<MeetingDetail> {
  const res = await api.get(`/meetings/${code}`);
  return res.data;
}

export async function endMeeting(code: string): Promise<Meeting> {
  const res = await api.patch(`/meetings/${code}/end`);
  return res.data;
}

export async function getParticipants(code: string): Promise<Participant[]> {
  const res = await api.get(`/meetings/${code}/participants`);
  return res.data;
}

export async function removeParticipant(participantId: number, requesterId?: number): Promise<void> {
  const url = requesterId
    ? `/meetings/participants/${participantId}?requester_id=${requesterId}`
    : `/meetings/participants/${participantId}`;
  await api.delete(url);
}

export async function muteParticipant(participantId: number, isMuted: boolean, requesterId?: number): Promise<void> {
  const url = requesterId
    ? `/meetings/participants/${participantId}/mute?is_muted=${isMuted}&requester_id=${requesterId}`
    : `/meetings/participants/${participantId}/mute?is_muted=${isMuted}`;
  await api.patch(url);
}

export async function muteAllParticipants(code: string, requesterId?: number): Promise<void> {
  const url = requesterId
    ? `/meetings/${code}/mute-all?requester_id=${requesterId}`
    : `/meetings/${code}/mute-all`;
  await api.patch(url);
}

export async function raiseHand(participantId: number, raised: boolean): Promise<void> {
  await api.patch(`/meetings/participants/${participantId}/raise-hand?raised=${raised}`);
}

export async function sendReaction(participantId: number, reaction: string | null): Promise<void> {
  const url = reaction
    ? `/meetings/participants/${participantId}/react?reaction=${encodeURIComponent(reaction)}`
    : `/meetings/participants/${participantId}/react`;
  await api.patch(url);
}

export async function sendMessage(code: string, senderName: string, content: string): Promise<Message> {
  const res = await api.post(`/meetings/${code}/messages`, {
    sender_name: senderName,
    content: content
  });
  return res.data;
}

export async function getMessages(code: string): Promise<Message[]> {
  const res = await api.get(`/meetings/${code}/messages`);
  return res.data;
}

export default api;

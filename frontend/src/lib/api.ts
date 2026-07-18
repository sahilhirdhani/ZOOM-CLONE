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
} from "./types";

const api = axios.create({
  baseURL: "http://localhost:8000",
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

export async function removeParticipant(participantId: number): Promise<void> {
  await api.delete(`/meetings/participants/${participantId}`);
}

export default api;

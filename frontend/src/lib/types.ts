export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  plan: string;
}

export interface Meeting {
  id: number;
  meeting_code: string;
  title: string;
  description: string | null;
  status: string;
  visibility: string;
  scheduled_at: string | null;
  duration: number | null;
  is_instant: boolean;
  host_id: number | null;
  created_at: string | null;
}

export interface Participant {
  id: number;
  display_name: string;
  email: string | null;
  role: string;
  is_muted: boolean;
  raised_hand: boolean;
  reaction: string | null;
  joined_at: string | null;
}

export interface Message {
  id: number;
  meeting_id: number;
  sender_name: string;
  content: string;
  created_at: string;
}

export interface DashboardData {
  user: User;
  upcoming_meetings: Meeting[];
  recent_meetings: Meeting[];
}

export interface InstantMeetingResponse {
  message: string;
  meeting_code: string;
  meeting_link: string;
  meeting: Meeting;
}

export interface ScheduleMeetingRequest {
  title: string;
  description?: string;
  scheduled_at: string;
  duration: number;
}

export interface JoinMeetingRequest {
  meeting_code: string;
  display_name: string;
}

export interface JoinMeetingResponse {
  message: string;
  meeting: Meeting;
  participant_id: number;
}

export interface MeetingDetail {
  meeting: Meeting;
  participants: Participant[];
  meeting_link: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  time: string;
  fromMe: boolean;
  status: "sent" | "delivered" | "read";
}

export interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
}

export const conversations: Conversation[] = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "SC",
    lastMessage: "Sure, let me share the design files with you",
    time: "2:30 PM",
    unread: 2,
    online: true,
    messages: [
      { id: 1, text: "Hey! How's the project going?", time: "2:15 PM", fromMe: true, status: "read" },
      { id: 2, text: "It's going great! We finished the first sprint", time: "2:18 PM", fromMe: false, status: "read" },
      { id: 3, text: "That's awesome! Can you share the design files?", time: "2:22 PM", fromMe: true, status: "read" },
      { id: 4, text: "Sure, let me share the design files with you", time: "2:30 PM", fromMe: false, status: "read" },
    ],
  },
  {
    id: 2,
    name: "Dev Team",
    avatar: "DT",
    lastMessage: "Alex: Build passed ✅",
    time: "1:45 PM",
    unread: 5,
    online: false,
    messages: [
      { id: 1, text: "Hey team, the new API is deployed", time: "12:30 PM", fromMe: true, status: "read" },
      { id: 2, text: "Great work! Let me test it", time: "12:45 PM", fromMe: false, status: "read" },
      { id: 3, text: "Found a small issue with the auth endpoint", time: "1:15 PM", fromMe: false, status: "read" },
      { id: 4, text: "Fixed it, pushing now", time: "1:30 PM", fromMe: true, status: "delivered" },
      { id: 5, text: "Build passed ✅", time: "1:45 PM", fromMe: false, status: "read" },
    ],
  },
  {
    id: 3,
    name: "Jessica Park",
    avatar: "JP",
    lastMessage: "See you at the meeting tomorrow!",
    time: "12:10 PM",
    unread: 0,
    online: true,
    messages: [
      { id: 1, text: "Hi Jessica, are you available for the sprint review?", time: "11:30 AM", fromMe: true, status: "read" },
      { id: 2, text: "Yes! What time works for you?", time: "11:45 AM", fromMe: false, status: "read" },
      { id: 3, text: "How about 10 AM tomorrow?", time: "12:00 PM", fromMe: true, status: "read" },
      { id: 4, text: "See you at the meeting tomorrow!", time: "12:10 PM", fromMe: false, status: "read" },
    ],
  },
  {
    id: 4,
    name: "Michael Torres",
    avatar: "MT",
    lastMessage: "Thanks for the feedback!",
    time: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      { id: 1, text: "Michael, I reviewed your PR", time: "4:00 PM", fromMe: true, status: "read" },
      { id: 2, text: "Thanks for the feedback!", time: "4:15 PM", fromMe: false, status: "read" },
    ],
  },
  {
    id: 5,
    name: "Product Team",
    avatar: "PT",
    lastMessage: "Lisa: Roadmap updated for Q3",
    time: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      { id: 1, text: "Team, we need to finalize the Q3 roadmap", time: "3:00 PM", fromMe: false, status: "read" },
      { id: 2, text: "I've added my section", time: "3:30 PM", fromMe: true, status: "read" },
      { id: 3, text: "Roadmap updated for Q3", time: "4:00 PM", fromMe: false, status: "read" },
    ],
  },
  {
    id: 6,
    name: "David Kim",
    avatar: "DK",
    lastMessage: "Let's grab coffee next week",
    time: "Mon",
    unread: 0,
    online: true,
    messages: [
      { id: 1, text: "Hey David, haven't caught up in a while", time: "10:00 AM", fromMe: true, status: "read" },
      { id: 2, text: "Let's grab coffee next week", time: "10:30 AM", fromMe: false, status: "read" },
    ],
  },
];

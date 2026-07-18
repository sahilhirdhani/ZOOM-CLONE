"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Image as ImageIcon,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
} from "lucide-react";

interface ChatMessage {
  id: number;
  text: string;
  time: string;
  fromMe: boolean;
  status: "sent" | "delivered" | "read";
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
}

const conversations: Conversation[] = [
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

export default function ChatPage() {
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (messageInput.trim()) {
      setMessageInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Sidebar />
      <TopBar title="Chat" />

      <main className="main-content" style={{ padding: 0, display: "flex", height: "calc(100vh - var(--topbar-height))" }}>
        {/* Conversation List */}
        <div className="chat-list">
          <div className="chat-list-header">
            <div className="chat-search">
              <Search />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="chat-list-items">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                className={`chat-list-item ${selectedId === conv.id ? "active" : ""}`}
                onClick={() => setSelectedId(conv.id)}
                id={`chat-conversation-${conv.id}`}
              >
                <div className="chat-list-item-avatar">
                  <span>{conv.avatar}</span>
                  {conv.online && <div className="chat-online-dot" />}
                </div>
                <div className="chat-list-item-content">
                  <div className="chat-list-item-top">
                    <span className="chat-list-item-name">{conv.name}</span>
                    <span className="chat-list-item-time">{conv.time}</span>
                  </div>
                  <div className="chat-list-item-bottom">
                    <span className="chat-list-item-preview">{conv.lastMessage}</span>
                    {conv.unread > 0 && (
                      <span className="chat-unread-badge">{conv.unread}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        {selectedConversation ? (
          <div className="chat-window">
            <div className="chat-window-header">
              <div className="chat-window-header-left">
                <div className="chat-window-avatar">
                  <span>{selectedConversation.avatar}</span>
                  {selectedConversation.online && <div className="chat-online-dot" />}
                </div>
                <div>
                  <div className="chat-window-name">{selectedConversation.name}</div>
                  <div className="chat-window-status">
                    {selectedConversation.online ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
              <div className="chat-window-header-right">
                <button className="topbar-icon-btn" title="Voice Call">
                  <Phone />
                </button>
                <button className="topbar-icon-btn" title="Video Call">
                  <Video />
                </button>
                <button className="topbar-icon-btn" title="More Options">
                  <MoreVertical />
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message ${msg.fromMe ? "sent" : "received"}`}
                >
                  <div className="chat-bubble">
                    <p>{msg.text}</p>
                    <div className="chat-message-meta">
                      <span className="chat-message-time">{msg.time}</span>
                      {msg.fromMe && (
                        <span className="chat-message-status">
                          {msg.status === "read" ? (
                            <CheckCheck style={{ width: 14, height: 14, color: "var(--zoom-blue)" }} />
                          ) : (
                            <Check style={{ width: 14, height: 14 }} />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input-area">
              <div className="chat-input-actions">
                <button className="chat-input-btn" title="Attach File">
                  <Paperclip />
                </button>
                <button className="chat-input-btn" title="Send Image">
                  <ImageIcon />
                </button>
                <button className="chat-input-btn" title="Emoji">
                  <Smile />
                </button>
              </div>
              <div className="chat-input-wrapper">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  id="chat-message-input"
                />
                <button
                  className="chat-send-btn"
                  onClick={handleSend}
                  disabled={!messageInput.trim()}
                  id="chat-send-button"
                >
                  <Send />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-empty-state">
            <div className="chat-empty-icon">💬</div>
            <h2>Select a conversation</h2>
            <p>Choose from your existing conversations or start a new one</p>
          </div>
        )}
      </main>
    </>
  );
}

"use client";

import {
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Check,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Send,
} from "lucide-react";
import type { Conversation } from "../mockData";

interface ChatWindowProps {
  selectedConversation: Conversation;
  messageInput: string;
  setMessageInput: (val: string) => void;
  handleSend: () => void;
}

export default function ChatWindow({
  selectedConversation,
  messageInput,
  setMessageInput,
  handleSend,
}: ChatWindowProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-window">
      {/* Header */}
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

      {/* Messages */}
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
                      <CheckCheck
                        style={{
                          width: 14,
                          height: 14,
                          color: "var(--zoom-blue)",
                        }}
                      />
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

      {/* Input area */}
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
  );
}

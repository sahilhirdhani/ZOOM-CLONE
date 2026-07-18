"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import type { Message } from "@/lib/types";
import "./ChatPanel.css";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export default function ChatPanel({
  isOpen,
  onClose,
  messages,
  onSendMessage,
}: ChatPanelProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">
        <h3>Chat</h3>
        <button className="chat-panel-close" onClick={onClose}>
          <X style={{ width: 16, height: 16 }} />
        </button>
      </div>

      <div className="chat-panel-messages">
        {messages.map((m) => (
          <div key={m.id} className="chat-message">
            <div className="chat-message-info">
              <span className="chat-message-sender">{m.sender_name}</span>
              <span className="chat-message-time">
                {new Date(m.created_at).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
            <div className="chat-message-content">{m.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-panel-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Send a message to everyone..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" disabled={!inputText.trim()}>
          <Send style={{ width: 16, height: 16 }} />
        </button>
      </form>
    </div>
  );
}

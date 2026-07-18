"use client";

import { Search } from "lucide-react";
import type { Conversation } from "../mockData";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: number | null;
  setSelectedId: (id: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function ConversationList({
  conversations,
  selectedId,
  setSelectedId,
  searchQuery,
  setSearchQuery,
}: ConversationListProps) {
  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
  );
}

"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { conversations } from "./mockData";
import "./chat.css";

// Extracted Sub-components
import ConversationList from "./components/ConversationList";
import ChatWindow from "./components/ChatWindow";

export default function ChatPage() {
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Mobile: track whether we're viewing the chat window or the list
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const handleSend = () => {
    if (messageInput.trim()) {
      setMessageInput("");
    }
  };

  const handleSelectConversation = (id: number) => {
    setSelectedId(id);
    setMobileShowChat(true); // On mobile, switch to chat view
  };

  const handleBackToList = () => {
    setMobileShowChat(false);
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar title="Chat" sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className={`main-content chat-main-content ${mobileShowChat ? "mobile-show-chat" : "mobile-show-list"}`}
        style={{
          padding: 0,
          display: "flex",
          height: "calc(100vh - var(--topbar-height))",
        }}
      >
        {/* Conversation List */}
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          setSelectedId={handleSelectConversation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Chat Window */}
        {selectedConversation ? (
          <ChatWindow
            selectedConversation={selectedConversation}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            handleSend={handleSend}
            onBack={handleBackToList}
          />
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

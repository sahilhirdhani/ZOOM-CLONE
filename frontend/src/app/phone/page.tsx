"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import {
  Phone as PhoneIcon,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Video,
  Clock,
  Delete,
  Search,
  Star,
  Grid3X3,
} from "lucide-react";
import "./phone.css";

interface CallRecord {
  id: number;
  name: string;
  avatar: string;
  number: string;
  time: string;
  duration: string;
  type: "incoming" | "outgoing" | "missed";
  isVideo: boolean;
}

const recentCalls: CallRecord[] = [
  { id: 1, name: "Sarah Chen", avatar: "SC", number: "+1 (555) 234-5678", time: "Today, 2:30 PM", duration: "12:34", type: "outgoing", isVideo: false },
  { id: 2, name: "Alex Johnson", avatar: "AJ", number: "+1 (555) 345-6789", time: "Today, 1:15 PM", duration: "—", type: "missed", isVideo: false },
  { id: 3, name: "Jessica Park", avatar: "JP", number: "+1 (555) 456-7890", time: "Today, 11:00 AM", duration: "5:22", type: "incoming", isVideo: true },
  { id: 4, name: "Michael Torres", avatar: "MT", number: "+1 (555) 567-8901", time: "Yesterday, 4:45 PM", duration: "23:10", type: "outgoing", isVideo: true },
  { id: 5, name: "David Kim", avatar: "DK", number: "+1 (555) 678-9012", time: "Yesterday, 2:00 PM", duration: "8:45", type: "incoming", isVideo: false },
  { id: 6, name: "Emily Watson", avatar: "EW", number: "+1 (555) 789-0123", time: "Yesterday, 10:30 AM", duration: "—", type: "missed", isVideo: false },
  { id: 7, name: "Lisa Nguyen", avatar: "LN", number: "+1 (555) 890-1234", time: "Mon, 3:20 PM", duration: "15:08", type: "outgoing", isVideo: false },
  { id: 8, name: "James Wilson", avatar: "JW", number: "+1 (555) 901-2345", time: "Mon, 9:15 AM", duration: "42:00", type: "incoming", isVideo: true },
];

const favorites = [
  { name: "Sarah Chen", avatar: "SC", number: "+1 (555) 234-5678" },
  { name: "Jessica Park", avatar: "JP", number: "+1 (555) 456-7890" },
  { name: "Dev Team", avatar: "DT", number: "Meeting Room" },
];

const dialPadKeys = [
  { digit: "1", letters: "" },
  { digit: "2", letters: "ABC" },
  { digit: "3", letters: "DEF" },
  { digit: "4", letters: "GHI" },
  { digit: "5", letters: "JKL" },
  { digit: "6", letters: "MNO" },
  { digit: "7", letters: "PQRS" },
  { digit: "8", letters: "TUV" },
  { digit: "9", letters: "WXYZ" },
  { digit: "*", letters: "" },
  { digit: "0", letters: "+" },
  { digit: "#", letters: "" },
];

export default function PhonePage() {
  const [dialNumber, setDialNumber] = useState("");
  const [activeTab, setActiveTab] = useState<"recent" | "favorites">("recent");
  const [filter, setFilter] = useState<"all" | "missed">("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Mobile: which bottom tab is active
  const [mobileTab, setMobileTab] = useState<"recents" | "keypad" | "favorites">("recents");

  const handleDigitPress = (digit: string) => {
    setDialNumber((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setDialNumber((prev) => prev.slice(0, -1));
  };

  const filteredCalls = filter === "missed"
    ? recentCalls.filter((c) => c.type === "missed")
    : recentCalls;

  const getCallIcon = (type: string) => {
    switch (type) {
      case "incoming": return <PhoneIncoming style={{ width: 14, height: 14, color: "var(--zoom-green)" }} />;
      case "outgoing": return <PhoneOutgoing style={{ width: 14, height: 14, color: "var(--zoom-blue)" }} />;
      case "missed": return <PhoneMissed style={{ width: 14, height: 14, color: "var(--zoom-red)" }} />;
      default: return null;
    }
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar title="Phone" sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <main className="main-content">
        {/* ===== DESKTOP LAYOUT (unchanged) ===== */}
        <div className="phone-layout phone-desktop-layout">
          {/* Left: Call History */}
          <div className="phone-history">
            <div className="phone-history-header">
              <div className="phone-tabs">
                <button
                  className={`phone-tab ${activeTab === "recent" ? "active" : ""}`}
                  onClick={() => setActiveTab("recent")}
                  id="phone-tab-recent"
                >
                  <Clock style={{ width: 14, height: 14 }} />
                  Recent
                </button>
                <button
                  className={`phone-tab ${activeTab === "favorites" ? "active" : ""}`}
                  onClick={() => setActiveTab("favorites")}
                  id="phone-tab-favorites"
                >
                  <Star style={{ width: 14, height: 14 }} />
                  Favorites
                </button>
              </div>
              {activeTab === "recent" && (
                <div className="phone-filter">
                  <button
                    className={`phone-filter-btn ${filter === "all" ? "active" : ""}`}
                    onClick={() => setFilter("all")}
                  >
                    All
                  </button>
                  <button
                    className={`phone-filter-btn ${filter === "missed" ? "active" : ""}`}
                    onClick={() => setFilter("missed")}
                  >
                    Missed
                  </button>
                </div>
              )}
            </div>

            {activeTab === "recent" ? (
              <div className="phone-call-list">
                {filteredCalls.map((call) => (
                  <div key={call.id} className="phone-call-item" id={`call-${call.id}`}>
                    <div className="phone-call-item-left">
                      <div className="phone-call-avatar">
                        <span>{call.avatar}</span>
                      </div>
                      <div className="phone-call-info">
                        <div className="phone-call-name">
                          <span className={call.type === "missed" ? "missed" : ""}>{call.name}</span>
                          {call.isVideo && <Video style={{ width: 12, height: 12, color: "var(--zoom-text-tertiary)" }} />}
                        </div>
                        <div className="phone-call-detail">
                          {getCallIcon(call.type)}
                          <span>{call.time}</span>
                          {call.duration !== "—" && <span className="phone-call-duration">· {call.duration}</span>}
                        </div>
                      </div>
                    </div>
                    <button className="phone-call-action" title="Call">
                      <PhoneIcon style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="phone-favorites-grid">
                {favorites.map((fav, i) => (
                  <div key={i} className="phone-favorite-card">
                    <div className="phone-favorite-avatar">
                      <span>{fav.avatar}</span>
                    </div>
                    <div className="phone-favorite-name">{fav.name}</div>
                    <div className="phone-favorite-number">{fav.number}</div>
                    <div className="phone-favorite-actions">
                      <button className="topbar-icon-btn" title="Call">
                        <PhoneIcon />
                      </button>
                      <button className="topbar-icon-btn" title="Video">
                        <Video />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Dial Pad */}
          <div className="phone-dialpad-section">
            <div className="phone-display">
              <input
                type="text"
                value={dialNumber}
                onChange={(e) => setDialNumber(e.target.value)}
                placeholder="Enter a number"
                className="phone-display-input"
                id="phone-display-input"
              />
              {dialNumber && (
                <button className="phone-backspace" onClick={handleBackspace} title="Backspace">
                  <Delete style={{ width: 20, height: 20 }} />
                </button>
              )}
            </div>
            <div className="phone-dialpad">
              {dialPadKeys.map((key) => (
                <button
                  key={key.digit}
                  className="phone-key"
                  onClick={() => handleDigitPress(key.digit)}
                  id={`phone-key-${key.digit}`}
                >
                  <span className="phone-key-digit">{key.digit}</span>
                  {key.letters && <span className="phone-key-letters">{key.letters}</span>}
                </button>
              ))}
            </div>
            <button className="phone-call-btn" disabled={!dialNumber} id="phone-call-button">
              <PhoneIcon style={{ width: 24, height: 24 }} />
            </button>
          </div>
        </div>

        {/* ===== MOBILE LAYOUT ===== */}
        <div className="phone-mobile-layout">
          {/* Mobile content area — switches based on tab */}
          <div className="phone-mobile-content">
            {/* Recents tab */}
            {mobileTab === "recents" && (
              <div className="phone-mobile-recents">
                <div className="phone-mobile-section-header">
                  <h2>Recents</h2>
                  <div className="phone-filter">
                    <button
                      className={`phone-filter-btn ${filter === "all" ? "active" : ""}`}
                      onClick={() => setFilter("all")}
                    >
                      All
                    </button>
                    <button
                      className={`phone-filter-btn ${filter === "missed" ? "active" : ""}`}
                      onClick={() => setFilter("missed")}
                    >
                      Missed
                    </button>
                  </div>
                </div>
                <div className="phone-mobile-call-list">
                  {filteredCalls.map((call) => (
                    <div key={call.id} className="phone-mobile-call-item">
                      <div className="phone-call-avatar">
                        <span>{call.avatar}</span>
                      </div>
                      <div className="phone-mobile-call-info">
                        <div className="phone-mobile-call-name">
                          <span className={call.type === "missed" ? "missed" : ""}>{call.name}</span>
                          {call.isVideo && <Video style={{ width: 13, height: 13, color: "var(--zoom-text-tertiary)" }} />}
                        </div>
                        <div className="phone-mobile-call-detail">
                          {getCallIcon(call.type)}
                          <span>{call.time}</span>
                        </div>
                      </div>
                      <div className="phone-mobile-call-right">
                        {call.duration !== "—" && <span className="phone-mobile-duration">{call.duration}</span>}
                        <button className="phone-mobile-call-btn-small" title="Call">
                          <PhoneIcon style={{ width: 16, height: 16 }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keypad tab */}
            {mobileTab === "keypad" && (
              <div className="phone-mobile-keypad">
                <div className="phone-mobile-display">
                  <input
                    type="text"
                    value={dialNumber}
                    onChange={(e) => setDialNumber(e.target.value)}
                    placeholder="Enter a number"
                    className="phone-mobile-display-input"
                  />
                  {dialNumber && (
                    <button className="phone-backspace" onClick={handleBackspace}>
                      <Delete style={{ width: 20, height: 20 }} />
                    </button>
                  )}
                </div>
                <div className="phone-mobile-dialpad">
                  {dialPadKeys.map((key) => (
                    <button
                      key={key.digit}
                      className="phone-mobile-key"
                      onClick={() => handleDigitPress(key.digit)}
                    >
                      <span className="phone-key-digit">{key.digit}</span>
                      {key.letters && <span className="phone-key-letters">{key.letters}</span>}
                    </button>
                  ))}
                </div>
                <button className="phone-mobile-call-fab" disabled={!dialNumber}>
                  <PhoneIcon style={{ width: 28, height: 28 }} />
                </button>
              </div>
            )}

            {/* Favorites tab */}
            {mobileTab === "favorites" && (
              <div className="phone-mobile-favorites">
                <div className="phone-mobile-section-header">
                  <h2>Favorites</h2>
                </div>
                <div className="phone-mobile-favorites-list">
                  {favorites.map((fav, i) => (
                    <div key={i} className="phone-mobile-favorite-item">
                      <div className="phone-call-avatar phone-mobile-fav-avatar">
                        <span>{fav.avatar}</span>
                      </div>
                      <div className="phone-mobile-fav-info">
                        <div className="phone-mobile-fav-name">{fav.name}</div>
                        <div className="phone-mobile-fav-number">{fav.number}</div>
                      </div>
                      <div className="phone-mobile-fav-actions">
                        <button className="phone-mobile-call-btn-small" title="Call">
                          <PhoneIcon style={{ width: 16, height: 16 }} />
                        </button>
                        <button className="phone-mobile-call-btn-small" title="Video">
                          <Video style={{ width: 16, height: 16 }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile bottom tab bar */}
          <div className="phone-mobile-tabbar">
            <button
              className={`phone-mobile-tabbar-item ${mobileTab === "recents" ? "active" : ""}`}
              onClick={() => setMobileTab("recents")}
            >
              <Clock style={{ width: 22, height: 22 }} />
              <span>Recents</span>
            </button>
            <button
              className={`phone-mobile-tabbar-item ${mobileTab === "keypad" ? "active" : ""}`}
              onClick={() => setMobileTab("keypad")}
            >
              <Grid3X3 style={{ width: 22, height: 22 }} />
              <span>Keypad</span>
            </button>
            <button
              className={`phone-mobile-tabbar-item ${mobileTab === "favorites" ? "active" : ""}`}
              onClick={() => setMobileTab("favorites")}
            >
              <Star style={{ width: 22, height: 22 }} />
              <span>Favorites</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import {
  User,
  Bell,
  Monitor,
  Mic,
  Camera,
  Shield,
  ChevronRight,
  Check,
  ArrowLeft,
} from "lucide-react";
import { getDashboard } from "@/lib/api";
import type { User as UserType } from "@/lib/types";
import "./settings.css";

// Modular Section Components
import ProfileSection from "./components/ProfileSection";
import NotificationsSection from "./components/NotificationsSection";
import AudioSection from "./components/AudioSection";
import VideoSection from "./components/VideoSection";
import GeneralSection from "./components/GeneralSection";
import SecuritySection from "./components/SecuritySection";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
];

export default function SettingsPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileShowSection, setMobileShowSection] = useState(false);
  
  // Profile form states
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [plan, setPlan] = useState("Basic");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    meetingReminders: true,
    chatNotifications: true,
    darkMode: false,
    autoJoinAudio: true,
    muteOnEntry: false,
    cameraOff: false,
    hdVideo: true,
    mirrorVideo: true,
    noiseSuppression: true,
    language: "en",
  });

  const fetchUser = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("zoom_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setName(parsed.name || "");
        setAvatar(parsed.avatar || "");
        setPlan(parsed.plan || "Basic");
      } else {
        const data = await getDashboard();
        setUser(data.user);
        setName(data.user.name || "");
        setAvatar(data.user.avatar || "");
        setPlan(data.user.plan || "Basic");
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("zoom_theme") || "light";
    setSettings((prev) => ({ ...prev, darkMode: savedTheme === "dark" }));
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, [fetchUser]);

  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem("zoom_theme") || "light";
      setSettings((prev) => ({ ...prev, darkMode: savedTheme === "dark" }));
    };

    window.addEventListener("themechange", handleThemeChange);
    return () => {
      window.removeEventListener("themechange", handleThemeChange);
    };
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => {
      const newVal = !prev[key];
      if (key === "darkMode") {
        const themeStr = newVal ? "dark" : "light";
        localStorage.setItem("zoom_theme", themeStr);
        document.documentElement.setAttribute("data-theme", themeStr);
      }
      return { ...prev, [key]: newVal };
    });
  };

  const handleSave = () => {
    if (user) {
      const updatedUser = {
        ...user,
        name: name,
        avatar: avatar,
        plan: plan,
      };
      setUser(updatedUser);
      localStorage.setItem("zoom_user", JSON.stringify(updatedUser));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: "profile", label: "Profile", icon: <User style={{ width: 16, height: 16 }} /> },
    { id: "notifications", label: "Notifications", icon: <Bell style={{ width: 16, height: 16 }} /> },
    { id: "audio", label: "Audio", icon: <Mic style={{ width: 16, height: 16 }} /> },
    { id: "video", label: "Video", icon: <Camera style={{ width: 16, height: 16 }} /> },
    { id: "general", label: "General", icon: <Monitor style={{ width: 16, height: 16 }} /> },
    { id: "security", label: "Privacy & Security", icon: <Shield style={{ width: 16, height: 16 }} /> },
  ];

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar title="Settings" sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <main className={`main-content ${mobileShowSection ? "mobile-show-content" : "mobile-show-nav"}`}>
        <div className="settings-layout">
          {/* Settings Navigation */}
          <div className="settings-nav">
            <h2 className="settings-nav-title">Settings</h2>
            {sections.map((section) => (
              <button
                key={section.id}
                className={`settings-nav-item ${activeSection === section.id ? "active" : ""}`}
                onClick={() => {
                  setActiveSection(section.id);
                  setMobileShowSection(true);
                }}
                id={`settings-nav-${section.id}`}
              >
                {section.icon}
                <span>{section.label}</span>
                <ChevronRight style={{ width: 14, height: 14, marginLeft: "auto", opacity: 0.3 }} />
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="settings-content">
            {/* Mobile Back Button */}
            <button 
              className="settings-back-btn" 
              onClick={() => setMobileShowSection(false)}
            >
              <ArrowLeft />
              <span>Settings</span>
            </button>
            {loading ? (
              <div className="loading-spinner" />
            ) : (
              <>
                {/* Profile Section */}
                {activeSection === "profile" && (
                  <ProfileSection
                    user={user}
                    name={name}
                    setName={setName}
                    avatar={avatar}
                    setAvatar={setAvatar}
                    plan={plan}
                    setPlan={setPlan}
                    showAvatarPicker={showAvatarPicker}
                    setShowAvatarPicker={setShowAvatarPicker}
                    presetAvatars={PRESET_AVATARS}
                  />
                )}

                {/* Notifications Section */}
                {activeSection === "notifications" && (
                  <NotificationsSection
                    settings={settings}
                    handleToggle={handleToggle}
                  />
                )}

                {/* Audio Section */}
                {activeSection === "audio" && (
                  <AudioSection
                    settings={settings}
                    handleToggle={handleToggle}
                  />
                )}

                {/* Video Section */}
                {activeSection === "video" && (
                  <VideoSection
                    settings={settings}
                    handleToggle={handleToggle}
                  />
                )}

                {/* General Section */}
                {activeSection === "general" && (
                  <GeneralSection
                    settings={settings}
                    handleToggle={handleToggle}
                    setSettings={setSettings}
                  />
                )}

                {/* Security Section */}
                {activeSection === "security" && (
                  <SecuritySection />
                )}

                {/* Save Button */}
                <div className="settings-footer">
                  <button className="btn btn-md btn-primary" onClick={handleSave} id="settings-save-btn">
                    {saved ? (
                      <>
                        <Check style={{ width: 14, height: 14 }} /> Saved!
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

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
  Moon,
  Globe,
  Shield,
  ChevronRight,
  Check,
  Volume2,
  Headphones,
} from "lucide-react";
import { getDashboard } from "@/lib/api";
import type { User as UserType } from "@/lib/types";
import "./settings.css";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
];

interface SettingToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  
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
      <Sidebar />
      <TopBar title="Settings" />

      <main className="main-content">
        <div className="settings-layout">
          {/* Settings Navigation */}
          <div className="settings-nav">
            <h2 className="settings-nav-title">Settings</h2>
            {sections.map((section) => (
              <button
                key={section.id}
                className={`settings-nav-item ${activeSection === section.id ? "active" : ""}`}
                onClick={() => setActiveSection(section.id)}
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
            {loading ? (
              <div className="loading-spinner" />
            ) : (
              <>
                {/* Profile Section */}
                {activeSection === "profile" && (
                  <div className="settings-section" id="settings-profile">
                    <h2 className="settings-section-title">Profile</h2>
                    <p className="settings-section-desc">Manage your personal information and account</p>

                    <div className="settings-profile-card">
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                        <div className="settings-profile-avatar" style={{ position: "relative" }}>
                          {avatar ? (
                            <img src={avatar} alt={name} />
                          ) : (
                            <span>{name.charAt(0) || "?"}</span>
                          )}
                          <button 
                            type="button" 
                            className="settings-avatar-edit"
                            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                          >
                            Edit
                          </button>
                        </div>
                        
                        {showAvatarPicker && (
                          <div className="settings-avatar-grid" style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 8,
                            padding: 8,
                            background: "rgba(255,255,255,0.04)",
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.08)"
                          }}>
                            {PRESET_AVATARS.map((av) => (
                              <button
                                key={av}
                                type="button"
                                onClick={() => {
                                  setAvatar(av);
                                  setShowAvatarPicker(false);
                                }}
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: "50%",
                                  overflow: "hidden",
                                  border: avatar === av ? "2px solid var(--zoom-blue)" : "2px solid transparent",
                                  padding: 0,
                                  cursor: "pointer",
                                  background: "none"
                                }}
                              >
                                <img src={av} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="settings-profile-info">
                        <div className="form-group">
                          <label className="form-label">Full Name</label>
                          <input 
                            className="form-input" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            id="settings-name-input" 
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Email</label>
                          <input className="form-input" defaultValue={user?.email || ""} disabled id="settings-email-input" />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Plan</label>
                            <select 
                              className="form-select" 
                              value={plan} 
                              onChange={(e) => setPlan(e.target.value)}
                            >
                              <option value="Basic">Basic</option>
                              <option value="Pro">Pro</option>
                              <option value="Business">Business</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Personal Meeting ID</label>
                            <input className="form-input" defaultValue={user?.personal_meeting_id || "545-123-7890"} disabled />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Section */}
                {activeSection === "notifications" && (
                  <div className="settings-section" id="settings-notifications">
                    <h2 className="settings-section-title">Notifications</h2>
                    <p className="settings-section-desc">Control how and when you receive notifications</p>

                    <div className="settings-group">
                      <div className="settings-toggle-item">
                        <div className="settings-toggle-info">
                          <h4>Push Notifications</h4>
                          <p>Receive notifications for messages and calls</p>
                        </div>
                        <button
                          className={`settings-toggle ${settings.notifications ? "active" : ""}`}
                          onClick={() => handleToggle("notifications")}
                          id="toggle-notifications"
                        />
                      </div>
                      <div className="settings-toggle-item">
                        <div className="settings-toggle-info">
                          <h4>Email Notifications</h4>
                          <p>Get meeting summaries and invites via email</p>
                        </div>
                        <button
                          className={`settings-toggle ${settings.emailNotifications ? "active" : ""}`}
                          onClick={() => handleToggle("emailNotifications")}
                          id="toggle-email-notifications"
                        />
                      </div>
                      <div className="settings-toggle-item">
                        <div className="settings-toggle-info">
                          <h4>Meeting Reminders</h4>
                          <p>Get reminded 5 minutes before meetings start</p>
                        </div>
                        <button
                          className={`settings-toggle ${settings.meetingReminders ? "active" : ""}`}
                          onClick={() => handleToggle("meetingReminders")}
                          id="toggle-meeting-reminders"
                        />
                      </div>
                      <div className="settings-toggle-item">
                        <div className="settings-toggle-info">
                          <h4>Chat Notifications</h4>
                          <p>Get notified for new chat messages</p>
                        </div>
                        <button
                          className={`settings-toggle ${settings.chatNotifications ? "active" : ""}`}
                          onClick={() => handleToggle("chatNotifications")}
                          id="toggle-chat-notifications"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Audio Section */}
                {activeSection === "audio" && (
                  <div className="settings-section" id="settings-audio">
                    <h2 className="settings-section-title">Audio</h2>
                    <p className="settings-section-desc">Configure your audio devices and preferences</p>

                    <div className="settings-group">
                      <div className="settings-device-row">
                        <div className="settings-device-icon">
                          <Mic style={{ width: 18, height: 18 }} />
                        </div>
                        <div className="settings-device-info">
                          <label className="form-label">Microphone</label>
                          <select className="form-select" id="settings-mic-select">
                            <option>Default — Internal Microphone</option>
                            <option>External USB Microphone</option>
                          </select>
                        </div>
                      </div>
                      <div className="settings-device-row">
                        <div className="settings-device-icon">
                          <Volume2 style={{ width: 18, height: 18 }} />
                        </div>
                        <div className="settings-device-info">
                          <label className="form-label">Speaker</label>
                          <select className="form-select" id="settings-speaker-select">
                            <option>Default — Internal Speakers</option>
                            <option>External Speaker</option>
                          </select>
                        </div>
                      </div>

                      <div className="settings-divider" />

                      <div className="settings-toggle-item">
                        <div className="settings-toggle-info">
                          <h4>Auto-Join Audio</h4>
                          <p>Automatically join audio when joining a meeting</p>
                        </div>
                        <button
                          className={`settings-toggle ${settings.autoJoinAudio ? "active" : ""}`}
                          onClick={() => handleToggle("autoJoinAudio")}
                          id="toggle-auto-join-audio"
                        />
                      </div>
                      <div className="settings-toggle-item">
                        <div className="settings-toggle-info">
                          <h4>Mute on Entry</h4>
                          <p>Start with your microphone muted when joining</p>
                        </div>
                        <button
                          className={`settings-toggle ${settings.muteOnEntry ? "active" : ""}`}
                          onClick={() => handleToggle("muteOnEntry")}
                          id="toggle-mute-on-entry"
                        />
                      </div>
                      <div className="settings-toggle-item">
                        <div className="settings-toggle-info">
                          <h4>Noise Suppression</h4>
                          <p>Filter background noise during meetings</p>
                        </div>
                        <button
                          className={`settings-toggle ${settings.noiseSuppression ? "active" : ""}`}
                          onClick={() => handleToggle("noiseSuppression")}
                          id="toggle-noise-suppression"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Video Section */}
                {activeSection === "video" && (
                  <div className="settings-section" id="settings-video">
                    <h2 className="settings-section-title">Video</h2>
                    <p className="settings-section-desc">Configure your camera and video preferences</p>

                    <div className="settings-group">
                      <div className="settings-device-row">
                        <div className="settings-device-icon">
                          <Camera style={{ width: 18, height: 18 }} />
                        </div>
                        <div className="settings-device-info">
                          <label className="form-label">Camera</label>
                          <select className="form-select" id="settings-camera-select">
                            <option>Default — FaceTime HD Camera</option>
                            <option>External USB Camera</option>
                          </select>
                        </div>
                      </div>

                      <div className="settings-video-preview">
                        <div className="settings-camera-placeholder">
                          <Camera style={{ width: 40, height: 40, opacity: 0.3 }} />
                          <p>Camera preview</p>
                        </div>
                      </div>

                      <div className="settings-divider" />

                      <div className="settings-toggle-item">
                        <div className="settings-toggle-info">
                          <h4>Turn Off Camera on Entry</h4>
                          <p>Start with your camera off when joining meetings</p>
                        </div>
                        <button
                          className={`settings-toggle ${settings.cameraOff ? "active" : ""}`}
                          onClick={() => handleToggle("cameraOff")}
                          id="toggle-camera-off"
                        />
                      </div>
                      <div className="settings-toggle-item">
                        <div className="settings-toggle-info">
                          <h4>HD Video</h4>
                          <p>Send and receive video in high definition</p>
                        </div>
                        <button
                          className={`settings-toggle ${settings.hdVideo ? "active" : ""}`}
                          onClick={() => handleToggle("hdVideo")}
                          id="toggle-hd-video"
                        />
                      </div>
                      <div className="settings-toggle-item">
                        <div className="settings-toggle-info">
                          <h4>Mirror My Video</h4>
                          <p>Mirror your video feed as seen by yourself</p>
                        </div>
                        <button
                          className={`settings-toggle ${settings.mirrorVideo ? "active" : ""}`}
                          onClick={() => handleToggle("mirrorVideo")}
                          id="toggle-mirror-video"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* General Section */}
                {activeSection === "general" && (
                  <div className="settings-section" id="settings-general">
                    <h2 className="settings-section-title">General</h2>
                    <p className="settings-section-desc">Application appearance and behavior</p>

                    <div className="settings-group">
                      <div className="settings-toggle-item">
                        <div className="settings-toggle-info">
                          <h4><Moon style={{ width: 14, height: 14, display: "inline", verticalAlign: "text-bottom", marginRight: 6 }} />Dark Mode</h4>
                          <p>Use dark theme for the application</p>
                        </div>
                        <button
                          className={`settings-toggle ${settings.darkMode ? "active" : ""}`}
                          onClick={() => handleToggle("darkMode")}
                          id="toggle-dark-mode"
                        />
                      </div>

                      <div className="settings-divider" />

                      <div className="settings-device-row">
                        <div className="settings-device-icon">
                          <Globe style={{ width: 18, height: 18 }} />
                        </div>
                        <div className="settings-device-info">
                          <label className="form-label">Language</label>
                          <select
                            className="form-select"
                            value={settings.language}
                            onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}
                            id="settings-language-select"
                          >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="ja">日本語</option>
                            <option value="zh">中文</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Section */}
                {activeSection === "security" && (
                  <div className="settings-section" id="settings-security">
                    <h2 className="settings-section-title">Privacy & Security</h2>
                    <p className="settings-section-desc">Manage your privacy and account security settings</p>

                    <div className="settings-group">
                      <div className="settings-security-item">
                        <div className="settings-security-icon">
                          <Shield style={{ width: 20, height: 20, color: "var(--zoom-green)" }} />
                        </div>
                        <div className="settings-security-info">
                          <h4>Two-Factor Authentication</h4>
                          <p>Add extra layer of security to your account</p>
                        </div>
                        <button className="btn btn-sm btn-secondary">Enable</button>
                      </div>
                      <div className="settings-security-item">
                        <div className="settings-security-icon">
                          <Shield style={{ width: 20, height: 20, color: "var(--zoom-blue)" }} />
                        </div>
                        <div className="settings-security-info">
                          <h4>Change Password</h4>
                          <p>Update your account password</p>
                        </div>
                        <button className="btn btn-sm btn-secondary">Change</button>
                      </div>
                      <div className="settings-security-item">
                        <div className="settings-security-icon">
                          <Monitor style={{ width: 20, height: 20, color: "var(--zoom-text-secondary)" }} />
                        </div>
                        <div className="settings-security-info">
                          <h4>Active Sessions</h4>
                          <p>Manage devices where you&apos;re signed in</p>
                        </div>
                        <button className="btn btn-sm btn-secondary">Manage</button>
                      </div>
                    </div>
                  </div>
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

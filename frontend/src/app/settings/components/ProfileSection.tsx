"use client";

import type { User as UserType } from "@/lib/types";

interface ProfileSectionProps {
  user: UserType | null;
  name: string;
  setName: (name: string) => void;
  avatar: string;
  setAvatar: (avatar: string) => void;
  plan: string;
  setPlan: (plan: string) => void;
  showAvatarPicker: boolean;
  setShowAvatarPicker: (show: boolean) => void;
  presetAvatars: string[];
}

export default function ProfileSection({
  user,
  name,
  setName,
  avatar,
  setAvatar,
  plan,
  setPlan,
  showAvatarPicker,
  setShowAvatarPicker,
  presetAvatars,
}: ProfileSectionProps) {
  return (
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
              {presetAvatars.map((av) => (
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
                  <img src={av} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Avatar option" />
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
  );
}

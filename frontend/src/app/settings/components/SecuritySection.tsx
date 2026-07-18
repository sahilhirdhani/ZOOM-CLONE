"use client";

import { Shield, Monitor } from "lucide-react";

export default function SecuritySection() {
  return (
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
  );
}

"use client";

import { Moon, Globe } from "lucide-react";

interface GeneralSectionProps {
  settings: {
    darkMode: boolean;
    language: string;
  };
  handleToggle: (key: any) => void;
  setSettings: (updater: (s: any) => any) => void;
}

export default function GeneralSection({
  settings,
  handleToggle,
  setSettings,
}: GeneralSectionProps) {
  return (
    <div className="settings-section" id="settings-general">
      <h2 className="settings-section-title">General</h2>
      <p className="settings-section-desc">Application appearance and behavior</p>

      <div className="settings-group">
        <div className="settings-toggle-item">
          <div className="settings-toggle-info">
            <h4>
              <Moon 
                style={{ 
                  width: 14, 
                  height: 14, 
                  display: "inline", 
                  verticalAlign: "text-bottom", 
                  marginRight: 6 
                }} 
              />
              Dark Mode
            </h4>
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
              onChange={(e) => setSettings((s: any) => ({ ...s, language: e.target.value }))}
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
  );
}

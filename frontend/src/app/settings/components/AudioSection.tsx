"use client";

import { Mic, Volume2 } from "lucide-react";

interface AudioSectionProps {
  settings: {
    autoJoinAudio: boolean;
    muteOnEntry: boolean;
    noiseSuppression: boolean;
  };
  handleToggle: (key: any) => void;
}

export default function AudioSection({
  settings,
  handleToggle,
}: AudioSectionProps) {
  return (
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
            <select className="form-select" id="settings-mic-select" defaultValue="Default — Internal Microphone">
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
            <select className="form-select" id="settings-speaker-select" defaultValue="Default — Internal Speakers">
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
  );
}

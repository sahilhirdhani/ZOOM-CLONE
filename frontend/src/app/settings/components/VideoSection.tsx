"use client";

import { Camera } from "lucide-react";

interface VideoSectionProps {
  settings: {
    cameraOff: boolean;
    hdVideo: boolean;
    mirrorVideo: boolean;
  };
  handleToggle: (key: any) => void;
}

export default function VideoSection({
  settings,
  handleToggle,
}: VideoSectionProps) {
  return (
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
            <select className="form-select" id="settings-camera-select" defaultValue="Default — FaceTime HD Camera">
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
  );
}

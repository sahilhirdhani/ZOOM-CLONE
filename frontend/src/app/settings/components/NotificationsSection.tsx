"use client";

interface NotificationsSectionProps {
  settings: {
    notifications: boolean;
    emailNotifications: boolean;
    meetingReminders: boolean;
    chatNotifications: boolean;
  };
  handleToggle: (key: any) => void;
}

export default function NotificationsSection({
  settings,
  handleToggle,
}: NotificationsSectionProps) {
  return (
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
  );
}

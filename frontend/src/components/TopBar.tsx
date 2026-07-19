"use client";

import { useState, useEffect } from "react";
import { Search, Bell, HelpCircle, Sun, Moon, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import "./TopBar.css";

interface TopBarProps {
  title?: string;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  avatar?: string;
}

export default function TopBar({ title = "Home", sidebarOpen, onToggleSidebar, avatar }: TopBarProps) {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [userAvatar, setUserAvatar] = useState(avatar || "");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("zoom_theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    if (avatar) {
      setUserAvatar(avatar);
      return;
    }
    const storedUser = localStorage.getItem("zoom_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.avatar) setUserAvatar(parsed.avatar);
      } catch {}
    }
  }, [avatar]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("zoom_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Hamburger for mobile */}
        <button
          className="topbar-hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <Menu />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-search">
        <Search />
        <input type="text" placeholder="Search" />
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn" onClick={toggleTheme} title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}>
          {theme === "light" ? <Moon /> : <Sun />}
        </button>
        <button className="topbar-icon-btn" title="Help">
          <HelpCircle />
        </button>
        <button className="topbar-icon-btn" title="Notifications">
          <Bell />
        </button>

        {/* Profile avatar — visible only on mobile, placed right of notifications */}
        {userAvatar && (
          <div
            className="topbar-profile-mobile"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="topbar-avatar">
              <img src={userAvatar} alt="Profile" />
            </div>

            {showProfileDropdown && (
              <div className="topbar-profile-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileDropdown(false);
                    router.push("/settings");
                  }}
                  className="dropdown-item"
                >
                  Edit Profile
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileDropdown(false);
                    localStorage.removeItem("zoom_user");
                    router.push("/login");
                  }}
                  className="dropdown-item logout"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

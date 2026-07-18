"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  MessageSquare,
  Video,
  Users,
  Phone,
  Calendar,
  Settings,
} from "lucide-react";
import "./Sidebar.css";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/phone", icon: Phone, label: "Phone" },
  { href: "/meetings", icon: Video, label: "Meetings" },
  { href: "/contacts", icon: Users, label: "Contacts" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
];

interface SidebarProps {
  avatar?: string;
}

export default function Sidebar({ avatar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userAvatar, setUserAvatar] = useState(avatar || "");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("zoom_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.avatar) {
        setUserAvatar(parsed.avatar);
      }
    } catch (err) {
      console.error("Failed to parse zoom_user", err);
    }
  }, [avatar, router]);

  return (
    <aside className="sidebar">
      {/* Zoom Logo */}
      <div className="sidebar-logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="#0B5CFF" />
          <path
            d="M7 10.5C7 9.67 7.67 9 8.5 9H15.5C16.33 9 17 9.67 17 10.5V17.5C17 18.33 16.33 19 15.5 19H8.5C7.67 19 7 18.33 7 17.5V10.5Z"
            fill="white"
          />
          <path
            d="M18 12L21 9.5V18.5L18 16V12Z"
            fill="white"
          />
        </svg>
        <span className="logo-text">Zoom</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`sidebar-item ${isActive ? "active" : ""}`}
            >
              <Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <div className="sidebar-bottom-row">
          <Link href="/settings" className={`sidebar-item ${pathname === "/settings" ? "active" : ""}`}>
            <Settings />
            <span>Settings</span>
          </Link>
          {userAvatar && (
            <div 
              className="sidebar-avatar-container" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="sidebar-avatar">
                <img src={userAvatar} alt="Profile" />
              </div>

              {showDropdown && (
                <div className="sidebar-dropdown-menu">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(false);
                      router.push("/settings");
                    }}
                    className="dropdown-item"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(false);
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
      </div>
    </aside>
  );
}

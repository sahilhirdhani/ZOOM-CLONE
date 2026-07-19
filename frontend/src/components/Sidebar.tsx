"use client";

import { useState, useEffect, useCallback } from "react";
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
  X,
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
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ avatar, isOpen, onClose }: SidebarProps) {
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

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    if (onClose) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div
        className={`sidebar-backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "sidebar-mobile-open" : ""}`}>
        {/* Top area: Logo + close button (mobile) */}
        <div className="sidebar-header">
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
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close navigation">
            <X />
          </button>
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
    </>
  );
}

"use client";

import { Search, Bell, HelpCircle } from "lucide-react";

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title = "Home" }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-search">
        <Search />
        <input type="text" placeholder="Search" />
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn" title="Help">
          <HelpCircle />
        </button>
        <button className="topbar-icon-btn" title="Notifications">
          <Bell />
        </button>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Search, Bell, HelpCircle, Sun, Moon } from "lucide-react";
import "./TopBar.css";

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title = "Home" }: TopBarProps) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("zoom_theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

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
      </div>
    </header>
  );
}

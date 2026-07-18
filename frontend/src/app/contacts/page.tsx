"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  Video,
  MoreHorizontal,
  Star,
  MessageSquare,
} from "lucide-react";
import "./contacts.css";

interface Contact {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "online" | "away" | "busy" | "offline";
  starred: boolean;
}

const contacts: Contact[] = [
  { id: 1, name: "Sarah Chen", avatar: "SC", email: "sarah.chen@company.com", phone: "+1 (555) 234-5678", role: "Lead Designer", department: "Design", status: "online", starred: true },
  { id: 2, name: "Alex Johnson", avatar: "AJ", email: "alex.j@company.com", phone: "+1 (555) 345-6789", role: "Frontend Developer", department: "Engineering", status: "online", starred: false },
  { id: 3, name: "Jessica Park", avatar: "JP", email: "jessica.p@company.com", phone: "+1 (555) 456-7890", role: "Product Manager", department: "Product", status: "away", starred: true },
  { id: 4, name: "Michael Torres", avatar: "MT", email: "m.torres@company.com", phone: "+1 (555) 567-8901", role: "Backend Developer", department: "Engineering", status: "busy", starred: false },
  { id: 5, name: "David Kim", avatar: "DK", email: "david.kim@company.com", phone: "+1 (555) 678-9012", role: "DevOps Engineer", department: "Engineering", status: "offline", starred: true },
  { id: 6, name: "Emily Watson", avatar: "EW", email: "e.watson@company.com", phone: "+1 (555) 789-0123", role: "UX Researcher", department: "Design", status: "online", starred: false },
  { id: 7, name: "Lisa Nguyen", avatar: "LN", email: "lisa.n@company.com", phone: "+1 (555) 890-1234", role: "Project Manager", department: "Product", status: "away", starred: false },
  { id: 8, name: "James Wilson", avatar: "JW", email: "j.wilson@company.com", phone: "+1 (555) 901-2345", role: "Full Stack Developer", department: "Engineering", status: "online", starred: false },
  { id: 9, name: "Rachel Green", avatar: "RG", email: "r.green@company.com", phone: "+1 (555) 012-3456", role: "Marketing Manager", department: "Marketing", status: "offline", starred: false },
  { id: 10, name: "Tom Bradley", avatar: "TB", email: "t.bradley@company.com", phone: "+1 (555) 123-4567", role: "QA Engineer", department: "Engineering", status: "busy", starred: false },
  { id: 11, name: "Nina Patel", avatar: "NP", email: "n.patel@company.com", phone: "+1 (555) 234-5679", role: "Data Analyst", department: "Analytics", status: "online", starred: true },
  { id: 12, name: "Chris Lee", avatar: "CL", email: "c.lee@company.com", phone: "+1 (555) 345-6780", role: "Security Engineer", department: "Engineering", status: "offline", starred: false },
];

const statusColors: Record<string, string> = {
  online: "var(--zoom-green)",
  away: "var(--zoom-orange)",
  busy: "var(--zoom-red)",
  offline: "var(--zoom-text-tertiary)",
};

const statusLabels: Record<string, string> = {
  online: "Online",
  away: "Away",
  busy: "In a meeting",
  offline: "Offline",
};

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "starred" | "online">("all");
  const [selectedDept, setSelectedDept] = useState<string>("all");

  const departments = ["all", ...Array.from(new Set(contacts.map((c) => c.department)))];

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "starred" && c.starred) ||
      (filter === "online" && c.status === "online");
    const matchesDept = selectedDept === "all" || c.department === selectedDept;
    return matchesSearch && matchesFilter && matchesDept;
  });

  return (
    <>
      <Sidebar />
      <TopBar title="Contacts" />

      <main className="main-content">
        {/* Header */}
        <div className="contacts-header">
          <div className="contacts-header-left">
            <h1>Contacts</h1>
            <span className="contacts-count">{contacts.length} contacts</span>
          </div>
          <button className="btn btn-md btn-primary" id="contacts-add-btn">
            <UserPlus style={{ width: 14, height: 14 }} />
            Add Contact
          </button>
        </div>

        {/* Filter Bar */}
        <div className="contacts-filters">
          <div className="contacts-search">
            <Search style={{ width: 14, height: 14 }} />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="contacts-search-input"
            />
          </div>
          <div className="contacts-filter-group">
            <div className="contacts-filter-tabs">
              {(["all", "online", "starred"] as const).map((f) => (
                <button
                  key={f}
                  className={`contacts-filter-tab ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                  id={`contacts-filter-${f}`}
                >
                  {f === "starred" && <Star style={{ width: 12, height: 12 }} />}
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <select
              className="form-select contacts-dept-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              id="contacts-dept-select"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === "all" ? "All Departments" : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="contacts-grid">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="contact-card" id={`contact-${contact.id}`}>
              <div className="contact-card-header">
                <div className="contact-card-avatar">
                  <span>{contact.avatar}</span>
                  <div
                    className="contact-status-dot"
                    style={{ background: statusColors[contact.status] }}
                    title={statusLabels[contact.status]}
                  />
                </div>
                {contact.starred && (
                  <Star
                    style={{ width: 14, height: 14, color: "var(--zoom-orange)", fill: "var(--zoom-orange)" }}
                  />
                )}
              </div>
              <div className="contact-card-body">
                <h3 className="contact-card-name">{contact.name}</h3>
                <p className="contact-card-role">{contact.role}</p>
                <span className="contact-card-dept">{contact.department}</span>
                <div className="contact-card-status">
                  <div
                    className="contact-status-indicator"
                    style={{ background: statusColors[contact.status] }}
                  />
                  {statusLabels[contact.status]}
                </div>
              </div>
              <div className="contact-card-actions">
                <button className="contact-action-btn" title="Message">
                  <MessageSquare />
                </button>
                <button className="contact-action-btn" title="Call">
                  <Phone />
                </button>
                <button className="contact-action-btn" title="Video">
                  <Video />
                </button>
                <button className="contact-action-btn" title="Email">
                  <Mail />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="empty-state">
            <Search />
            <p>No contacts match your search</p>
          </div>
        )}
      </main>
    </>
  );
}

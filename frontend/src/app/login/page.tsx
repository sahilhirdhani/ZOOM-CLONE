"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Video, Shield, User, Mail, Sparkles, Key } from "lucide-react";
import { signUp, logIn } from "@/lib/api";
import "./login.css";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
];

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [plan, setPlan] = useState("Basic");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("zoom_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (isSignUp && !name) {
      setError("Name is required");
      return;
    }

    try {
      if (isSignUp) {
        // Sign Up
        const user = await signUp({
          name,
          email,
          password,
          plan,
          avatar: selectedAvatar,
        });
        localStorage.setItem("zoom_user", JSON.stringify(user));
        router.push("/");
      } else {
        // Sign In
        const user = await logIn({
          email,
          password,
        });
        localStorage.setItem("zoom_user", JSON.stringify(user));
        router.push("/");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const errMsg = err.response?.data?.detail || "Authentication failed. Please try again.";
      setError(errMsg);
    }
  };

  return (
    <div className="login-container">
      {/* Background gradients */}
      <div className="bg-glow bg-glow-blue" />
      <div className="bg-glow bg-glow-purple" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <svg width="40" height="40" viewBox="0 0 28 28" fill="none">
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

        {/* Title */}
        <div className="login-header">
          <h2>{isSignUp ? "Create your account" : "Sign in to Zoom"}</h2>
          <p>{isSignUp ? "Get started with your free or paid plan today." : "Enter your details to access your workspace."}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}

          {isSignUp && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  placeholder="Sahil Hirdhani"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Key className="input-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <>
              {/* Plan Selection */}
              <div className="form-group">
                <label className="form-label">Select Plan</label>
                <div className="plan-selector">
                  {["Basic", "Pro", "Business"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlan(p)}
                      className={`plan-option ${plan === p ? "selected" : ""}`}
                    >
                      <Shield className="plan-icon" />
                      <span>{p}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar Selection */}
              <div className="form-group">
                <label className="form-label">Choose Avatar</label>
                <div className="avatar-selector">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`avatar-option ${selectedAvatar === av ? "selected" : ""}`}
                    >
                      <img src={av} alt="Avatar option" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button type="submit" className="login-submit-btn">
            <Sparkles className="btn-icon" />
            <span>{isSignUp ? "Sign Up" : "Sign In"}</span>
          </button>
        </form>

        {/* Toggle link */}
        <div className="login-footer">
          <p>
            {isSignUp ? "Already have an account?" : "New to Zoom?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="toggle-auth-btn"
            >
              {isSignUp ? "Sign In" : "Create an Account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

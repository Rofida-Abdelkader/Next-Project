"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: "📊" },
    { href: "/products", label: "Products", icon: "📦" },
    { href: "/categories", label: "Categories", icon: "🏷️" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 260 : 72,
          background: "var(--bg-sidebar)",
          borderRight: "1px solid rgba(148,163,184,0.1)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s ease",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: sidebarOpen ? "24px 20px" : "24px 16px",
            borderBottom: "1px solid rgba(148,163,184,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            🛒
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16 }}>ShopAdmin</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>E-Commerce Panel</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 8px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: sidebarOpen ? "10px 16px" : "10px 16px",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: isActive ? "var(--text-sidebar-active)" : "var(--text-sidebar)",
                  background: isActive ? "var(--bg-sidebar-active)" : "transparent",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 14,
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            padding: 16,
            background: "transparent",
            border: "none",
            borderTop: "1px solid rgba(148,163,184,0.1)",
            color: "#64748b",
            cursor: "pointer",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </aside>

      {/* Main Area */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 260 : 72, transition: "margin-left 0.3s ease" }}>
        {/* Top Bar */}
        <header
          style={{
            height: 64,
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
              {navItems.find((n) => n.href === pathname)?.label || "Dashboard"}
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "1px solid var(--border-color)",
                background: "var(--bg-primary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                transition: "all 0.2s",
              }}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {/* User Info */}
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>
                  {user.name}
                </span>
              </div>
            )}

            {/* Logout */}
            <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: 12 }}>
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ padding: 24, minHeight: "calc(100vh - 64px)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

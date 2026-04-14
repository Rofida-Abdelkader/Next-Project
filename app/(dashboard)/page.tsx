"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type StatsData = {
  totalProducts: number;
  outOfStock: number;
  totalCategories: number;
  productsByCategory: Array<{ name: string; count: number }>;
};

export default function DashboardHomePage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load stats", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="animate-pulse flex items-center justify-center min-h-[50vh] text-var(--text-muted)">Loading dashboard data...</div>;
  }

  if (!stats) {
    return <div className="text-var(--danger)">Failed to load data.</div>;
  }

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Total Products
              </p>
              <h3 style={{ fontSize: "36px", fontWeight: 800, color: "var(--text-primary)", marginTop: "8px" }}>
                {stats.totalProducts}
              </h3>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "var(--accent)" }}>
              📦
            </div>
          </div>
        </div>

        <div className="stat-card">
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Out of Stock
              </p>
              <h3 style={{ fontSize: "36px", fontWeight: 800, color: "var(--danger)", marginTop: "8px" }}>
                {stats.outOfStock}
              </h3>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "var(--danger)" }}>
              ⚠️
            </div>
          </div>
        </div>

        <div className="stat-card">
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Categories
              </p>
              <h3 style={{ fontSize: "36px", fontWeight: 800, color: "var(--text-primary)", marginTop: "8px" }}>
                {stats.totalCategories}
              </h3>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(34, 197, 94, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "var(--success)" }}>
              🏷️
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px", color: "var(--text-primary)" }}>
          Products per Category
        </h3>
        {stats.productsByCategory.length > 0 ? (
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.productsByCategory}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: 'var(--bg-tertiary)'}}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
                <Legend />
                <Bar dataKey="count" name="Number of Products" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            No category data available to display.
          </div>
        )}
      </div>
    </div>
  );
}

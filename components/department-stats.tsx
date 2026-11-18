"use client";
import { useEffect, useState } from "react";
import { Activity, FileText, Heart, TrendingUp } from "lucide-react";
type Stats = {
  total: number;
  today: number;
  reactions: number;
  moods: { mood: string; count: number }[];
  connected: boolean;
};
const empty: Stats = {
  total: 0,
  today: 0,
  reactions: 0,
  moods: [],
  connected: false,
};
export function DepartmentStats() {
  const [stats, setStats] = useState<Stats>(empty);
  useEffect(() => {
    let active = true;
    const load = () =>
      fetch("/api/stats", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (active) setStats(d);
        })
        .catch(() => undefined);
    load();
    const timer = window.setInterval(load, 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);
  const metrics = [
    {
      label: "OMENS ON FILE",
      value: stats.total.toLocaleString(),
      icon: FileText,
    },
    {
      label: "ISSUED TODAY",
      value: stats.today.toLocaleString(),
      icon: TrendingUp,
    },
    {
      label: "COLLECTIVE NODS",
      value: stats.reactions.toLocaleString(),
      icon: Heart,
    },
  ];
  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <div>
          <p className="mb-2 font-mono text-[9px] tracking-[.22em] text-[#a47d55]">
            04 / DEPARTMENTAL INTELLIGENCE
          </p>
          <h2 className="font-display text-3xl md:text-4xl">
            The numbers are strange.
          </h2>
        </div>
        <span className="flex items-center gap-2 font-mono text-[8px] tracking-[.15em] text-[#8f9a78]">
          <Activity size={12} />{" "}
          {stats.connected ? "LIVE ARCHIVE" : "DEMO / OFFLINE"}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="border hairline bg-[#292a24] p-5">
            <div className="flex items-center justify-between text-[#a47d55]">
              <span className="font-mono text-[8px] tracking-[.16em]">
                {label}
              </span>
              <Icon size={15} />
            </div>
            <p className="mt-5 font-display text-4xl text-[#e8e1d3]">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 border hairline bg-[#292a24] p-5">
        <p className="mb-4 font-mono text-[8px] tracking-[.16em] text-[#a47d55]">
          MOST COMMON STATES OF EXISTENCE
        </p>
        {stats.moods.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {stats.moods.map((m, i) => (
              <div key={m.mood}>
                <div className="mb-1 flex justify-between font-mono text-[9px] text-[#c9c3b6]">
                  <span>{m.mood}</span>
                  <span>{m.count}</span>
                </div>
                <div className="h-1 bg-[#414239]">
                  <div
                    className="h-1 bg-[#879174]"
                    style={{
                      width: `${Math.max(4, (m.count / (stats.moods[0]?.count || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#898679]">
            The department is waiting for its first field reports.
          </p>
        )}
      </div>
    </div>
  );
}

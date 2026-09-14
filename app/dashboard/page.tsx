"use client";

import { useEffect, useState } from "react";
import { fetchOverrides, fetchSettings } from "@/lib/data";
import { getYearSchedule, Override, ScheduleSettings } from "@/lib/schedule";
import YearCalendar from "@/components/YearCalendar";

export default function DashboardPage() {
  const [settings, setSettings] = useState<ScheduleSettings | null>(null);
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    Promise.all([fetchSettings(), fetchOverrides()]).then(([s, o]) => {
      setSettings(s);
      setOverrides(o);
    });
  }, []);

  if (!settings) {
    return <p className="pt-24 text-center text-ink/40">Betöltés…</p>;
  }

  const days = getYearSchedule(year, settings, overrides);
  const meDays = days.filter((d) => d.owner === "me").length;
  const ritaDays = days.length - meDays;

  return (
    <div className="pt-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setYear((y) => y - 1)}
          className="text-ink/40 hover:text-ink"
          aria-label="Előző év"
        >
          ←
        </button>
        <h1 className="font-serif text-lg text-ink">{year}</h1>
        <button
          onClick={() => setYear((y) => y + 1)}
          className="text-ink/40 hover:text-ink"
          aria-label="Következő év"
        >
          →
        </button>
      </div>

      <div className="mb-8 flex justify-center gap-8 text-center">
        <div>
          <p className="font-serif text-2xl text-clay">{meDays}</p>
          <p className="text-xs text-ink/45">{settings.ownerNames.me}</p>
        </div>
        <div>
          <p className="font-serif text-2xl text-teal">{ritaDays}</p>
          <p className="text-xs text-ink/45">{settings.ownerNames.rita}</p>
        </div>
      </div>

      <YearCalendar days={days} />
    </div>
  );
}

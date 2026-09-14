"use client";

import { useEffect, useState } from "react";
import { fetchOverrides, fetchSettings } from "@/lib/data";
import { formatISODate, getOwnerForDate, Override, ScheduleSettings } from "@/lib/schedule";

export default function HomePage() {
  const [settings, setSettings] = useState<ScheduleSettings | null>(null);
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [selectedDate, setSelectedDate] = useState(formatISODate(new Date()));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSettings(), fetchOverrides()]).then(([s, o]) => {
      setSettings(s);
      setOverrides(o);
      setLoading(false);
    });
  }, []);

  if (loading || !settings) {
    return <p className="pt-24 text-center text-ink/40">Betöltés…</p>;
  }

  const { owner, overridden, note } = getOwnerForDate(selectedDate, settings, overrides);
  const ownerLabel = owner === "me" ? settings.ownerNames.me : settings.ownerNames.rita;
  const ownerColor = owner === "me" ? "clay" : "teal";

  return (
    <div className="flex flex-col items-center pt-16 text-center">
      <p className="mb-1 text-sm text-ink/50">Válassz egy dátumot</p>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="mb-10 rounded-md border border-line bg-white px-3 py-2 text-ink"
      />

      <div
        className={`flex h-40 w-40 flex-col items-center justify-center rounded-full border-2 ${
          ownerColor === "clay" ? "border-clay" : "border-teal"
        }`}
      >
        <span className={`dot mb-2 ${ownerColor === "clay" ? "bg-clay" : "bg-teal"}`} />
        <p className="font-serif text-xl text-ink">{ownerLabel}</p>
      </div>

      {overridden && (
        <p className="mt-6 text-sm text-ink/50">
          Ez egy rendkívüli csere{note ? `: ${note}` : "."}
        </p>
      )}

      <p className="mt-10 text-xs text-ink/40">
        A váltás minden vasárnap este történik.
      </p>
    </div>
  );
}

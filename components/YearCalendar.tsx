import { Owner } from "@/lib/schedule";

interface DaySchedule {
  date: string;
  owner: Owner;
  overridden: boolean;
}

const MONTH_NAMES = [
  "Január", "Február", "Március", "Április", "Május", "Június",
  "Július", "Augusztus", "Szeptember", "Október", "November", "December",
];

export default function YearCalendar({ days }: { days: DaySchedule[] }) {
  const byMonth: DaySchedule[][] = Array.from({ length: 12 }, () => []);
  for (const d of days) {
    const monthIndex = Number(d.date.slice(5, 7)) - 1;
    byMonth[monthIndex].push(d);
  }

  return (
    <div className="space-y-5">
      {byMonth.map((monthDays, i) => (
        <div key={i}>
          <p className="mb-1.5 text-xs text-ink/45">{MONTH_NAMES[i]}</p>
          <div className="flex flex-wrap gap-1.5">
            {monthDays.map((d) => (
              <span
                key={d.date}
                title={d.date}
                className={`dot ${d.owner === "me" ? "bg-clay" : "bg-teal"} ${
                  d.overridden ? "ring-2 ring-offset-1 ring-ink/30" : ""
                }`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

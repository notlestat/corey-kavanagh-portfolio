import { useEffect, useState } from "react";

const places = [
  { name: "London", zone: "Europe/London" },
  { name: "New Zealand", zone: "Pacific/Auckland" },
] as const;

function timeIn(zone: string, now: Date) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
}

/** The two places from the footer, each with its current local time.
    The server renders the names alone, so the page reads correctly before
    hydration and without JavaScript. Times appear once the browser knows them. */
export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = new Date();
      setNow(current);
      // Wake on the next minute boundary instead of polling every second.
      timer = setTimeout(tick, 60_000 - (current.getSeconds() * 1000 + current.getMilliseconds()) + 50);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return <p className="live-clock">
    {places.map(place => <span key={place.zone}>
      {place.name}
      {now && <time dateTime={now.toISOString()}>{timeIn(place.zone, now)}</time>}
    </span>)}
  </p>;
}

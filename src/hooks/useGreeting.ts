import { useEffect, useState } from "react";

function greetingForHour(hour: number): string {
  if (hour >= 5 && hour < 10) return "Good morning";
  if (hour >= 10 && hour < 14) return "Good afternoon";
  if (hour >= 14 && hour < 18) return "Good evening";
  return "Good night";
}

export function useGreeting(): string {
  const [greeting, setGreeting] = useState(() => greetingForHour(new Date().getHours()));

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(greetingForHour(new Date().getHours()));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return greeting;
}

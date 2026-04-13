import { Countdown } from "../ui/Countdown";

type CountdownToMidnightProps = {
  className?: string;
};

export function CountdownToMidnight({ className }: CountdownToMidnightProps) {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const initialSeconds = Math.max(
    0,
    Math.floor((midnight.getTime() - now.getTime()) / 1000),
  );

  return <Countdown initialSeconds={initialSeconds} className={className} />;
}

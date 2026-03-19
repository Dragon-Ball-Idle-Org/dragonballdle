import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex h-full flex-col items-center justify-center gap-3">
      <Link
        href="https://dragonballdle.site/en-us"
        className="flex items-center gap-10 min-w-130 p-3 bg-primary border-2 border-orange-600 rounded-2xl cursor-pointer transition-all hover:scale-110"
      >
        <div className="px-5">
          <h1 className="font-display text-9xl">?</h1>
        </div>
        <div className="flex flex-col items-start">
          <h3 className="text-5xl font-display">Classic</h3>
          <span>Guess the daily character</span>
        </div>
      </Link>

      <Link
        href=""
        className="flex items-center gap-10 min-w-130 p-3 bg-zinc-300 border-2 border-zinc-600 rounded-2xl cursor-pointer transition-all hover:scale-110"
      >
        <div className="px-5">
          <h1 className="font-display text-9xl">X</h1>
        </div>
        <div className="flex flex-col items-start">
          <h3 className="text-5xl font-display">In progress...</h3>
          <span>A new game is coming...</span>
        </div>
      </Link>
    </main>
  );
}

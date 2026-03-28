import { ReactNode } from "react";

export function MainContainer({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-4 w-full max-w-360 my-3 mx-auto p-3">
      {children}
    </main>
  );
}

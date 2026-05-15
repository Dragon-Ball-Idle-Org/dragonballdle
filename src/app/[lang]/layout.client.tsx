"use client";

export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 justify-center w-full">
      <div className="w-full max-w-285 px-3 flex flex-col flex-1">
        {children}
      </div>
    </div>
  );
}

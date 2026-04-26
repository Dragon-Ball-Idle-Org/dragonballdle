"use client";

import { Modal } from "@/components/ui/Modal";

type ChangelogVersion = {
  id: string;
  date: string;
  title: string;
  items: string[];
};

type ChangelogModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  versions: ChangelogVersion[];
};

export function ChangelogModal({
  isOpen,
  onClose,
  title,
  versions,
}: ChangelogModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="flex flex-col gap-8 pt-4 pb-2 px-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
        {versions.map((version, vIndex) => (
          <div
            key={version.id}
            className={`relative pl-6 border-l-2 ${vIndex === versions.length - 1 ? "border-transparent" : "border-zinc-800"}`}
          >
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] border-2 border-zinc-950" />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl font-display text-white tracking-wide">
                  {version.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    v{version.id}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {version.date}
                  </span>
                </div>
              </div>

              <ul className="flex flex-col gap-2">
                {version.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex gap-2 text-sm text-zinc-400 leading-relaxed"
                  >
                    <span className="text-orange-500 select-none mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

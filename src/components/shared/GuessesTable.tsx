"use client";

import { GuessStatus } from "@/types/guess";
import { cn } from "@/utils/cn";
import { ArrowFatDownIcon, ArrowFatUpIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

type GuessImageCell = {
  imgSrc: string;
  alt: string;
};

type GuessCell = {
  value: string;
  status: GuessStatus;
};

type GuessesTableProps<T extends string> = {
  headers: T[];
  guesses: Record<T, GuessImageCell | GuessCell>[];
};

function isImageCell(cell: GuessImageCell | GuessCell): cell is GuessImageCell {
  return "imgSrc" in cell;
}

function isGuessCell(cell: GuessImageCell | GuessCell): cell is GuessCell {
  return "value" in cell;
}

export function GuessesTable<T extends string>({
  headers,
  guesses,
}: GuessesTableProps<T>) {
  const getCellClassName = (cell: GuessImageCell | GuessCell) => {
    if (isImageCell(cell)) {
      return "bg-cover bg-center bg-no-repeat bg-white shadow-[inset_0_0_0_1px_#00000024]";
    }

    return cn(
      cell.status === GuessStatus.CORRECT && "bg-green-600",
      cell.status === GuessStatus.PARTIAL && "bg-amber-600",
      cell.status === GuessStatus.WRONG && "bg-red-600",
      cell.status === GuessStatus.OLDEST && "bg-red-600",
      cell.status === GuessStatus.NEWEST && "bg-red-600",
      "text-center text-sm font-bold text-shadow-[1px_1px_3px_#000000] p-1 whitespace-normal wrap-anywhere",
    );
  };

  return (
    <>
      <div className="relative grid grid-cols-8 justify-start gap-8 w-full mt-0 mb-0.5 z-10">
        {headers.map((header) => (
          <span
            key={header}
            className={cn(
              "w-22 h-5 flex items-end justify-center",
              "text-center pb-1 text-xs font-semibold text-shadow-[2px_2px_3px_#000000]",
              "border-b-3 border-white rounded-lg",
            )}
          >
            {header}
          </span>
        ))}
      </div>
      <div className="block w-full relative z-10 overflow-visible">
        {guesses.map((guess, i) => (
          <div
            key={i}
            className="grid grid-cols-8 gap-3 items-stretch w-max my-3"
          >
            <AnimatePresence mode="popLayout">
              {headers.map((header, i) => {
                const cell = guess[header];

                return (
                  <motion.div
                    key={`${i}_${header}`}
                    initial={{ opacity: 0, translateY: -12, scale: 0.98 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className={cn(
                      "w-22 h-22 flex flex-wrap items-center justify-center overflow-hidden",
                      "relative border border-white rounded-xl",
                      getCellClassName(cell),
                    )}
                  >
                    {isImageCell(cell) && (
                      <Image
                        src={cell.imgSrc}
                        alt={cell.alt}
                        width={85}
                        height={85}
                        className=""
                      />
                    )}
                    {isGuessCell(cell) && (
                      <>
                        {cell.status === GuessStatus.OLDEST && (
                          <span className="absolute inset-0 flex items-center justify-center text-black/80 pointer-events-none select-none">
                            <ArrowFatDownIcon
                              weight="fill"
                              className="w-full h-full"
                            />
                          </span>
                        )}
                        {cell.status === GuessStatus.NEWEST && (
                          <span className="absolute inset-0 flex items-center justify-center text-black/80 pointer-events-none select-none">
                            <ArrowFatUpIcon
                              weight="fill"
                              className="w-full h-full"
                            />
                          </span>
                        )}
                        <span className="z-10">{cell.value}</span>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </>
  );
}

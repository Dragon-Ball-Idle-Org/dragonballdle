"use client";

import { GuessStatus } from "@/features/game-engine/types/guess";
import { cn } from "@/utils/cn";
import { ArrowFatDownIcon, ArrowFatUpIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip } from "../ui/Tooltip";
import { useAutoFontSize } from "@/hooks/useAutoFontSize";
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
  headers: { value: T; label: string }[];
  guesses: (Record<T, GuessImageCell | GuessCell> & { id: string })[];
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
      cell.status === GuessStatus.MOVIE_MISMATCH && "bg-red-600",
      "text-center font-bold text-xs sm:text-sm text-shadow-[1px_1px_3px_#000000] p-1 whitespace-normal overflow-wrap-anywhere word-break-break-word",
    );
  };

  return (
    <div
      className={cn(
        "relative grid justify-start gap-1 md:gap-2",
        "w-full mt-0 mb-0.5 overflow-x-visible break",
        "[--col-size:5rem] sm:[--col-size:5.5rem]",
      )}
      style={{
        gridTemplateColumns: `repeat(${headers.length}, var(--col-size))`,
      }}
    >
      {headers.map((header) => (
        <span
          key={header.value}
          className={cn(
            "w-20 sm:w-22 h-5 flex items-end justify-center",
            "text-center pb-1 text-xs font-semibold text-shadow-[2px_2px_3px_#000000]",
            "border-b-3 border-white rounded-lg",
          )}
        >
          {header.label}
        </span>
      ))}
      <AnimatePresence mode="popLayout">
        {guesses.map((guess) =>
          headers.map((header, i) => {
            const cell = guess[header.value];
            const uniqueKey = `${guess.id}_${header.value}`;

            return (
              <GuessCell
                key={uniqueKey}
                cell={cell}
                i={i}
                getCellClassName={getCellClassName}
              />
            );
          }),
        )}
      </AnimatePresence>
    </div>
  );
}

function GuessCell({
  cell,
  i,
  getCellClassName,
}: {
  cell: GuessImageCell | GuessCell;
  i: number;
  getCellClassName: (cell: GuessImageCell | GuessCell) => string;
}) {
  const textRef = useAutoFontSize(8, 1);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 12, scale: 0.98 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ delay: i * 0.3, duration: 0.3 }}
      className={cn(
        "w-20 h-20 sm:w-22 sm:h-22 flex flex-wrap items-center justify-center overflow-hidden",
        "relative border border-white rounded-xl",
        getCellClassName(cell),
      )}
    >
      {isImageCell(cell) && (
        <Tooltip content={cell.alt}>
          <Image src={cell.imgSrc} alt={cell.alt} width={85} height={85} />
        </Tooltip>
      )}
      {isGuessCell(cell) && (
        <>
          {cell.status === GuessStatus.OLDEST && (
            <span className="absolute inset-0 flex items-center justify-center text-black/80 pointer-events-none select-none">
              <ArrowFatDownIcon weight="fill" className="w-full h-full" />
            </span>
          )}
          {cell.status === GuessStatus.NEWEST && (
            <span className="absolute inset-0 flex items-center justify-center text-black/80 pointer-events-none select-none">
              <ArrowFatUpIcon weight="fill" className="w-full h-full" />
            </span>
          )}
          {cell.status === GuessStatus.MOVIE_MISMATCH && (
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <Image
                src="/assets/tira_cinema.svg"
                width={88}
                height={88}
                className="w-full h-full object-cover opacity-80"
                alt=""
              />
            </span>
          )}
          <span
            ref={textRef}
            className="w-full h-full flex items-center justify-center z-10 leading-[1.05]"
          >
            {cell.value}
          </span>
        </>
      )}
    </motion.div>
  );
}

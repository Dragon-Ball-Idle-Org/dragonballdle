import { cn } from "@/utils/cn";
import { Accordion } from "@base-ui/react";
import { ReactNode } from "react";

type Item = {
  header: string;
  content: ReactNode;
};

type GlassAccordionProps = {
  items: Item[];
  className: string;
};

export default function GlassAccordion({
  items,
  className,
}: GlassAccordionProps) {
  return (
    <Accordion.Root
      className={cn(
        "bg-black/3 border border-white/25 rounded-xl overflow-hidden text-left shadow-[0_6px_16px_#0000002e]",
        className,
      )}
    >
      {items.map((item, i) => (
        <Accordion.Item key={i}>
          <Accordion.Header className="group relative flex items-center gap-2 select-none py-2 px-3.5 text-sm font-bold bg-black/30">
            <Accordion.Trigger
              className={cn(
                "w-full flex items-center justify-between cursor-pointer text-shadow-[2px_2px_4px_#000000]",
                "after:content-['▼'] after:ml-auto after:text-xs after:transition-all after:ease-linear",
                "group-data-open:after:rotate-180",
              )}
            >
              {item.header}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="h-(--accordion-panel-height) bg-black/18 overflow-hidden transition-[height] ease-out data-ending-style:h-0 data-starting-style:h-0">
            {item.content}
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

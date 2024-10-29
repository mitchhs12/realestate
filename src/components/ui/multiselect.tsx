"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import * as Checkbox from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  className?: string;
  items: { id: number; label: string }[];
  selectedItems: number[];
  onChange: (selectedIds: number[]) => void;
  position?: "popper";
}

const MultiSelect = ({ className, items, selectedItems, onChange, position = "popper" }: MultiSelectProps) => {
  const handleSelectItem = (itemId: number) => {
    onChange(selectedItems.includes(itemId) ? selectedItems.filter((id) => id !== itemId) : [...selectedItems, itemId]);
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex items-center justify-between w-full h-9 px-3 py-2 text-sm rounded-md border border-input bg-transparent shadow-sm focus:outline-none">
          {selectedItems.length > 0 ? `Selected: ${selectedItems.length}` : "Select Items"}
          <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={cn(
            "relative z-50 max-h-96 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            position === "popper" &&
              "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            className
          )}
          sideOffset={5}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectItem(item.id)}
            >
              <Checkbox.Root
                className="flex items-center justify-center w-4 h-4 mr-2 rounded border border-gray-300"
                checked={selectedItems.includes(item.id)}
              >
                <Checkbox.Indicator>
                  <CheckIcon className="w-3 h-3" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default MultiSelect;

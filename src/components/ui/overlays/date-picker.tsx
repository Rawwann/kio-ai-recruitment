"use client";

import * as React from "react";
import { format } from "date-fns";
import { IconCalendar } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/forms/button";
import { Calendar } from "@/components/ui/overlays/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/overlays/popover";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DatePickerCustom({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <div className="flex items-center justify-between w-full">
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <IconCalendar className="mr-2 h-4 w-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          disabled={(date) => date > new Date() || date < new Date("1900-01-01")} //
        />
      </PopoverContent>
    </Popover>
  );
}
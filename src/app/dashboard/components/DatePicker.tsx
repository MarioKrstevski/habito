"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useAppState } from "@/hooks/useAppState";
import { useState } from "react";

export function DatePicker() {
  const { appDate, setAppDate } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-fit min-w-[130px] pl-3 text-left font-normal",
            !appDate && "text-muted-foreground"
          )}
        >
          {appDate ? (
            formatDate(appDate, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={appDate ?? undefined}
          onSelect={(date) => {
            console.log(date);
            if (
              date &&
              date.toDateString() === new Date().toDateString()
            ) {
              const currentDate = new Date();
              setAppDate(
                new Date(
                  currentDate.setHours(
                    currentDate.getHours(),
                    currentDate.getMinutes(),
                    currentDate.getSeconds()
                  )
                )
              );
            } else {
              setAppDate(date ?? null);
            }
            setIsOpen(false);
          }}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          //   initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

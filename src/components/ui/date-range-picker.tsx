"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const DatePickerWithRange = ({
  className,
  dateRange,
  onDateRangeChange,
}: React.HTMLAttributes<HTMLDivElement> & {
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
}) => {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd MMM yyyy", { locale: es })} -{" "}
                  {format(dateRange.to, "dd MMM yyyy", { locale: es })}
                </>
              ) : (
                format(dateRange.from, "dd MMM yyyy", { locale: es })
              )
            ) : (
              <span>Seleccionar rango de fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          sideOffset={5}
          collisionPadding={10}
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from || new Date()}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
            locale={es}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

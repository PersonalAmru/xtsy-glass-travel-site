import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 pointer-events-auto bg-background rounded-xl border border-border shadow-lg overflow-hidden", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center h-10 px-12",
        caption_label: "text-base font-semibold text-foreground tracking-tight",
        nav: "flex items-center gap-2",
        button_previous: cn(
          "inline-flex items-center justify-center rounded-full",
          "h-9 w-9 sm:h-11 sm:w-11 min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px]",
          "text-muted-foreground hover:text-foreground",
          "bg-muted/50 hover:bg-muted active:bg-muted/80",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "absolute left-0 cursor-pointer touch-manipulation"
        ),
        button_next: cn(
          "inline-flex items-center justify-center rounded-full",
          "h-9 w-9 sm:h-11 sm:w-11 min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px]",
          "text-muted-foreground hover:text-foreground",
          "bg-muted/50 hover:bg-muted active:bg-muted/80",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "absolute right-0 cursor-pointer touch-manipulation"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex mb-1",
        weekday: cn(
          "text-muted-foreground font-medium text-xs uppercase tracking-wider",
          "w-10 h-8 flex items-center justify-center"
        ),
        week: "flex w-full",
        day: cn(
          "relative p-0.5 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-primary/10 [&:has([aria-selected])]:rounded-lg",
          "first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg"
        ),
        day_button: cn(
          "inline-flex items-center justify-center rounded-lg",
          "w-10 h-10 p-0 font-normal text-sm",
          "text-foreground hover:bg-muted hover:text-foreground",
          "transition-colors duration-150 ease-in-out",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          "aria-selected:opacity-100"
        ),
        range_end: "day-range-end",
        selected: cn(
          "bg-primary text-primary-foreground font-semibold",
          "hover:bg-primary hover:text-primary-foreground",
          "focus:bg-primary focus:text-primary-foreground",
          "shadow-sm"
        ),
        today: cn(
          "bg-accent/50 text-accent-foreground font-semibold",
          "ring-1 ring-accent"
        ),
        outside: cn(
          "day-outside text-muted-foreground/40",
          "aria-selected:bg-primary/30 aria-selected:text-primary-foreground/70"
        ),
        disabled: "text-muted-foreground/30 cursor-not-allowed hover:bg-transparent",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        // Dropdown styles for Apple-grade experience
        dropdowns: "flex gap-2 justify-center",
        dropdown: cn(
          "relative inline-flex items-center gap-1 px-3 py-1.5 rounded-lg",
          "bg-muted/50 hover:bg-muted text-foreground font-medium text-sm",
          "border border-border cursor-pointer transition-colors"
        ),
        dropdown_root: "relative",
        caption_dropdowns: "flex gap-2 justify-center items-center",
        years_dropdown: "appearance-none bg-transparent cursor-pointer pr-6",
        months_dropdown: "appearance-none bg-transparent cursor-pointer pr-6",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...chevronProps }) => {
          // Larger icons (24px nav, 16px dropdowns) for better visibility
          if (orientation === 'left') return <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" {...chevronProps} />;
          if (orientation === 'right') return <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" {...chevronProps} />;
          if (orientation === 'up') return <ChevronUp className="h-4 w-4" {...chevronProps} />;
          return <ChevronDown className="h-4 w-4" {...chevronProps} />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

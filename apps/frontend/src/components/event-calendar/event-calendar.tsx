import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { id } from "date-fns/locale";
import {
  CalendarSync,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "lucide-react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  addHoursToDate,
  AgendaDaysToShow,
  EventGap,
  EventHeight,
  MonthView,
  WeekCellsHeight,
  WeekView,
  DayView,
  AgendaView,
  type CalendarEvent,
  type CalendarView,
} from "./src";
import { CalendarDndProvider } from "./calendar-dnd-context";
import { EventDialog } from "./event-dialog";

export interface EventCalendarProps {
  events?: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  className?: string;
  initialView?: CalendarView;
}

export function EventCalendar({
  events = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  className,
  initialView = "month",
}: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(initialView);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  // Add keyboard shortcuts for view switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea or contentEditable element or if the event dialog is open
      if (
        isEventDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "m":
          setView("month");
          break;
        case "w":
          setView("week");
          break;
        case "d":
          setView("day");
          break;
        case "a":
          setView("agenda");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEventDialogOpen]);

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === "agenda") {
      // For agenda view, go backward 30 days (a full month)
      setCurrentDate(addDays(currentDate, -AgendaDaysToShow));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === "agenda") {
      // For agenda view, go forward 30 days (a full month)
      setCurrentDate(addDays(currentDate, AgendaDaysToShow));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventSelect = (event: CalendarEvent) => {
    // console.log("Event selected:", event); // Debug log
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleEventCreate = (startTime: Date) => {
    const minutes = startTime.getMinutes();
    const remainder = minutes % 15;
    if (remainder !== 0) {
      startTime.setMinutes(
        remainder < 7.5 ? minutes - remainder : minutes + (15 - remainder)
      );
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);
    }

    const newEvent: CalendarEvent = {
      _id: "",
      title: "",
      startDate: startTime,
      endDate: addHoursToDate(startTime, 1),
      startHour: format(startTime, "HH:mm"),
      endHour: format(addHoursToDate(startTime, 1), "HH:mm"),
      allDay: false,
    };
    setSelectedEvent(newEvent);
    setIsEventDialogOpen(true);
  };

  const handleEventSave = (event: CalendarEvent) => {
    const exists = events.some((e) => e._id === event._id);

    if (exists) {
      onEventUpdate?.(event);
      toast.info(`Acara "${event.title}" diperbarui.`, {
        description: format(new Date(event.startDate), "MMMM d, yyyy", {
          locale: id,
        }),
      });
    } else {
      onEventAdd?.(event);
      toast.success(`Acara "${event.title}" ditambahkan.`, {
        description: format(new Date(event.startDate), "MMMM d, yyyy", {
          locale: id,
        }),
      });
    }

    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleEventDelete = (eventId: string) => {
    const deletedEvent = events.find((e) => e._id === eventId);
    onEventDelete?.(eventId);
    setIsEventDialogOpen(false);
    setSelectedEvent(null);

    if (deletedEvent) {
      toast.success(`Acara "${deletedEvent.title}" dihapus.`, {
        description: format(new Date(deletedEvent.startDate), "MMMM d, yyyy", {
          locale: id,
        }),
      });
    }
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    onEventUpdate?.(updatedEvent);
    toast.info(`Acara "${updatedEvent.title}" dipindahkan.`, {
      description: format(new Date(updatedEvent.startDate), "MMMM d, yyyy", {
        locale: id,
      }),
    });
  };

  const viewTitle = useMemo(() => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy", { locale: id });
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy", { locale: id });
      } else {
        return `${format(start, "MMM", { locale: id })} - ${format(
          end,
          "MMM yyyy",
          { locale: id }
        )}`;
      }
    } else if (view === "day") {
      return (
        <>
          <span className="min-[480px]:hidden" aria-hidden="true">
            {format(currentDate, "MMM d, yyyy", { locale: id })}
          </span>
          <span className="max-[479px]:hidden min-md:hidden" aria-hidden="true">
            {format(currentDate, "MMMM d, yyyy", { locale: id })}
          </span>
          <span className="max-md:hidden">
            {format(currentDate, "EEEE, d MMMM yyyy", { locale: id })}
          </span>
        </>
      );
    } else if (view === "agenda") {
      // Show the month range for agenda view
      const start = currentDate;
      const end = addDays(currentDate, AgendaDaysToShow - 1);

      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy");
      } else {
        return `${format(start, "MMM", { locale: id })} - ${format(
          end,
          "MMM yyyy",
          { locale: id }
        )}`;
      }
    } else {
      return format(currentDate, "MMMM yyyy", { locale: id });
    }
  }, [currentDate, view]);

  return (
    <>
      <Toaster position="bottom-left" richColors />

      <div
        className="flex flex-col rounded-lg border has-data-[slot=month-view]:flex-1"
        style={
          {
            "--event-height": `${EventHeight}px`,
            "--event-gap": `${EventGap}px`,
            "--week-cells-height": `${WeekCellsHeight}px`,
          } as React.CSSProperties
        }
      >
        <CalendarDndProvider onEventUpdate={handleEventUpdate}>
          <div
            className={cn(
              "flex items-center justify-between p-2 sm:p-4",
              className
            )}
          >
            <div className="flex items-center gap-1 sm:gap-4">
              {/* Tombol Hari Ini */}
              <Button
                variant="outline"
                className="max-[479px]:aspect-square max-[479px]:p-0!"
                onClick={handleToday}
                aria-label="Today"
              >
                <CalendarSync size={16} aria-label="true" />
                <span className="max-[479px]:sr-only">Hari Ini</span>
              </Button>

              <div className="flex items-center sm:gap-2">
                {/* Tombol Sebelum */}
                <Button
                  variant="ghost"
                  className="border"
                  size="icon"
                  onClick={handlePrevious}
                  aria-label="Previous"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>

                {/* Tombol Sesudah */}
                <Button
                  variant="ghost"
                  className="border"
                  size="icon"
                  onClick={handleNext}
                  aria-label="Next"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </div>

              <h2 className="text-sm font-semibold sm:text-lg md:text-xl">
                {viewTitle}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1.5 max-[479px]:h-8">
                    <span>
                      <span className="min-[480px]:hidden" aria-hidden="true">
                        {view.charAt(0).toUpperCase()}
                      </span>
                      <span className="max-[479px]:sr-only">
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                      </span>
                    </span>
                    <ChevronDownIcon
                      className="-me-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-32">
                  <DropdownMenuItem onClick={() => setView("month")}>
                    Month <DropdownMenuShortcut>M</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView("week")}>
                    Week <DropdownMenuShortcut>W</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView("day")}>
                    Day <DropdownMenuShortcut>D</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView("agenda")}>
                    Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Tombol Acara Baru */}
              <Button
                className="max-[479px]:aspect-square max-[479px]:p-0!"
                size="sm"
                onClick={() => {
                  setSelectedEvent(null); // Ensure we're creating a new event
                  setIsEventDialogOpen(true);
                }}
              >
                <PlusIcon size={16} aria-hidden="true" />
                <span className="max-sm:sr-only">Acara baru</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            {/* Tampilan Bulan */}
            {view === "month" && (
              <MonthView
                currentDate={currentDate}
                events={events}
                onEventSelect={handleEventSelect}
                onEventCreate={handleEventCreate}
              />
            )}
            {/* Tampilan Minggu */}
            {view === "week" && (
              <WeekView
                currentDate={currentDate}
                events={events}
                onEventSelect={handleEventSelect}
                onEventCreate={handleEventCreate}
              />
            )}
            {/* Tampilan Hari */}
            {view === "day" && (
              <DayView
                currentDate={currentDate}
                events={events}
                onEventSelect={handleEventSelect}
                onEventCreate={handleEventCreate}
              />
            )}
            {/* Tampilan Agenda */}
            {view === "agenda" && (
              <AgendaView
                currentDate={currentDate}
                events={events}
                onEventSelect={handleEventSelect}
              />
            )}
          </div>

          {/* Dialog Acara Baru */}
          <EventDialog
            event={selectedEvent}
            isOpen={isEventDialogOpen}
            onClose={() => {
              setIsEventDialogOpen(false);
              setSelectedEvent(null);
            }}
            onSave={handleEventSave}
            onDelete={handleEventDelete}
          />
        </CalendarDndProvider>
      </div>
    </>
  );
}

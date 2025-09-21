export type CalendarView = "month" | "week" | "day" | "agenda";

export interface CalendarEvent {
  _id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  startHour: string;
  endHour: string;
  allDay?: boolean;
  color?: EventColor;
  location?: string;
}

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange";

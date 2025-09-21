import { useEffect, useState } from "react";
import { addDays, setHours, setMinutes, subDays } from "date-fns";
import {
  EventCalendar,
  type CalendarEvent,
} from "@/components/event-calendar/src";
import { api } from "@rzkyakbr/libs";
import { type AxiosError } from "axios";
import toast from "react-hot-toast";

// Sample events data with hardcoded times
const sampleEvents: CalendarEvent[] = [
  {
    _id: "1",
    title: "Annual Planning",
    description: "Strategic planning for next year",
    startDate: subDays(new Date(), 24),
    endDate: subDays(new Date(), 23),
    startHour: "00:00",
    endHour: "23:59",
    allDay: true,
    color: "sky",
    location: "Main Conference Hall",
  },
  {
    _id: "2",
    title: "Project Deadline",
    description: "Submit final deliverables",
    startDate: setMinutes(setHours(subDays(new Date(), 9), 13), 0),
    endDate: setMinutes(setHours(subDays(new Date(), 9), 15), 30),
    startHour: "13:00",
    endHour: "15:30",
    allDay: false,
    color: "amber",
    location: "Office",
  },
];

export default function CalendarEventPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // TODO: Ambil data dari API
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await api.get("/calendar-event");
        const data = res.data.data;

        const normalized: CalendarEvent[] = data.map((e: any) => ({
          _id: e._id,
          title: e.title,
          description: e.description,
          startDate: new Date(e.startDate), // <- convert ke Date
          endDate: new Date(e.endDate), // <- convert ke Date
          startHour: e.startHour,
          endHour: e.endHour,
          allDay: e.allDay,
          color: e.color,
          location: e.location,
        }));
        setEvents(normalized);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const handleEventAdd = (event: CalendarEvent) =>
    setEvents((prev) => [...prev, event]);

  const handleEventUpdate = (updatedEvent: CalendarEvent) =>
    setEvents((prev) =>
      prev.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      )
    );

  const handleEventDelete = (eventId: string) =>
    setEvents((prev) => prev.filter((event) => event._id !== eventId));

  return (
    <EventCalendar
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
    />
  );
}

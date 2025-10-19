import { useEffect, useState } from "react";
import {
  EventCalendar,
  type CalendarEvent,
} from "@/components/event-calendar/src";
import { api, setTitle } from "@rzkyakbr/libs";
import { type AxiosError } from "axios";
import toast from "react-hot-toast";

export default function CalendarEventPage() {
  setTitle("Calendar Event - GeoVisit");

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // TODO: Ambil data dari API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get("/calendar-event");
        const data = res.data.data;

        const normalized: CalendarEvent[] = data.map((e: CalendarEvent) => ({
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

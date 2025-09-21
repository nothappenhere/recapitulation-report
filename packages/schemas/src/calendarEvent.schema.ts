import { z } from "zod";

export const CalendarEventSchema = z.object({
  title: z.string().nonempty("Judul acara tidak boleh kosong!"),
  description: z.string().optional().default("-"),
  startDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
    message: "Tanggal mulai tidak boleh kosong / invalid!",
  }),
  endDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
    message: "Tanggal selesai tidak boleh kosong / invalid!",
  }),
  startHour: z.string().optional().default("-"),
  endHour: z.string().optional().default("-"),
  allDay: z.boolean(),
  color: z.enum(
    ["sky", "amber", "violet", "rose", "emerald", "orange"],
    "Warna tidak boleh kosong!"
  ),
  location: z.string().nonempty("Lokasi acara tidak boleh kosong!"),
});

export type TCalendarEvent = z.infer<typeof CalendarEventSchema>;

export const defaultCalendarEventFormValues: TCalendarEvent = {
  title: "",
  description: "",
  startDate: new Date(),
  endDate: new Date(),
  startHour: "",
  endHour: "",
  allDay: false,
  color: "sky",
  location: "",
};

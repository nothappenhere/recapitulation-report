import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ClockIcon, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { EndHour, StartHour, type CalendarEvent, type EventColor } from "./src";
import {
  CalendarEventSchema,
  defaultCalendarEventFormValues,
  type TCalendarEvent,
} from "@rzkyakbr/schemas";
import type { AxiosError } from "axios";
import { api } from "@rzkyakbr/libs";
import toast from "react-hot-toast";
import { SimpleField } from "@/components/form/SimpleField";
import { SelectField } from "@/components/form/SelectField";
import { DateField } from "@/components/form/DateField";
import { CheckboxField } from "@/components/form/CheckboxField";
import { ColorRadioField } from "@/components/form/ColorRadioField";

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

export function EventDialog({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EventDialogProps) {
  const form = useForm<TCalendarEvent>({
    resolver: zodResolver(CalendarEventSchema),
    defaultValues: defaultCalendarEventFormValues,
  });

  const allDay = form.watch("allDay");

  // Debug log to check what event is being passed
  // useEffect(() => {
  //   console.log("EventDialog received event:", event);
  // }, [event]);

  //* Fetch jika sedang edit
  useEffect(() => {
    if (event) {
      const formData: TCalendarEvent = {
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        startHour: event.startHour,
        endHour: event.endHour,
        color: event.color as EventColor,
      };
      form.reset(formData);
    } else {
      form.reset();
    }
  }, [event, form]);

  // const formatTimeForInput = (date: Date) => {
  //   const hours = date.getHours().toString().padStart(2, "0");
  //   const minutes = Math.floor(date.getMinutes() / 15) * 15;
  //   return `${hours}:${minutes.toString().padStart(2, "0")}`;
  // };

  // Memoize time options so they're only calculated once
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = StartHour; hour < EndHour; hour++) {
      // FIX: pakai <, bukan <=
      for (let minute = 0; minute < 60; minute += 10) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const value = `${formattedHour}:${formattedMinute}`;

        // Gunakan format 24 jam Indonesia
        const date = new Date(2000, 0, 1, hour, minute);
        const label = format(date, "HH:mm");

        options.push({ value, label });
      }
    }
    return options;
  }, []); // Empty dependency array ensures this only runs once

  // Updated color options to match types.ts
  const colorOptions: Array<{
    value: EventColor;
    label: string;
    bgClass: string;
    borderClass: string;
  }> = [
    {
      value: "sky",
      label: "Sky",
      bgClass: "bg-sky-400 data-[state=checked]:bg-sky-400",
      borderClass: "border-sky-400 data-[state=checked]:border-sky-400",
    },
    {
      value: "amber",
      label: "Amber",
      bgClass: "bg-amber-400 data-[state=checked]:bg-amber-400",
      borderClass: "border-amber-400 data-[state=checked]:border-amber-400",
    },
    {
      value: "violet",
      label: "Violet",
      bgClass: "bg-violet-400 data-[state=checked]:bg-violet-400",
      borderClass: "border-violet-400 data-[state=checked]:border-violet-400",
    },
    {
      value: "rose",
      label: "Rose",
      bgClass: "bg-rose-400 data-[state=checked]:bg-rose-400",
      borderClass: "border-rose-400 data-[state=checked]:border-rose-400",
    },
    {
      value: "emerald",
      label: "Emerald",
      bgClass: "bg-emerald-400 data-[state=checked]:bg-emerald-400",
      borderClass: "border-emerald-400 data-[state=checked]:border-emerald-400",
    },
    {
      value: "orange",
      label: "Orange",
      bgClass: "bg-orange-400 data-[state=checked]:bg-orange-400",
      borderClass: "border-orange-400 data-[state=checked]:border-orange-400",
    },
  ];

  //* Submit handler: create or update
  const onSubmit = async (values: TCalendarEvent): Promise<void> => {
    const start = new Date(values.startDate);
    const end = new Date(values.endDate);

    if (!values.allDay) {
      const [sh, sm] = values.startHour.split(":").map(Number);
      const [eh, em] = values.endHour.split(":").map(Number);
      start.setHours(sh, sm, 0, 0);
      end.setHours(eh, em, 0, 0);
    } else {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }

    try {
      let data: CalendarEvent;

      if (event?._id) {
        // UPDATE
        const res = await api.put(`/calendar-event/${event._id}`, {
          ...values,
          startDate: start,
          endDate: end,
        });
        data = res.data.data;
      } else {
        // CREATE
        const res = await api.post("/calendar-event", {
          ...values,
          startDate: start,
          endDate: end,
        });
        data = res.data.data;
      }

      onSave({ ...values, _id: data._id });
      form.reset();
      onClose(); // optional: otomatis tutup dialog
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menyimpan data, silakan coba lagi.";
      toast.error(message);
    }
  };

  // TODO: Handler delete setelah dikonfirmasi
  const handleDelete = useCallback(async () => {
    if (!event?._id) return;
    try {
      await api.delete(`/calendar-event/${event._id}`);
      onDelete(event._id);
      form.reset();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menghapus data, silakan coba lagi.";
      toast.error(message);
    }
  }, [event?._id, form, onDelete]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-scroll rounded-r-none">
        <DialogHeader>
          <DialogTitle>{event?._id ? "Edit Acara" : "Buat Acara"}</DialogTitle>
          <DialogDescription className="sr-only">
            {event?._id
              ? "Edit detail acara ini"
              : "Tambahkan acara baru ke kalender"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <div className="grid gap-4 py-4">
              {/* Judul Acara */}
              <div className="*:not-first:mt-1.5">
                <SimpleField
                  control={form.control}
                  name="title"
                  label="Judul Acara"
                  placeholder="Masukan judul acara"
                  tooltip="Masukan nama acara yang singkat dan mudah dikenali."
                />
              </div>

              {/* Deskripsi */}
              <div className="*:not-first:mt-1.5">
                <SimpleField
                  control={form.control}
                  name="description"
                  label="Deskripsi"
                  placeholder="Masukan deskripsi acara"
                  component={<Textarea className="rounded-xs" />}
                  tooltip="Tambahkan detail tambahan tentang acara (opsional)."
                />
              </div>

              <div className="flex gap-4">
                {/* Tanggal Mulai */}
                <div className="flex-1 *:not-first:mt-1.5">
                  <DateField
                    control={form.control}
                    name="startDate"
                    label="Tanggal Mulai"
                    placeholder="Pilih tanggal mulai acara"
                    tooltip="Tanggal pertama acara berlangsung."
                  />
                </div>

                {!allDay && (
                  // Waktu Mulai
                  <div className="*:not-first:mt-1.5">
                    <SelectField
                      control={form.control}
                      name="startHour"
                      label="Waktu Mulai"
                      placeholder="Waktu mulai"
                      icon={ClockIcon}
                      options={timeOptions.map((time: { value: string }) => ({
                        value: time.value,
                        label: time.value,
                      }))}
                      tooltip="Jam dimulainya acara."
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                {/* Tanggal Selesai */}
                <div className="flex-1 *:not-first:mt-1.5">
                  <DateField
                    control={form.control}
                    name="endDate"
                    label="Tanggal Selesai"
                    placeholder="Pilih tanggal selesai acara"
                    tooltip="Tanggal berakhirnya acara."
                  />
                </div>

                {!allDay && (
                  // Waktu Selesai
                  <div className="*:not-first:mt-1.5">
                    <SelectField
                      control={form.control}
                      name="endHour"
                      label="Waktu Selesai"
                      placeholder="Waktu selesai"
                      icon={ClockIcon}
                      options={timeOptions.map((time: { value: string }) => ({
                        value: time.value,
                        label: time.value,
                      }))}
                      tooltip="Jam berakhirnya acara."
                    />
                  </div>
                )}
              </div>

              {/* Sepanjang hari */}
              <div className="*:not-first:mt-1.5">
                <CheckboxField
                  control={form.control}
                  name="allDay"
                  label="Sepanjang hari"
                  tooltip="Centang jika acara berlangsung seharian penuh tanpa jam khusus."
                />
              </div>

              {/* Lokasi */}
              <div className="*:not-first:mt-1.5">
                <SimpleField
                  control={form.control}
                  name="location"
                  label="Lokasi"
                  placeholder="Masukan lokasi acara"
                  tooltip="Tempat acara diadakan, bisa berupa ruangan, alamat, atau lokasi umum."
                />
              </div>

              {/* Warna */}
              <div className="*:not-first:mt-1.5">
                <ColorRadioField
                  control={form.control}
                  name="color"
                  label="Penanda"
                  options={colorOptions}
                  tooltip="Pilih warna untuk membedakan acara ini di kalender."
                />
              </div>
            </div>

            <DialogFooter className="flex-row sm:justify-between">
              {event?._id && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  aria-label="Delete event"
                >
                  <Trash2 size={16} aria-hidden="true" />
                  Hapus
                </Button>
              )}

              <div className="flex flex-1 justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Batal
                </Button>
                {/* Submit Button */}
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Simpan Acara"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

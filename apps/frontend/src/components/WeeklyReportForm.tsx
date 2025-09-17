"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@rzkyakbr/libs";

const formSchema = z.object({
  visitDate: z.string().nonempty("Tanggal wajib diisi"),
  pelajar: z.string().transform((val) => Number(val) || 0),
  umum: z.string().transform((val) => Number(val) || 0),
  asing: z.string().transform((val) => Number(val) || 0),
  khusus: z.string().transform((val) => Number(val) || 0),
});

export default function WeeklyReportForm({ onSuccess }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visitDate: "",
      pelajar: "0",
      umum: "0",
      asing: "0",
      khusus: "0",
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        visitDate: values.visitDate,
        categories: [
          { category: "Pelajar", ticketCount: values.pelajar },
          { category: "Umum", ticketCount: values.umum },
          { category: "Asing", ticketCount: values.asing },
          { category: "Khusus", ticketCount: values.khusus },
        ],
      };

      await api.post("/laporan", payload);
      form.reset();
      if (onSuccess) onSuccess(); // panggil callback untuk refresh table
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Tambah Laporan Harian</CardTitle>
        <CardDescription>Isi data-data dibawah ini</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="visitDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Kunjungan</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pelajar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Tiket (Pelajar)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="umum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Tiket (Umum)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="asing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Tiket (Asing)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="khusus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Tiket (Khusus)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2 flex justify-end">
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

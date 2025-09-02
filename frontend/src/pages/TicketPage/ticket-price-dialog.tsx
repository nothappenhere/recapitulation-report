import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { TicketPriceFormSchema } from "@/schemas/ticketPriceSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {z} from "zod";
import api from "@/lib/axios";

function TicketPriceDialog({ open, setOpen, ticketPrice }) {
  const form = useForm<z.infer<typeof TicketPriceFormSchema>>({
    resolver: zodResolver(TicketPriceFormSchema),
    defaultValues: {
      unitPrice: 0,
    },
  });

  // Reset harga saat dialog dibuka atau data berubah
  useEffect(() => {
    if (ticketPrice?.unitPrice !== undefined) {
      form.setValue("unitPrice", ticketPrice.unitPrice);
    }
  }, [ticketPrice]);

async function onUpdate(values: TicketPriceFormSchema) {
    // if (!selectedItem) return;

    // if (!selectedTicketPrice?._id) {
    //   toast.error("Data tiket tidak ditemukan.");
    //   return;
    // }

    try {
      const res = await api.put(
        `/ticket-price/${selectedTicketPrice._id}`,
        updatedData
      );

      const updatedTicket = res.data.data.ticketPrice;
      toast.success("Harga tiket berhasil diperbarui.");
      setTicketPrices((prev) =>
        prev.map((tp) =>
          tp._id === selectedTicketPrice._id ? updatedTicket : tp
        )
      );

      setOpenEdit(false);
      setSelectedTicketPrice(null);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui harga tiket.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onUpdate)}>
            <DialogHeader>
              <DialogTitle>
                Ubah harga tiket golongan {ticketPrice.category}
              </DialogTitle>
              <DialogDescription>
                Lakukan perubahan pada harga tiket di bawah ini, klik Simpan
                setelah selesai.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga Satuan</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Masukan harga satuan"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default TicketPriceDialog;

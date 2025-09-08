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
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

function TicketStockDialog({ open, setOpen, onUpdate, ticketStock }) {
  const [totalTicket, setTotalTicket] = useState(0);

  // Reset harga saat dialog dibuka atau data berubah
  useEffect(() => {
    if (ticketStock?.jumlah_tiket !== undefined) {
      setTotalTicket(ticketStock.jumlah_tiket.toString());
    }
  }, [ticketStock]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form
          className="space-y-4"
          onSubmit={(e) =>
            onUpdate(e, {
              jumlah_tiket: Number(totalTicket),
            })
          }
        >
          <DialogHeader>
            <DialogTitle>
              Ubah stok tiket untuk golongan{" "}
              <Badge className="rounded">{ticketStock.golongan}</Badge>
            </DialogTitle>
            <DialogDescription>
              Lakukan perubahan pada stok tiket di bawah ini, klik Simpan
              setelah selesai.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="stok-tiket">Stok Tiket</Label>
              <Input
                id="stok-tiket"
                type="number"
                min={0}
                placeholder="Masukan stok tiket"
                value={totalTicket}
                onChange={(e) => setTotalTicket(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit">Simpan perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TicketStockDialog;

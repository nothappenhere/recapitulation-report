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

function TicketPriceDialog({ open, setOpen, onUpdate, ticketPrice }) {
  const [unitPrice, setUnitPrice] = useState(0);

  // Reset harga saat dialog dibuka atau data berubah
  useEffect(() => {
    if (ticketPrice?.unitPrice !== undefined) {
      setUnitPrice(ticketPrice.unitPrice.toString());
    }
  }, [ticketPrice]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form
          className="space-y-4"
          onSubmit={(e) =>
            onUpdate(e, {
              unitPrice: Number(unitPrice),
            })
          }
        >
          <DialogHeader>
            <DialogTitle>
              Ubah harga tiket untuk golongan{" "}
              <Badge className="rounded">{ticketPrice.group}</Badge>
            </DialogTitle>
            <DialogDescription>
              Lakukan perubahan pada harga tiket di bawah ini, klik Simpan
              setelah selesai.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="harga-satuan">Harga Satuan</Label>
              <Input
                id="harga-satuan"
                type="number"
                min={0}
                placeholder="Masukan harga satuan"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
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

export default TicketPriceDialog;

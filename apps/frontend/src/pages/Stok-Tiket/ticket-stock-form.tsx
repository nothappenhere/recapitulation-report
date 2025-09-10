import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { api } from "@rzkyakbr/libs";

export function AddTicketStock({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [existingGroups, setExistingGroups] = useState([]);
  const [group, setGroup] = useState("");
  const [totalTicket, setTotalTicket] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchExistingTicketPrices() {
      try {
        const res = await api.get("/stok-tiket");
        const { stockTicket } = res.data.data;

        // Ambil semua nama golongan yang sudah ada
        const groups = stockTicket.map((item) => item.golongan);
        setExistingGroups(groups);
      } catch (err) {
        toast.error("Gagal memuat data stok tiket.");
      }
    }

    fetchExistingTicketPrices();
  }, []);

  async function handleCreateTicketPrice(e) {
    e.preventDefault();

    try {
      await api.post(`/stok-tiket`, {
        golongan: group,
        jumlah_tiket: totalTicket,
      });

      toast.success(`Berhasil membuat stok tiket baru untuk golongan ${group}`);
      navigate("/dashboard/stok-tiket");
    } catch (err) {
      toast.error("Gagal memperbarui stok tiket.");
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>Tambah stok tiket baru</CardTitle>
              <CardDescription>
                Masukkan informasi stok tiket di bawah ini.
              </CardDescription>

              <CardAction>
                <Badge
                  asChild
                  variant="outline"
                  className="py-1.5 hover:cursor-pointer"
                >
                  <Link to="/dashboard/stok-tiket">
                    <ArrowLeft />
                    Kembali
                  </Link>
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleCreateTicketPrice(e)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="golongan">Golongan</Label>
                      <Select
                        value={group}
                        onValueChange={(value) => setGroup(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih golongan" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Pelajar", "Umum", "Asing", "Khusus"].map(
                            (item) => (
                              <SelectItem
                                key={item}
                                value={item}
                                disabled={existingGroups.includes(item)}
                              >
                                {item}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="jumlah-tiket">Jumlah Tiket</Label>
                      <Input
                        id="jumlah-tiket"
                        type="number"
                        min={0}
                        placeholder="Masukan jumlah tiket"
                        value={totalTicket}
                        onChange={(e) => setTotalTicket(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full">
                      Simpan
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

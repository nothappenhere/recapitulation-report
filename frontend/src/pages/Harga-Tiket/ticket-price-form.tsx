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
import api from "@/lib/axios";

export function AddTicketPrice({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [existingGroups, setExistingGroups] = useState([]);
  const [group, setGroup] = useState("");
  const [unitPrice, setUnitPrice] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchExistingTicketPrices() {
      try {
        const res = await api.get("/harga-tiket");
        const { ticketPrice } = res.data.data;

        // Ambil semua nama golongan yang sudah ada
        const groups = ticketPrice.map((item) => item.group);
        setExistingGroups(groups);
      } catch (err) {
        toast.error("Gagal memuat data harga tiket.");
      }
    }

    fetchExistingTicketPrices();
  }, []);

  async function handleCreateTicketPrice(e) {
    e.preventDefault();

    try {
      await api.post(`/harga-tiket`, { group, unitPrice });

      toast.success(
        `Berhasil membuat harga tiket baru untuk golongan ${group}`
      );
      navigate("/dashboard/harga-tiket");
    } catch (err) {
      toast.error("Gagal memperbarui harga tiket.");
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>Tambah harga tiket baru</CardTitle>
              <CardDescription>
                Masukkan informasi harga tiket di bawah ini.
              </CardDescription>

              <CardAction>
                <Badge
                  asChild
                  variant="outline"
                  className="py-1.5 hover:cursor-pointer"
                >
                  <Link to="/dashboard/harga-tiket">
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
                      <Label htmlFor="harga-satuan">Harga Satuan</Label>
                      <Input
                        id="harga-satuan"
                        type="number"
                        min={0}
                        placeholder="Masukan harga satuan"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(Number(e.target.value))}
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

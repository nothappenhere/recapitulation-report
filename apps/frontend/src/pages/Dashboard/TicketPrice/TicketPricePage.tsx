import { api } from "@rzkyakbr/libs";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { TicketPriceCard } from "./TicketPriceCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { type AxiosError } from "axios";
import { useUser } from "@/hooks/use-user-context";
import AlertDelete from "@/components/AlertDelete";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import { RefreshCw, TicketIcon } from "lucide-react";
import type { TicketPriceFullTypes } from "@rzkyakbr/types";

function TicketPricePage() {
  const [data, setData] = useState<TicketPriceFullTypes[]>([]);
  const [loading, setLoading] = useState(false);

  // * Untuk AlertDelete
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TicketPriceFullTypes | null>(
    null
  );

  const { user } = useUser();
  const role = user?.role || null;

  const fetchTicketPrices = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get(`/ticket-price`);
      setData(res.data.data);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTicketPrices();
  }, [fetchTicketPrices]);

  async function confirmDelete() {
    if (!selectedItem) return;
    setLoading(true);

    try {
      const res = await api.delete(`/ticket-price/${selectedItem._id}`);
      toast.success(`${res.data.message}.`);
      setData((prev) => prev.filter((tp) => tp._id !== selectedItem._id));
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menghapus data, silakan coba lagi.";
      toast.error(message);
    } finally {
      setSelectedItem(null);
      setDeleteOpen(false);
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? (
        <CardSkeleton />
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Ticket Price Card for each Category*/}
              <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
                {data.map((tp) => (
                  <TicketPriceCard
                    key={tp._id}
                    ticketPrice={tp}
                    onEdit={() => setSelectedItem(tp)}
                    onDelete={() => {
                      setSelectedItem(tp);
                      setDeleteOpen(true);
                    }}
                  />
                ))}
              </div>

              {data.length === 0 ? (
                role === "Administrator" ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-2.5 max-w-md mx-auto text-center">
                    <div className="bg-primary/10 rounded-full p-7">
                      <TicketIcon className="size-10" />
                    </div>
                    {/* Teks dan tombol untuk admin */}
                    <h3 className="text-xl font-bold">
                      Tidak ada daftar harga tiket.
                    </h3>
                    <p className="text-muted-foreground">
                      Siap untuk mengatur harga tiket? Buat data pertama untuk
                      memulai.
                    </p>
                    <Button asChild>
                      <Link to="add">Tambah Harga Tiket</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 space-y-2.5 max-w-md mx-auto text-center">
                    <div className="bg-primary/10 rounded-full p-7">
                      <TicketIcon className="size-10" />
                    </div>
                    {/* Teks untuk user biasa */}
                    <h3 className="text-xl font-bold">
                      Tidak ada daftar harga tiket.
                    </h3>
                    <p className="text-muted-foreground">
                      Anda tidak memiliki akses untuk menambahkan harga tiket.
                      Silakan hubungi Administrator jika diperlukan.
                    </p>
                  </div>
                )
              ) : data.length > 0 && data.length < 4 ? (
                role === "Administrator" ? (
                  <div className="flex items-center justify-center">
                    <Button asChild className="my-1.5">
                      <Link to="add">Tambah Harga Tiket</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Button onClick={fetchTicketPrices}>
                      <RefreshCw className="mt-0.5" />
                      Refresh
                    </Button>
                  </div>
                )
              ) : null}

              {selectedItem && (
                <AlertDelete
                  open={isDeleteOpen}
                  setOpen={setDeleteOpen}
                  onDelete={confirmDelete}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TicketPricePage;

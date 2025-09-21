import { api } from "@rzkyakbr/libs";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { TicketPriceCard } from "./TicketPriceCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { type AxiosError } from "axios";
import AlertDelete from "@/components/AlertDelete";
import { type TTicketPrice } from "@rzkyakbr/schemas";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import { TicketIcon } from "lucide-react";

function TicketPricePage() {
  const [ticketPrices, setTicketPrices] = useState([]);
  const [selectedItem, setSelectedItem] = useState<TTicketPrice | null>(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTicketPrices() {
      setLoading(true);

      try {
        const res = await api.get(`/ticket-price`);
        setTicketPrices(res.data.data);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Gagal mengambil data harga tiket, silakan coba lagi.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    fetchTicketPrices();
  }, []);

  async function confirmDelete() {
    if (!selectedItem) return;
    setLoading(true);

    try {
      const res = await api.delete(`/ticket-price/${selectedItem._id}`);
      setTicketPrices((prev) =>
        prev.filter((tp) => tp._id !== selectedItem._id)
      );

      toast.success(`${res.data.message}.`);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Gagal menghapus data harga tiket, silakan coba lagi.";
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
                {ticketPrices.map((ticketPrice) => (
                  <TicketPriceCard
                    key={ticketPrice._id}
                    ticketPrice={ticketPrice}
                    onEdit={() => setSelectedItem(ticketPrice)}
                    onDelete={() => {
                      setSelectedItem(ticketPrice);
                      setDeleteOpen(true);
                    }}
                  />
                ))}
              </div>

              {ticketPrices.length === 0 ? (
                // Kondisi ketika belum ada tiket sama sekali
                <div className="flex flex-col items-center justify-center py-16 space-y-2.5 max-w-md mx-auto text-center">
                  <div className="bg-primary/10 rounded-full p-7">
                    <TicketIcon className="size-10" />
                  </div>
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
              ) : ticketPrices.length > 0 && ticketPrices.length < 4 ? (
                // Kondisi ketika ada tiket tapi masih kurang dari 4
                <div className="flex items-center justify-center">
                  <Button asChild className="my-1.5">
                    <Link to="add">Tambah Harga Tiket</Link>
                  </Button>
                </div>
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

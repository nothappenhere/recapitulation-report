import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { TicketPriceCard } from "./TicketPriceCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { type AxiosError } from "axios";
import { type TicketPriceFormValues } from "@/schemas/ticketPriceSchema";
import AlertDelete from "@/components/AlertDelete";

function TicketPricePage() {
  const [ticketPrices, setTicketPrices] = useState([]);
  const [selectedItem, setSelectedItem] =
    useState<TicketPriceFormValues | null>(null);
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
        const message = "Gagal mengambil data harga tiket";

        console.error(`${message}: ${error.message}`);
        toast.error(`${message}.`);
      } finally {
        setLoading(false);
      }
    }

    fetchTicketPrices();
  }, []);

  async function confirmDelete() {
    if (!selectedItem) return;

    try {
      await api.delete(`/ticket-price/${selectedItem._id}`);
      setTicketPrices((prev) =>
        prev.filter((tp) => tp._id !== selectedItem._id)
      );
      toast.success("Harga tiket berhasil dihapus");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = "Gagal menghapus harga tiket";

      console.error(`${message}: ${error.message}`);
      toast.error(`${message}.`);
    } finally {
      setSelectedItem(null);
      setDeleteOpen(false);
    }
  }

  return (
    <>
      {loading && <p className="text-center">Loading...</p>}

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              {/* Ticket Price Card for each Category*/}
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

            <div className="flex items-center justify-center">
              <Button
                asChild
                className="mt-2.5"
                disabled={ticketPrices.length === 4}
              >
                <Link to="add">Add Ticket Price</Link>
              </Button>
            </div>

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
    </>
  );
}

export default TicketPricePage;

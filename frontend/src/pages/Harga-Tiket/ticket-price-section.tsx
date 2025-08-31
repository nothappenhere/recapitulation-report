import api from "@/lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TicketPriceCard from "./ticket-price-card";
import TicketPriceDialog from "./ticket-price-dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { TicketPriceAlert } from "./ticket-price-alert";

export default function TicketPriceSection() {
  const [ticketPrices, setTicketPrices] = useState([]);
  const [selectedTicketPrice, setSelectedTicketPrice] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTicketPrices() {
      try {
        setLoading(true);
        const res = await api.get(`/harga-tiket`);
        const { ticketPrice } = res.data.data;

        setTicketPrices(ticketPrice);
      } catch (err) {
        toast.error("Gagal memuat data harga tiket.");
      } finally {
        setLoading(false);
      }
    }

    fetchTicketPrices();
  }, []);

  async function handleUpdateTicketPrice(e, updatedData) {
    e.preventDefault();

    if (!selectedTicketPrice?._id) {
      toast.error("Data tiket tidak ditemukan.");
      return;
    }

    try {
      const res = await api.put(
        `/harga-tiket/${selectedTicketPrice._id}`,
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

  async function handleDeleteTicketPrice(e) {
    e.preventDefault();

    if (!selectedTicketPrice?._id) {
      toast.error("Data tiket tidak ditemukan.");
      return;
    }

    try {
      await api.delete(`/harga-tiket/${selectedTicketPrice._id}`);

      toast.success("Harga tiket berhasil dihapus.");
      setTicketPrices((prev) =>
        prev.filter((tp) => tp._id !== selectedTicketPrice._id)
      );

      setOpenDelete(false);
      setSelectedTicketPrice(null);
    } catch (err) {
      toast.error("Gagal menghapus harga tiket.");
    }
  }

  return (
    <>
      {loading && <p className="text-center">Loading data...</p>}

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              {ticketPrices.map((ticketPrice) => (
                <TicketPriceCard
                  key={ticketPrice._id}
                  ticketPrice={ticketPrice}
                  onEdit={() => {
                    setSelectedTicketPrice(ticketPrice);
                    setOpenEdit(true);
                  }}
                  onDelete={() => {
                    setSelectedTicketPrice(ticketPrice);
                    setOpenDelete(true);
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-center">
              <Button className="mt-2.5" disabled={ticketPrices.length === 4}>
                <Link to="add">Tambah Harga</Link>
              </Button>
            </div>

            {selectedTicketPrice && (
              <>
                <TicketPriceDialog
                  open={openEdit}
                  setOpen={setOpenEdit}
                  onUpdate={handleUpdateTicketPrice}
                  ticketPrice={selectedTicketPrice}
                />

                <TicketPriceAlert
                  open={openDelete}
                  setOpen={setOpenDelete}
                  onDelete={handleDeleteTicketPrice}
                  ticketPrice={selectedTicketPrice}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TicketPriceCard from "./TicketPriceCard";
import TicketPriceDialog from "./ticket-price-dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { TicketPriceAlert } from "./ticket-price-alert";
import type { AxiosError } from "axios";
import type { TicketPriceFormValues } from "@/schemas/ticketPriceSchema";
import AlertDelete from "@/components/AlertDelete";

function TicketPriceTable() {
  const [ticketPrices, setTicketPrices] = useState([]);

  const [selectedTicketPrice, setSelectedTicketPrice] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<TicketPriceFormValues | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTicketPrices() {
      setLoading(true);
      try {
        const res = await api.get(`/ticket-price`);
        setTicketPrices(res.data.data);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("Gagal mengambil data:", error.message);
        toast.error("Gagal mengambil data harga tiket");
      } finally {
        setLoading(false);
      }
    }

    fetchTicketPrices();
  }, []);

  async function handleUpdateTicketPrice(updatedData) {
    if (!selectedItem) return;

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
      console.error("Gagal menghapus:", error.message);
      toast.error("Gagal menghapus harga tiket.");
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
              {/* Ticket Price Card */}
              {ticketPrices.map((ticketPrice) => (
                <TicketPriceCard
                  key={ticketPrice._id}
                  ticketPrice={ticketPrice}
                  onEdit={() => {
                    setSelectedItem(ticketPrice);
                    setEditOpen(true);
                  }}
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
              <>
                <TicketPriceDialog
                  open={isEditOpen}
                  setOpen={setEditOpen}
                  // onUpdate={handleUpdateTicketPrice}
                  ticketPrice={selectedItem}
                />

                <AlertDelete
                  open={isDeleteOpen}
                  setOpen={setDeleteOpen}
                  onDelete={confirmDelete}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TicketPriceTable;

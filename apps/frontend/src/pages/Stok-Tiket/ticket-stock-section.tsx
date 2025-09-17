import { api } from "@rzkyakbr/libs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TicketStockCard from "./ticket-stock-card";
import TicketStockDialog from "./ticket-stock-dialog";
import { TicketStockAlert } from "./ticket-stock-alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function TicketStockSection() {
  const [ticketStocks, setTicketStocks] = useState([]);
  const [selectedTicketStock, setSelectedTicketStock] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTicketStocks() {
      try {
        setLoading(true);
        const res = await api.get(`/stok-tiket`);
        const { stockTicket } = res.data.data;

        setTicketStocks(stockTicket);
      } catch (err) {
        toast.error("Gagal memuat data stok tiket.");
      } finally {
        setLoading(false);
      }
    }

    fetchTicketStocks();
  }, []);

  async function handleUpdateTicketPrice(e, updatedData) {
    e.preventDefault();

    if (!selectedTicketStock?._id) {
      toast.error("Data tiket tidak ditemukan.");
      return;
    }

    try {
      const res = await api.put(
        `/stok-tiket/${selectedTicketStock._id}`,
        updatedData
      );

      const updatedTicket = res.data.data.stockTicket;
      toast.success("Stok tiket berhasil diperbarui.");
      setTicketStocks((prev) =>
        prev.map((tp) =>
          tp._id === selectedTicketStock._id ? updatedTicket : tp
        )
      );

      setOpenEdit(false);
      setSelectedTicketStock(null);
    } catch (err) {
      toast.error("Gagal memperbarui harga tiket.");
    }
  }

  async function handleDeleteTicketPrice(e) {
    e.preventDefault();

    if (!selectedTicketStock?._id) {
      toast.error("Data tiket tidak ditemukan.");
      return;
    }

    try {
      await api.delete(`/stok-tiket/${selectedTicketStock._id}`);

      toast.success("Stok tiket berhasil dihapus.");
      setTicketStocks((prev) =>
        prev.filter((tp) => tp._id !== selectedTicketStock._id)
      );

      setOpenDelete(false);
      setSelectedTicketStock(null);
    } catch (err) {
      toast.error("Gagal menghapus stok tiket.");
    }
  }

  return (
    <>
      {loading && <p className="text-center">Loading data...</p>}

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              {ticketStocks.map((ticketStock) => (
                <TicketStockCard
                  key={ticketStock._id}
                  ticketStock={ticketStock}
                  onEdit={() => {
                    setSelectedTicketStock(ticketStock);
                    setOpenEdit(true);
                  }}
                  onDelete={() => {
                    setSelectedTicketStock(ticketStock);
                    setOpenDelete(true);
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-center">
              <Button className="mt-2.5" disabled={ticketStocks.length === 4}>
                <Link to="add">Tambah Stok Tiket</Link>
              </Button>
            </div>

            {selectedTicketStock && (
              <>
                <TicketStockDialog
                  open={openEdit}
                  setOpen={setOpenEdit}
                  onUpdate={handleUpdateTicketPrice}
                  ticketStock={selectedTicketStock}
                />

                <TicketStockAlert
                  open={openDelete}
                  setOpen={setOpenDelete}
                  onDelete={handleDeleteTicketPrice}
                  ticketPrice={selectedTicketStock}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import { useCallback, useEffect, useState } from "react";
import { type TReservation } from "@rzkyakbr/schemas";
import { api } from "@rzkyakbr/libs";
import toast from "react-hot-toast";
import { useReservationColumns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import { type AxiosError } from "axios";
import AlertDelete from "@/components/AlertDelete";

export default function ReservationTable() {
  const [data, setData] = useState<TReservation[]>([]);
  const [loading, setLoading] = useState(false);

  // * Untuk AlertDelete
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TReservation | null>(null);

  // TODO: Ambil data dari API
  useEffect(() => {
    async function fetchReservations() {
      setLoading(true);
      try {
        const res = await api.get("/booking-reservation");
        setData(res.data.data);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("Gagal mengambil data:", error.message);
        toast.error("Gagal mengambil data reservasi.");
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, []);

  // TODO: Handler delete setelah dikonfirmasi
  const confirmDelete = useCallback(async () => {
    if (!selectedItem) return;
    setLoading(true);

    try {
      await api.delete(`/booking-reservation/${selectedItem._id}`);
      setData((prev) => prev.filter((r) => r._id !== selectedItem._id));
      toast.success("Reservasi berhasil dihapus");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Gagal menghapus data:", error.message);
      toast.error("Gagal menghapus data reservasi");
    } finally {
      setSelectedItem(null);
      setDeleteOpen(false);
      setLoading(false);
    }
  }, [selectedItem]);

  // TODO: Handler ketika klik tombol Delete (tampilkan alert)
  const handleDeleteClick = useCallback((item: TReservation) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  }, []);

  // TODO: Oper ke kolom
  const columns = useReservationColumns(handleDeleteClick);

  return (
    <div className="container mx-auto">
      {loading && <p className="text-center">Loading data...</p>}

      <DataTable
        columns={columns}
        data={loading ? [] : data}
        addTitle="Tambah Reservasi"
        addPath="add?tab=reservation-booking"
        colSpan={7}
      />

      <AlertDelete
        open={isDeleteOpen}
        setOpen={setDeleteOpen}
        onDelete={confirmDelete}
      />
    </div>
  );
}

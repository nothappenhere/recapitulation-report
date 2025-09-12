import { api } from "@rzkyakbr/libs";
import toast from "react-hot-toast";
import { useReservationColumns } from "./columns";
import { DataTable } from "./data-table";
import { useCallback, useEffect, useState } from "react";
import { type ReservationFormValues } from "@rzkyakbr/schemas";
import { type AxiosError } from "axios";
import AlertDelete from "@/components/AlertDelete";

function ReservationTable() {
  const [data, setData] = useState<ReservationFormValues[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Untuk AlertDelete
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<ReservationFormValues | null>(null);

  // 🚀 Ambil data dari API
  useEffect(() => {
    async function fetchReservations() {
      setLoading(true);
      try {
        const res = await api.get("/booking-reservation");
        setData(res.data.data);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("Gagal mengambil data:", error.message);
        toast.error("Gagal mengambil data reservasi");
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, []);

  // ✅ Handler delete setelah dikonfirmasi
  const confirmDelete = useCallback(async () => {
    if (!selectedItem) return;

    try {
      await api.delete(`/reservations/${selectedItem._id}`);
      setData((prev) => prev.filter((r) => r._id !== selectedItem._id));
      toast.success("Reservasi berhasil dihapus");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Gagal menghapus:", error.message);
      toast.error("Gagal menghapus reservasi");
    } finally {
      setSelectedItem(null);
      setDeleteOpen(false);
    }
  }, [selectedItem]);

  // ⚡ Handler ketika klik tombol Delete (tampilkan alert)
  const handleDeleteClick = useCallback((item: ReservationFormValues) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  }, []);

  // 👉 Oper ke kolom
  const columns = useReservationColumns(handleDeleteClick);

  return (
    <div className="container mx-auto">
      {loading && <p className="text-center">Loading data...</p>}

      <DataTable columns={columns} data={data} addTitle="Add Reservation" />

      <AlertDelete
        open={isDeleteOpen}
        setOpen={setDeleteOpen}
        onDelete={confirmDelete}
      />
    </div>
  );
}

export default ReservationTable;

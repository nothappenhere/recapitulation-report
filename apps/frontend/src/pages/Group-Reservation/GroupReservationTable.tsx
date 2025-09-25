import { useCallback, useEffect, useState } from "react";
import { type GroupReservationFullTypes } from "@rzkyakbr/types";
import { api } from "@rzkyakbr/libs";
import toast from "react-hot-toast";
import { useReservationColumns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import { type AxiosError } from "axios";
import AlertDelete from "@/components/AlertDelete";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

export default function GroupReservationTable() {
  const [data, setData] = useState<GroupReservationFullTypes[]>([]);
  const [loading, setLoading] = useState(false);

  // * Untuk AlertDelete
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<GroupReservationFullTypes | null>(null);

  // TODO: Ambil data dari API
  const fetchReservations = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("/reservation");
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
    fetchReservations();
  }, [fetchReservations]);

  // jalankan polling
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startPolling = () => {
      fetchReservations(); // langsung fetch begitu tab aktif
      interval = setInterval(fetchReservations, 60000);
    };

    const stopPolling = () => {
      if (interval) clearInterval(interval);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // kalau tab tidak aktif, hentikan polling
        stopPolling();
      } else {
        // kalau tab kembali aktif, mulai polling lagi
        startPolling();
      }
    };

    // mulai polling pertama kali
    startPolling();

    // listen visibility tab
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchReservations]);

  // TODO: Handler delete setelah dikonfirmasi
  const confirmDelete = useCallback(async () => {
    if (!selectedItem) return;
    setLoading(true);

    try {
      const res = await api.delete(
        `/reservation/${selectedItem.reservationNumber}`
      );
      toast.success(`${res.data.message}.`);
      setData((prev) => prev.filter((r) => r._id !== selectedItem._id));
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
  }, [selectedItem]);

  // TODO: Handler ketika klik tombol Delete (tampilkan alert)
  const handleDeleteClick = useCallback((item: GroupReservationFullTypes) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  }, []);

  // TODO: Oper ke kolom
  const columns = useReservationColumns(handleDeleteClick);

  return (
    <div className="container mx-auto">
      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={loading ? [] : data}
            addTitle="Tambah Reservasi"
            colSpan={13}
            onRefresh={fetchReservations}
          />

          <AlertDelete
            open={isDeleteOpen}
            setOpen={setDeleteOpen}
            onDelete={confirmDelete}
          />
        </>
      )}
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import { type CustomReservationFullTypes } from "@rzkyakbr/types";
import { api } from "@rzkyakbr/libs";
import toast from "react-hot-toast";
import { useCustomReservationColumns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import { type AxiosError } from "axios";
import AlertDelete from "@/components/AlertDelete";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

export default function CustomReservationPage() {
  const [data, setData] = useState<CustomReservationFullTypes[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<CustomReservationFullTypes | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  //* Fetch data for displaying table
  const fetchReservations = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("/custom-reservation");
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

  //* Conduct a poll
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

  //* Delete handler: delete data after confirmation
  const confirmDelete = useCallback(async () => {
    if (!selectedItem) return;
    setLoading(true);

    try {
      const res = await api.delete(
        `/custom-reservation/${selectedItem.customReservationNumber}`
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

  //* Handler when the Delete button is clicked (display alert)
  const handleDeleteClick = useCallback((item: CustomReservationFullTypes) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  }, []);

  //* Operate to the column
  const columns = useCustomReservationColumns(handleDeleteClick);

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

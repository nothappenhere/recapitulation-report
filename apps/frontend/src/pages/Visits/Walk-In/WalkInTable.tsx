import { useCallback, useEffect, useState } from "react";
import { type TWalkIn } from "@rzkyakbr/schemas";
import { api } from "@rzkyakbr/libs";
import toast from "react-hot-toast";
import { useWalkInColumns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import { type AxiosError } from "axios";
import AlertDelete from "@/components/AlertDelete";

export default function WalkInTable() {
  const [data, setData] = useState<TWalkIn[]>([]);
  const [loading, setLoading] = useState(false);

  // * Untuk AlertDelete
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TWalkIn | null>(null);

  // TODO: Ambil data dari API
  useEffect(() => {
    async function fetchWalkIns() {
      setLoading(true);
      try {
        const res = await api.get("/walk-in");
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
    }

    fetchWalkIns();
  }, []);

  // TODO: Handler delete setelah dikonfirmasi
  const confirmDelete = useCallback(async () => {
    if (!selectedItem) return;
    setLoading(true);

    try {
      const res = await api.delete(`/walk-in/${selectedItem._id}`);
      toast.success(`${res.data.message}`);
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
  const handleDeleteClick = useCallback((item: TWalkIn) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  }, []);

  // TODO: Oper ke kolom
  const columns = useWalkInColumns(handleDeleteClick);

  return (
    <div className="container mx-auto">
      {loading && <p className="text-center">Loading data...</p>}

      <DataTable
        columns={columns}
        data={loading ? [] : data}
        addTitle="Tambah Walk-in"
        addPath="add?tab=walk-in"
        colSpan={6}
      />

      <AlertDelete
        open={isDeleteOpen}
        setOpen={setDeleteOpen}
        onDelete={confirmDelete}
      />
    </div>
  );
}

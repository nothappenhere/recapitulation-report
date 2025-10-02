import { useCallback, useEffect, useState } from "react";
import { type UserFullTypes } from "@rzkyakbr/types";
import { api } from "@rzkyakbr/libs";
import toast from "react-hot-toast";
import { useUserColumns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import { type AxiosError } from "axios";
import AlertDelete from "@/components/AlertDelete";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import DetailUser from "./DetailUser";
import type { TUserUpdate } from "@rzkyakbr/schemas";

export default function UserTable() {
  const [data, setData] = useState<UserFullTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserFullTypes | null>(null);

  // TODO: Ambil data dari API
  const fetchUsers = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("/user-manage");
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
    fetchUsers();
  }, [fetchUsers]);

  // jalankan polling
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startPolling = () => {
      fetchUsers(); // langsung fetch begitu tab aktif
      interval = setInterval(fetchUsers, 3600000);
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
  }, [fetchUsers]);

  // TODO: Handler update setelah dikonfirmasi
  const handleSaveEdit = useCallback(
    async (formData: TUserUpdate) => {
      if (!selectedItem) return;
      setLoading(true);

      try {
        const res = await api.put(
          `/user-manage/${selectedItem.username}`,
          formData
        );
        toast.success(`${res.data.message}.`);
        fetchUsers(); // refresh data
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat menyimpan data, silakan coba lagi.";
        toast.error(message);
      } finally {
        setEditOpen(false);
        setSelectedItem(null);
        setLoading(false);
      }
    },
    [selectedItem, fetchUsers]
  );

  // TODO: Handler delete setelah dikonfirmasi
  const confirmDelete = useCallback(async () => {
    if (!selectedItem) return;
    setLoading(true);

    try {
      const res = await api.delete(`/user-manage/${selectedItem.username}`);
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

  // TODO: Handler ketika klik tombol Edit (tampilkan dialog)
  const handleEditClick = useCallback((item: UserFullTypes) => {
    setSelectedItem(item);
    setEditOpen(true);
  }, []);

  // TODO: Handler ketika klik tombol Delete (tampilkan alert)
  const handleDeleteClick = useCallback((item: UserFullTypes) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  }, []);

  // TODO: Oper ke kolom
  const columns = useUserColumns(handleDeleteClick, handleEditClick);

  return (
    <div className="container mx-auto">
      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={loading ? [] : data}
            colSpan={8}
            onRefresh={fetchUsers}
            setOpen={setEditOpen}
          />

          <DetailUser
            open={isEditOpen}
            setOpen={setEditOpen}
            onEdit={handleSaveEdit}
            data={selectedItem}
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

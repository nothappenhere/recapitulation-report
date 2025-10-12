import { useCallback, useEffect, useState } from "react";
import { type UserFullTypes } from "@rzkyakbr/types";
import { api, setTitle } from "@rzkyakbr/libs";
import toast from "react-hot-toast";
import { useUserColumns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import { type AxiosError } from "axios";
import AlertDelete from "@/components/AlertDelete";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import type { TUserUpdate } from "@rzkyakbr/schemas";

type ExportColumn<T> = {
  key: keyof T;
  header: string;
  type?: "dateOnly" | "dateWithTime" | "currency" | "timeRange" | "fullName";
};

export default function ManageUserPage() {
  setTitle("User Management - GeoTicketing");

  const [data, setData] = useState<UserFullTypes[]>([]);
  const [selectedItem, setSelectedItem] = useState<UserFullTypes | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  //* Fetch data for displaying table
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

  //* Conduct a poll
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

  //* Update handler: update data after confirmation
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
        fetchUsers();
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

  //* Handler when the Edit button is clicked (display dialog)
  const handleEditClick = useCallback((item: UserFullTypes) => {
    setSelectedItem(item);
    setEditOpen(true);
  }, []);

  //* Delete handler: delete data after confirmation
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

  //* Handler when the Delete button is clicked (display alert)
  const handleDeleteClick = useCallback((item: UserFullTypes) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  }, []);

  //* Operate to the column
  const columns = useUserColumns(handleDeleteClick, handleEditClick);

  const exportColumns: ExportColumn<UserFullTypes>[] = [
    { key: "NIP", header: "Nomor Induk Pegawai" },
    { key: "position", header: "Jabatan" },

    { key: "fullName", header: "Nama Lengkap" },
    { key: "username", header: "Username" },
    { key: "role", header: "Role" },
    { key: "lastLogin", header: "Terakhir Login", type: "dateWithTime" },

    { key: "createdAt", header: "Tanggal Bergabung", type: "dateWithTime" },
    { key: "updatedAt", header: "Tanggal Diperbarui", type: "dateWithTime" },
  ];

  return (
    <div className="container mx-auto">
      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={loading ? [] : data}
            addTitle="Tambah Pengguna"
            colSpan={8}
            onRefresh={fetchUsers}
            worksheetName="Pengeolaan Pengguna"
            exportColumns={exportColumns}
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

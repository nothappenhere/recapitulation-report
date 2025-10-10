import { useCallback, useEffect, useState } from "react";
import { type GroupReservationFullTypes } from "@rzkyakbr/types";
import { api, setTitle } from "@rzkyakbr/libs";
import toast from "react-hot-toast";
import { useGroupReservationColumns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import { type AxiosError } from "axios";
import AlertDelete from "@/components/AlertDelete";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

type ExportColumn<T> = {
  key: keyof T;
  header: string;
  type?: "dateOnly" | "dateWithTime" | "currency" | "timeRange" | "fullName";
};

export default function GroupReservationPage() {
  setTitle("Group Reservation - GeoTicketing");

  const [data, setData] = useState<GroupReservationFullTypes[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<GroupReservationFullTypes | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  //* Fetch data for displaying table
  const fetchReservations = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("/group-reservation");
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
        `/group-reservation/${selectedItem.reservationNumber}`
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
  const handleDeleteClick = useCallback((item: GroupReservationFullTypes) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  }, []);

  //* Operate to the column
  const columns = useGroupReservationColumns(handleDeleteClick);

  const exportColumns: ExportColumn<GroupReservationFullTypes>[] = [
    { key: "reservationNumber", header: "Kode Reservasi" },
    { key: "agent", header: "Petugas Reservasi", type: "fullName" },

    { key: "ordererName", header: "Nama Pemesan" },
    { key: "phoneNumber", header: "No. Telepon" },
    { key: "visitingDate", header: "Tanggal Kunjungan", type: "dateOnly" },
    { key: "visitingHour", header: "Jam Kunjungan", type: "timeRange" },
    { key: "groupName", header: "Nama Rombongan" },
    { key: "description", header: "Keterangan" },

    { key: "reservationMechanism", header: "Mekanisme Reservasi" },
    { key: "reservationStatus", header: "Status Reservasi" },

    { key: "address", header: "Alamat" },
    { key: "province", header: "Provinsi" },
    { key: "regencyOrCity", header: "Kabupaten/Kota" },
    { key: "district", header: "Kecamatan" },
    { key: "village", header: "Kelurahan/Desa" },
    { key: "country", header: "Negara Asal" },

    { key: "studentMemberTotal", header: "Total Pelajar" },
    {
      key: "studentTotalAmount",
      header: "Harga Tiket Pelajar",
      type: "currency",
    },
    { key: "publicMemberTotal", header: "Total Umum" },
    { key: "publicTotalAmount", header: "Harga Tiket Umum", type: "currency" },
    { key: "foreignMemberTotal", header: "Total Asing" },
    {
      key: "foreignTotalAmount",
      header: "Harga Tiket Asing",
      type: "currency",
    },
    { key: "visitorMemberTotal", header: "Total Pengunjung" },
    {
      key: "totalPaymentAmount",
      header: "Total Harga Tiket",
      type: "currency",
    },

    { key: "actualMemberTotal", header: "Total Kehadiran" },

    { key: "paymentMethod", header: "Metode Pembayaran" },
    { key: "downPayment", header: "Uang Pembayaran", type: "currency" },
    { key: "changeAmount", header: "Uang Kembalian", type: "currency" },
    { key: "statusPayment", header: "Status Pembayaran" },
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
            addTitle="Tambah Reservasi"
            colSpan={13}
            onRefresh={fetchReservations}
            worksheetName="Reservasi Rombongan"
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

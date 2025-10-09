import { type CustomReservationFullTypes } from "@rzkyakbr/types";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDate, formatRupiah } from "@rzkyakbr/libs";
import { Badge } from "@/components/ui/badge";
import {
  createColumn,
  createActionsColumn,
  createSelectColumn,
} from "@/components/table/column-factory";
import { useNavigate } from "react-router";

export function useCustomReservationColumns(
  onDelete: (item: CustomReservationFullTypes) => void
): ColumnDef<CustomReservationFullTypes>[] {
  const navigate = useNavigate();

  return [
    createSelectColumn<CustomReservationFullTypes>(),

    createColumn("reservationNumber", "Kode Reservasi"),
    createColumn("agent", "Petugas Reservasi", {
      cell: ({ row }) => {
        const agent = row.original.agent as unknown as {
          fullName: string;
        } | null;
        return <span>{agent?.fullName ?? "-"}</span>;
      },
    }),

    createColumn("ordererName", "Nama Pemesan"),
    createColumn("phoneNumber", "No. Telepon"),
    createColumn("visitingDate", "Tgl. Kunjungan", {
      cell: ({ row }) => formatDate(row.original.visitingDate),
    }),
    createColumn("visitingHour", "Jam Kunjungan", {
      cell: ({ row }) => {
        const visitingHour = row.original.visitingHour as unknown as {
          timeRange: string;
        } | null;
        return <span>{visitingHour?.timeRange ?? "-"} WIB</span>;
      },
    }),
    createColumn("groupName", "Nama Rombongan"),
    createColumn("description", "Keterangan"),

    createColumn("address", "Alamat"),
    createColumn("country", "Negara Asal"),
    createColumn("reservationStatus", "Status Reservasi"),

    createColumn("publicMemberTotal", "Total Pemandu", {
      meta: { sum: true, label: "Total Pemandu" },
    }),
    createColumn("publicTotalAmount", "Harga Tiket Pemandu", {
      meta: { sum: true, isCurrency: true, label: "Harga Tiket Pemandu" },
      cell: ({ row }) => formatRupiah(row.getValue("publicTotalAmount")),
    }),
    createColumn("customMemberTotal", "Total Khusus", {
      meta: { sum: true, label: "Total Khusus" },
    }),
    createColumn("customTotalAmount", "Harga Tiket Khusus", {
      meta: { sum: true, isCurrency: true, label: "Harga Tiket Khusus" },
      cell: ({ row }) => formatRupiah(row.getValue("customTotalAmount")),
    }),
    createColumn("visitorMemberTotal", "Total Pengunjung", {
      meta: { sum: true, label: "Total Pengunjung" },
    }),
    createColumn("totalPaymentAmount", "Total Harga Tiket", {
      meta: { sum: true, isCurrency: true, label: "Total Harga Tiket" },
      cell: ({ row }) => formatRupiah(row.getValue("totalPaymentAmount")),
    }),

    createColumn("actualMemberTotal", "Total Kehadiran", {
      meta: { sum: true, label: "Total Kehadiran" },
    }),

    createColumn("paymentMethod", "Metode Pembayaran"),
    createColumn("downPayment", "Uang Pembayaran", {
      meta: { sum: true, isCurrency: true, label: "Uang Bayar" },
      cell: ({ row }) => formatRupiah(row.getValue("downPayment")),
    }),
    createColumn("changeAmount", "Uang Kembalian", {
      meta: { sum: true, isCurrency: true, label: "Uang Kembalian" },
      cell: ({ row }) => formatRupiah(row.getValue("changeAmount")),
    }),
    createColumn("statusPayment", "Status Pembayaran", {
      cell: ({ row }) => {
        const status = row.getValue("statusPayment");
        return (
          <Badge variant={status === "Lunas" ? "success" : "destructive"}>
            {row.getValue("statusPayment")}
          </Badge>
        );
      },
    }),

    createActionsColumn<CustomReservationFullTypes>(
      (item) => navigate(`edit/${item.reservationNumber}`),
      onDelete,
      (item) => navigate(`print/${item.reservationNumber}`)
    ),
  ];
}

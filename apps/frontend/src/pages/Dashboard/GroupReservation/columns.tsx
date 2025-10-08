import { type GroupReservationFullTypes } from "@rzkyakbr/types";
import { type ColumnDef } from "@tanstack/react-table";
import { formatRupiah } from "@rzkyakbr/libs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  createColumn,
  createActionsColumn,
  createSelectColumn,
} from "@/components/table/column-factory";
import { useNavigate } from "react-router";

export function useGroupReservationColumns(
  onDelete: (item: GroupReservationFullTypes) => void
): ColumnDef<GroupReservationFullTypes>[] {
  const navigate = useNavigate();

  return [
    createSelectColumn<GroupReservationFullTypes>(),

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
      cell: ({ row }) =>
        format(new Date(row.original.visitingDate), "dd MMMM yyyy", {
          locale: id,
        }),
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

    createColumn("reservationMechanism", "Mekanisme Reservasi"),
    createColumn("reservationStatus", "Status Reservasi"),

    createColumn("studentMemberTotal", "Total Pelajar", {
      meta: { sum: true, label: "Total Pelajar" },
    }),
    createColumn("studentTotalAmount", "Harga Tiket Pelajar", {
      meta: { sum: true, isCurrency: true, label: "Harga Tiket Pelajar" },
      cell: ({ row }) => formatRupiah(row.getValue("studentTotalAmount")),
    }),
    createColumn("publicMemberTotal", "Total Umum", {
      meta: { sum: true, label: "Total Umum" },
    }),
    createColumn("publicTotalAmount", "Harga Tiket Umum", {
      meta: { sum: true, isCurrency: true, label: "Harga Tiket Umum" },
      cell: ({ row }) => formatRupiah(row.getValue("publicTotalAmount")),
    }),
    createColumn("foreignMemberTotal", "Total Asing", {
      meta: { sum: true, label: "Total Asing" },
    }),
    createColumn("foreignTotalAmount", "Harga Tiket Asing", {
      meta: { sum: true, isCurrency: true, label: "Harga Tiket Asing" },
      cell: ({ row }) => formatRupiah(row.getValue("foreignTotalAmount")),
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

    createActionsColumn<GroupReservationFullTypes>(
      (item) => navigate(`edit/${item.reservationNumber}`),
      onDelete,
      (item) => navigate(`print/${item.reservationNumber}`)
    ),
  ];
}

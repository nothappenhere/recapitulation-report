import { type CustomReservationFullTypes } from "@rzkyakbr/types";
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

export function useCustomReservationColumns(
  onDelete: (item: CustomReservationFullTypes) => void
): ColumnDef<CustomReservationFullTypes>[] {
  const navigate = useNavigate();

  return [
    createSelectColumn<CustomReservationFullTypes>(),

    createColumn("customReservationNumber", "Kode Reservasi"),
    createColumn("agent", "Petugas Reservasi", {
      cell: ({ row }) => {
        const agent = row.original.agent as unknown as {
          fullName: string;
        } | null;
        return <span>{agent?.fullName ?? "-"}</span>;
      },
    }),

    createColumn("visitingDate", "Tgl. Kunjungan", {
      cell: ({ row }) =>
        format(new Date(row.original.visitingDate), "dd MMMM yyyy", {
          locale: id,
        }),
    }),
    createColumn("visitingHour", "Wkt. Kunjungan", {
      cell: ({ row }) => {
        const visitingHour = row.original.visitingHour as unknown as {
          timeRange: string;
        } | null;
        return <span>{visitingHour?.timeRange ?? "-"} WIB</span>;
      },
    }),
    createColumn("ordererName", "Nama Pemesan"),
    createColumn("phoneNumber", "No. Telepon"),
    createColumn("groupName", "Nama Rombongan"),

    createColumn("address", "Alamat"),
    createColumn("country", "Negara Asal"),

    createColumn("reservationMechanism", "Mekanisme Reservasi"),
    createColumn("reservationStatus", "Status Reservasi"),
    createColumn("description", "Deskripsi"),

    createColumn("publicMemberTotal", "Jumlah Umum", {
      meta: { sum: true, label: "Jumlah Umum" },
    }),
    createColumn("publicTotalAmount", "Harga Tiket Umum", {
      meta: { sum: true, isCurrency: true, label: "Harga Tiket Umum" },
      cell: ({ row }) => formatRupiah(row.getValue("publicTotalAmount")),
    }),
    createColumn("customMemberTotal", "Jumlah Khusus", {
      meta: { sum: true, label: "Jumlah Khusus" },
    }),
    createColumn("customTotalAmount", "Harga Tiket Khusus", {
      meta: { sum: true, isCurrency: true, label: "Harga Tiket Khusus" },
      cell: ({ row }) => formatRupiah(row.getValue("foreignTotalAmount")),
    }),
    createColumn("visitorMemberTotal", "Total Pengunjung", {
      meta: { sum: true, label: "Total Pengunjung" },
    }),
    createColumn("totalPaymentAmount", "Total Harga Tiket", {
      meta: { sum: true, isCurrency: true, label: "Total Harga Tiket" },
      cell: ({ row }) => formatRupiah(row.getValue("totalPaymentAmount")),
    }),

    createColumn("actualMemberTotal", "Jumlah Kedatangan", {
      meta: { sum: true, label: "Jumlah Kedatangan" },
    }),

    createColumn("paymentMethod", "Metode Pemb."),
    createColumn("downPayment", "Uang Pemb.", {
      meta: { sum: true, isCurrency: true, label: "Uang Bayar" },
      cell: ({ row }) => formatRupiah(row.getValue("downPayment")),
    }),
    createColumn("changeAmount", "Uang Kembalian", {
      meta: { sum: true, isCurrency: true, label: "Uang Kembalian" },
      cell: ({ row }) => formatRupiah(row.getValue("changeAmount")),
    }),
    createColumn("statusPayment", "Status Pemb.", {
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
      (item) => navigate(`edit/${item.customReservationNumber}`),
      onDelete,
      (item) => navigate(`print/${item.customReservationNumber}`)
    ),
  ];
}

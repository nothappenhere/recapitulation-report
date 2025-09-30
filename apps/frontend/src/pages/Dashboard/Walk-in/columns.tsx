import { type WalkInFullTypes } from "@rzkyakbr/types";
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

export function useWalkInColumns(
  onDelete: (item: WalkInFullTypes) => void
): ColumnDef<WalkInFullTypes>[] {
  const navigate = useNavigate();

  return [
    createSelectColumn<WalkInFullTypes>(),

    createColumn("walkInNumber", "Kode Kunjungan"),
    createColumn("agent", "Petugas Tiket", {
      cell: ({ row }) => {
        const agent = row.original.agent as unknown as {
          fullName: string;
        } | null;
        return <span>{agent?.fullName ?? "-"}</span>;
      },
    }),

    createColumn("visitingDate", "Tgl. Kunjungan", {
      cell: ({ row }) =>
        format(new Date(row.original.visitingDate), "dd MMM yyyy, HH:mm:ss", {
          locale: id,
        }),
    }),
    createColumn("ordererName", "Nama Pemesan"),
    createColumn("phoneNumber", "No. Telepon"),

    createColumn("address", "Alamat"),
    createColumn("country", "Negara Asal"),

    createColumn("studentMemberTotal", "Jumlah Pelajar", {
      meta: { sum: true, label: "Jumlah Pelajar" },
    }),
    createColumn("studentTotalAmount", "Harga Tiket Pelajar", {
      meta: { sum: true, isCurrency: true, label: "Harga Tiket Pelajar" },
      cell: ({ row }) => formatRupiah(row.getValue("studentTotalAmount")),
    }),
    createColumn("publicMemberTotal", "Jumlah Umum", {
      meta: { sum: true, label: "Jumlah Umum" },
    }),
    createColumn("publicTotalAmount", "Harga Tiket Umum", {
      meta: { sum: true, isCurrency: true, label: "Harga Tiket Umum" },
      cell: ({ row }) => formatRupiah(row.getValue("publicTotalAmount")),
    }),
    createColumn("foreignMemberTotal", "Jumlah Asing", {
      meta: { sum: true, label: "Jumlah Asing" },
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

    createActionsColumn<WalkInFullTypes>(
      (item) => navigate(`edit/${item.walkInNumber}`),
      onDelete,
      (item) => navigate(`print/${item.walkInNumber}`)
    ),
  ];
}

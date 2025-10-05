import { type DailyRecapFullTypes } from "@rzkyakbr/types";
import { type ColumnDef } from "@tanstack/react-table";
import { formatRupiah } from "@rzkyakbr/libs";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  createColumn,
  createActionsColumn,
  createSelectColumn,
} from "@/components/table/column-factory";
import { useNavigate } from "react-router";

export function useDailyRecapColumns(
  onDelete: (item: DailyRecapFullTypes) => void
): ColumnDef<DailyRecapFullTypes>[] {
  const navigate = useNavigate();

  return [
    createSelectColumn<DailyRecapFullTypes>(),

    createColumn("recapNumber", "Kode Rekapitulasi"),
    createColumn("agent", "Petugas Rekapitulasi", {
      cell: ({ row }) => {
        const agent = row.original.agent as unknown as {
          fullName: string;
        } | null;
        return <span>{agent?.fullName ?? "-"}</span>;
      },
    }),

    createColumn("recapDate", "Tgl. Rekapitulasi", {
      cell: ({ row }) =>
        format(new Date(row.original.recapDate), "dd MMMM yyyy, HH:mm:ss", {
          locale: id,
        }),
    }),
    createColumn("description", "Deskripsi"),

    createColumn("initialStudentSerialNumber", "No. Seri Awal Pelajar", {
      meta: { sum: true, label: "No. Seri Awal Pelajar" },
    }),
    createColumn("finalStudentSerialNumber", "No. Seri Akhir Pelajar", {
      meta: { sum: true, label: "No. Seri Akhir Pelajar" },
    }),
    createColumn("initialPublicSerialNumber", "No. Seri Awal Umum", {
      meta: { sum: true, label: "No. Seri Awal Umum" },
    }),
    createColumn("finalPublicSerialNumber", "No. Seri Akhir Umum", {
      meta: { sum: true, label: "No. Seri Akhir Umum" },
    }),
    createColumn("initialForeignSerialNumber", "No. Seri Awal Asing", {
      meta: { sum: true, label: "No. Seri Awal Asing" },
    }),
    createColumn("finalForeignSerialNumber", "No. Seri Akhir Asing", {
      meta: { sum: true, label: "No. Seri Akhir Asing" },
    }),

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

    createActionsColumn<DailyRecapFullTypes>(
      (item) => navigate(`edit/${item.recapNumber}`),
      onDelete
    ),
  ];
}

import { formatPhoneNumber, formatRupiah } from "@rzkyakbr/libs";
import { type TWalkIn } from "@rzkyakbr/schemas";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  createColumn,
  createActionsColumn,
  selectColumn,
} from "./column-utils";
import { useNavigate } from "react-router";

export function useWalkInColumns(
  onDelete: (item: TWalkIn) => void
): ColumnDef<TWalkIn>[] {
  const navigate = useNavigate();

  return [
    selectColumn,
    createColumn("ordererNameOrTravelName", "Nama Pemesan / Travel"),
    createColumn("phoneNumber", "No. telepon", {
      cell: ({ row }) => formatPhoneNumber(row.getValue("phoneNumber")),
    }),

    createColumn("visitingDate", "Tgl. Kunjungan", {
      cell: ({ row }) =>
        format(new Date(row.original.visitingDate), "PPP", { locale: id }),
    }),
    createColumn("visitingHour", "Wkt. Kunjungan", {
      cell: ({ row }) => {
        const visitingHour = row.original.visitingHour as unknown as {
          timeRange: string;
        } | null;
        return <span>{visitingHour?.timeRange ?? "-"} WIB</span>;
      },
    }),

    createColumn("address", "Alamat"),

    createColumn("studentMemberTotal", "Jumlah Pelajar", {
      meta: { sum: true, label: "Jumlah Pelajar" },
    }),
    createColumn("publicMemberTotal", "Jumlah Umum", {
      meta: { sum: true, label: "Jumlah Umum" },
    }),
    createColumn("foreignMemberTotal", "Jumlah Asing", {
      meta: { sum: true, label: "Jumlah Asing" },
    }),
    createColumn("customMemberTotal", "Jumlah Khusus", {
      meta: { sum: true, label: "Jumlah Khusus" },
    }),
    createColumn("groupMemberTotal", "Jumlah Keseluruhan", {
      meta: { sum: true, label: "Jumlah Keseluruhan" },
    }),

    createColumn("paymentAmount", "Total Pembayaran", {
      meta: { sum: true, isCurrency: true, label: "Total Pembayaran" },
      cell: ({ row }) => formatRupiah(row.getValue("paymentAmount")),
    }),
    createColumn("downPayment", "Uang Muka", {
      meta: { sum: true, isCurrency: true, label: "Uang Muka" },
      cell: ({ row }) => formatRupiah(row.getValue("downPayment")),
    }),
    createColumn("changeAmount", "Uang Kembalian", {
      meta: { sum: true, isCurrency: true, label: "Uang Kembalian" },
      cell: ({ row }) => formatRupiah(row.getValue("changeAmount")),
    }),
    createColumn("paymentMethod", "Metode Pembayaran"),
    createColumn("statusPayment", "Status", {
      cell: ({ row }) => {
        const status = row.getValue("statusPayment");
        return (
          <Badge
            variant={
              status === "Paid"
                ? "success"
                : status === "DP"
                ? "warning"
                : "destructive"
            }
          >
            {row.getValue("statusPayment")}
          </Badge>
        );
      },
    }),

    createActionsColumn(
      (wi) => navigate(`/dashboard/visits/${wi._id}?tab=walk-in`),
      onDelete
    ),
  ];
}

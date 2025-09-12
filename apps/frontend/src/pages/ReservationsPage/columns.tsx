import { formatPhoneNumber, formatRupiah } from "@rzkyakbr/libs";
import { type TBookingReservation } from "@rzkyakbr/schemas";
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

export function useReservationColumns(
  onDelete: (item: TBookingReservation) => void
): ColumnDef<TBookingReservation>[] {
  const navigate = useNavigate();

  return [
    selectColumn,
    // createColumn("reservationNumber", "No. Reservasi"),
    createColumn("ordererNameOrTravelName", "Nama Pemesan / Travel"),
    createColumn("phoneNumber", "No. telepon", {
      cell: ({ row }) => formatPhoneNumber(row.getValue("phoneNumber")),
    }),

    createColumn("groupName", "Nama Rombongan"),
    createColumn("studentMemberTotal", "Jumlah Pelajar"),
    createColumn("publicMemberTotal", "Jumlah Umum"),
    createColumn("foreignMemberTotal", "Jumlah Asing"),
    createColumn("customMemberTotal", "Jumlah Khusus"),
    createColumn("groupMemberTotal", "Jumlah Keseluruhan"),

    createColumn("visitingDate", "Tgl. Kunjungan", {
      cell: ({ row }) =>
        format(new Date(row.original.visitingDate), "PPP", { locale: id }),
    }),
    createColumn("visitingHour", "Wkt. Kunjungan", {
      cell: ({ row }) => {
        <span>{row.getValue("visitingHour")} WIB</span>;
      },
    }),

    createColumn("address", "Alamat"),
    // createColumn("category", "Kategori"),

    createColumn("paymentAmount", "Total Pembayaran", {
      cell: ({ row }) => formatRupiah(row.getValue("paymentAmount")),
    }),
    createColumn("downPayment", "Uang Muka", {
      cell: ({ row }) => formatRupiah(row.getValue("downPayment")),
    }),
    createColumn("changeAmount", "Uang Kembalian", {
      cell: ({ row }) => formatRupiah(row.getValue("changeAmount")),
    }),
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
      (r) => navigate(`/dashboard/reservation/${r._id}`),
      onDelete
    ),
  ];
}

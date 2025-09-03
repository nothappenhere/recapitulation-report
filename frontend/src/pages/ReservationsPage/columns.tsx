import { formatPhoneNumber, formatRupiah } from "@/lib/formatter";
import { type ReservationFormValues } from "@/schemas/reservationSchema";
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
  onDelete: (item: ReservationFormValues) => void
): ColumnDef<ReservationFormValues>[] {
  const navigate = useNavigate();

  return [
    selectColumn,
    createColumn("reservationNumber", "No. Reservasi"),
    createColumn("ordererName", "Nama Pemesan"),
    createColumn("phoneNumber", "No. Telp", {
      cell: ({ row }) => (
        <span>{formatPhoneNumber(row.getValue("phoneNumber"))}</span>
      ),
    }),
    createColumn("groupName", "Nama Rombongan"),
    createColumn("groupMemberTotal", "Jumlah Anggota"),
    createColumn("reservationDate", "Tgl. Kunjungan", {
      cell: ({ row }) =>
        format(new Date(row.original.reservationDate), "PPP", { locale: id }),
    }),
    createColumn("visitingHour", "Wkt. Kunjungan", {
      cell: ({ row }) => <div>{row.getValue("visitingHour")} WIB</div>,
    }),
    createColumn("address", "Alamat"),
    createColumn("category", "Kategori"),
    createColumn("paymentAmount", "Total Pembayaran", {
      cell: ({ row }) => formatRupiah(row.getValue("paymentAmount")),
    }),
    createColumn("downPayment", "Uang Muka", {
      cell: ({ row }) => formatRupiah(row.getValue("downPayment")),
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

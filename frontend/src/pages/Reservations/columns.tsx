import { Button } from "@/components/ui/button";
import { formatPhoneNumber, formatRupiah } from "@/lib/formatter";
import type { ReservationFormValues } from "@/schemas/reservationSchema";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface SortableHeaderProps {
  column: Column<any, unknown>;
  title: string;
}

export default function SortableHeader({ column, title }: SortableHeaderProps) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="size-4 mt-0.5" />
    </Button>
  );
}

export const columns: ColumnDef<ReservationFormValues>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="me-2"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="me-2"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "reservationNumber",
    header: ({ column }) => (
      <SortableHeader column={column} title="No. Reservasi" />
    ),
    filterFn: (row, columnId, filterValue) => {
      return String(row.getValue(columnId)).includes(filterValue);
    },
    meta: {
      label: "No. Reservasi",
    },
  },
  {
    accessorKey: "ordererName",
    header: ({ column }) => (
      <SortableHeader column={column} title="Nama Pemesan" />
    ),
    meta: {
      label: "Nama Pemesan",
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => <SortableHeader column={column} title="No. Telp" />,
    meta: {
      label: "No. Telp",
    },
    cell: ({ row }) => {
      const phone = row.getValue("phoneNumber") as string;
      return <span>{formatPhoneNumber(phone)}</span>;
    },
  },
  {
    accessorKey: "groupName",
    header: ({ column }) => (
      <SortableHeader column={column} title="Nama Rombongan" />
    ),
    meta: {
      label: "Nama Rombongan",
    },
  },
  {
    accessorKey: "groupMemberTotal",
    header: ({ column }) => (
      <SortableHeader column={column} title="Jumlah Anggota" />
    ),
    meta: {
      label: "Jumlah Anggota",
    },
  },
  {
    accessorKey: "reservationDate",
    header: ({ column }) => (
      <SortableHeader column={column} title="Tgl. Kunjungan" />
    ),
    cell: ({ row }) => {
      return format(new Date(row.original.reservationDate), "PPP", {
        locale: id,
      });
    },
    filterFn: (row, columnId, filterValue) => {
      return row
        .getValue(columnId)
        ?.toLowerCase()
        .includes(filterValue.toLowerCase());
    },
    meta: {
      label: "Tgl. Kunjungan",
    },
  },
  {
    accessorKey: "visitingHour",
    header: ({ column }) => (
      <SortableHeader column={column} title="Wkt. Kunjungan" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("visitingHour")} WIB</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      return row
        .getValue(columnId)
        ?.toLowerCase()
        .includes(filterValue.toLowerCase());
    },
    meta: {
      label: "Wkt. Kunjungan",
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => <SortableHeader column={column} title="Alamat" />,
    meta: {
      label: "Alamat",
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => <SortableHeader column={column} title="Kategori" />,
    meta: {
      label: "Kategori",
    },
  },
  {
    accessorKey: "downPayment",
    header: ({ column }) => (
      <SortableHeader column={column} title="Uang Muka" />
    ),
    cell: ({ row }) => {
      const totalPayment = parseFloat(row.getValue("downPayment"));
      return <div>{formatRupiah(totalPayment)}</div>;
    },
    meta: {
      label: "Uang Muka",
    },
  },
  {
    accessorKey: "paymentAmount",
    header: ({ column }) => (
      <SortableHeader column={column} title="Total Pembayaran" />
    ),
    cell: ({ row }) => {
      const totalPayment = parseFloat(row.getValue("paymentAmount"));
      return <div>{formatRupiah(totalPayment)}</div>;
    },
    meta: {
      label: "Total Pembayaran",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return (
        <Badge variant="success">{row.getValue("status") || "Paid"}</Badge>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      return String(row.getValue(columnId)).includes(filterValue);
    },
    meta: {
      label: "Status",
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const reservations = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <Ellipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>More Actions</DropdownMenuLabel>
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(
                  String(reservations.reservationNumber)
                )
              }
            >
              Copy reservation ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    meta: {
      label: "Actions",
    },
  },
];

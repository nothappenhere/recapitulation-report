import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router";
import { formatRupiah } from "@rzkyakbr/libs";
import { Label } from "../ui/label";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addTitle?: string;
  colSpan: number;
  onRefresh?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  addTitle,
  colSpan,
  onRefresh,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div>
      {/* Header Control */}
      <div className="flex items-center justify-between py-4">
        {/* Search Filters */}
        <Input
          placeholder={
            location.pathname.includes("user-management")
              ? "Cari berdasarkan NIP, Jabatan, Nama lengkap, Username, dll..."
              : location.pathname.includes("daily-recap")
              ? "Cari berdasarkan Kode, Nama Petugas, Tgl/Wkt Rekap, dll..."
              : "Cari berdasarkan Kode, Nama Petugas/Pemesan, Tgl/Wkt Kunjungan, dll..."
          }
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-lg"
          autoFocus
        />

        <div className="flex justify-evenly items-center gap-3">
          {/* Refresh Button */}
          {onRefresh && (
            <Button onClick={onRefresh}>
              <RefreshCw className="mt-0.5" />
              Refresh
            </Button>
          )}

          {/* Add Button */}
          {addTitle && (
            <Button variant="outline" asChild>
              <Link to="add">
                <Plus className="mt-0.5" />
                {addTitle}
              </Link>
            </Button>
          )}

          {/* Dropdown column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <span>Pilih Kolom</span>
                <ChevronDown className="mt-0.5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.columnDef.meta?.label ?? column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const statusReservation = row.original.reservationStatus;
                const statusPayment = row.original.statusPayment;
                let statusReservationClass = "";
                let statusPaymentClass = "";
                let rowClass = "";

                switch (statusReservation) {
                  case "Hadir":
                    statusReservationClass =
                      "bg-green-100 hover:bg-green-200 data-[state=selected]:bg-green-300";
                    break;
                  case "Reschedule":
                    statusReservationClass =
                      "bg-yellow-100 hover:bg-yellow-200 data-[state=selected]:bg-yellow-300";
                    break;
                  case "Batal Hadir":
                    statusReservationClass =
                      "bg-red-100 hover:bg-red-200 data-[state=selected]:bg-red-300";
                    break;
                  case "Lainnya":
                    statusReservationClass =
                      "bg-blue-100 hover:bg-blue-200 data-[state=selected]:bg-blue-300";
                    break;
                  default:
                    statusReservationClass = "";
                    break;
                }

                switch (statusPayment) {
                  case "Lunas":
                    statusPaymentClass =
                      "bg-green-100 hover:bg-green-200 data-[state=selected]:bg-green-300";
                    break;
                  case "Belum Bayar":
                    statusPaymentClass =
                      "bg-red-100 hover:bg-red-200 data-[state=selected]:bg-red-300";
                    break;
                  default:
                    statusPaymentClass = "";
                    break;
                }

                if (location.pathname.includes("walk-in")) {
                  rowClass = statusPaymentClass;
                } else if (
                  location.pathname.includes("group-reservation") ||
                  location.pathname.includes("custom-reservation")
                ) {
                  rowClass = statusReservationClass;
                }

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`cursor-pointer ${rowClass}`}
                    onClick={() => {
                      if (!location.pathname.includes("user-management")) {
                        navigate(
                          `edit/${
                            row.original.walkinNumber ||
                            row.original.groupReservationNumber ||
                            row.original.customReservationNumber ||
                            row.original.recapNumber
                          }`
                        );
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="max-w-[300px] overflow-hidden text-ellipsis"
                        onClick={(e) => {
                          // Cegah navigate jika klik checkbox atau kolom actions
                          if (
                            cell.column.id === "select" ||
                            cell.column.id === "actions"
                          ) {
                            e.stopPropagation();
                          }
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-20 text-center"
                >
                  Tidak ada hasil.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {!location.pathname.includes("user-management") && (
            <TableFooter>
              <TableRow>
                {table.getVisibleLeafColumns().map((column, idx) => {
                  const rows = table.getRowModel().rows;

                  // kolom dengan meta.sum = true
                  if (column.columnDef.meta?.sum) {
                    const total = rows.reduce((acc, row) => {
                      const value = row.getValue<number>(column.id);
                      return acc + (typeof value === "number" ? value : 0);
                    }, 0);

                    return (
                      <TableCell key={column.id} className="font-bold">
                        {column.columnDef.meta?.isCurrency
                          ? formatRupiah(total)
                          : total}
                      </TableCell>
                    );
                  }

                  // kolom pertama → label Total
                  if (idx === 0) {
                    return (
                      <TableCell
                        key={column.id}
                        className="font-bold"
                        colSpan={colSpan}
                      >
                        Total
                      </TableCell>
                    );
                  }

                  if (idx < colSpan) return null;

                  return <TableCell key={column.id}>&ndash;</TableCell>;
                })}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-between space-x-2 py-4 px-2">
        {/* Selection Control */}
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} dari{" "}
          {table.getFilteredRowModel().rows.length} baris yang dipilih.
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Baris per halaman
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger size="sm" className="w-16" id="rows-per-page">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pagination Control */}
        <div className="flex justify-center items-center">
          <Button
            variant={!table.getCanPreviousPage() ? "outline" : "default"}
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="mt-0.5" />
            Sebelumnya
          </Button>
          <div>
            <span className="inline-flex items-center space-x-1 rounded-md bg-white px-4 py-2 text-muted-foreground text-sm">
              Halaman{" "}
              <b className="mx-1">
                {table.getState().pagination.pageIndex + 1}
              </b>{" "}
              dari <b className="ml-1">{table.getPageCount()}</b>
            </span>
          </div>
          <Button
            variant={!table.getCanNextPage() ? "outline" : "default"}
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Berikutnya
            <ChevronRight className="mt-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

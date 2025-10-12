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
  FileDown,
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
import { formatRupiah, slugToTitle } from "@rzkyakbr/libs";
import { Label } from "../ui/label";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface ExportColumnsProps {
  key: string;
  header: string;
  type: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addTitle?: string;
  colSpan?: number;
  onRefresh?: () => void;
  worksheetName?: string;
  exportColumns?: ExportColumnsProps[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  addTitle,
  colSpan,
  onRefresh,
  worksheetName,
  exportColumns,
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

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(worksheetName || "Worksheet");

    if (!exportColumns || exportColumns.length === 0) return;

    // 1. Buat header
    worksheet.columns = exportColumns.map((col) => ({
      header: col.header,
      key: col.key,
      width: 20,
      style: {
        alignment: {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        },
      },
    }));

    // 2. Ambil data yang tampil
    const rows = table.getRowModel().rows.map((row) => row.original);

    // 3. Tambahkan data dengan format
    rows.forEach((item) => {
      const rowData: Record<string, unknown> = {};

      exportColumns.forEach((col) => {
        let value = item[col.key];

        // Format khusus
        switch (col.type) {
          case "dateOnly":
            value = value
              ? format(new Date(value), "dd MMMM yyyy", {
                  locale: id,
                })
              : "-";
            break;
          case "dateWithTime":
            value = value
              ? format(new Date(value), "dd MMMM yyyy, HH:mm:ss", {
                  locale: id,
                })
              : "-";
            break;
          case "currency":
            value = typeof value === "number" ? formatRupiah(value) : value;
            break;
          case "timeRange":
            value =
              typeof value === "object" && value !== null
                ? `${value?.timeRange} WIB`
                : "-";
            break;
          case "fullName":
            value =
              typeof value === "object" && value !== null
                ? value.fullName ?? "-"
                : "-";
            break;
        }

        rowData[col.key] = value;
      });

      worksheet.addRow(rowData);
    });

    // 4. Bold header
    worksheet.getRow(1).font = { bold: true };

    // 5. Resize kolom otomatis berdasarkan isi
    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const cellLength = `${cell.value ?? ""}`.length;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      });
      column.width = maxLength + 2;
    });

    // 6. Export
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${worksheetName?.toLowerCase().replace(/\s+/g, "-")}.xlsx`);

    // 7. Kembalikan 10 data per halaman
    table.setPageSize(10);
  };

  return (
    <div>
      {/* Header Control */}
      <div className="flex items-center justify-between py-4">
        <div className="flex justify-start items-center gap-3 w-full">
          {/* Search Filters */}
          <Input
            placeholder={
              location.pathname.includes("user-management")
                ? "Cari berdasarkan NIP, Jabatan, Nama lengkap, Username, Role, dll..."
                : location.pathname.includes("daily-recap")
                ? "Cari berdasarkan Kode, Nama Petugas, Tgl/Jam Rekapitulasi, dll..."
                : "Cari berdasarkan Kode, Nama Pemesan, No. Telepon, Tgl/Jam Kunjungan, dll..."
            }
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-full max-w-lg"
            autoFocus
          />

          {/* Refresh Button */}
          {onRefresh && (
            <Button onClick={onRefresh}>
              <RefreshCw className="mt-0.5" />
              Refresh
            </Button>
          )}
        </div>

        <div className="flex justify-evenly items-center gap-3">
          {/* Add Button */}
          {addTitle && (
            <Button variant="outline" asChild>
              <Link to="add">
                <Plus className="mt-0.5" />
                {addTitle}
              </Link>
            </Button>
          )}

          {/* Export Button */}
          <Button
            onClick={handleExportToExcel}
            disabled={table.getRowModel().rows.length === 0}
          >
            <FileDown />
            Export
          </Button>

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

                if (location.pathname.includes("direct-reservation")) {
                  rowClass = statusPaymentClass;
                } else if (
                  location.pathname.includes("group-reservation") ||
                  location.pathname.includes("custom-reservation")
                ) {
                  rowClass = statusReservationClass;
                } else {
                  rowClass =
                    "hover:bg-gray-100 data-[state=selected]:bg-gray-200";
                }

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`cursor-pointer ${rowClass}`}
                    onClick={() => {
                      navigate(
                        `edit/${
                          row.original.username ||
                          row.original.reservationNumber ||
                          row.original.recapNumber
                        }`
                      );
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
              const newSize = Number(value);
              if (newSize === -1) {
                // Tampilkan semua baris
                table.setPageSize(data.length);
              } else {
                table.setPageSize(newSize);
              }
            }}
          >
            <SelectTrigger
              size="sm"
              id="rows-per-page"
              className={
                table.getState().pagination.pageSize === data.length
                  ? "w-24"
                  : "w-16"
              }
            >
              <SelectValue placeholder={table.getState().pagination.pageSize}>
                {table.getState().pagination.pageSize === data.length
                  ? "Semua"
                  : table.getState().pagination.pageSize}
              </SelectValue>
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}

              {/* Opsi tampilkan semua */}
              <SelectItem value="-1">Semua</SelectItem>
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

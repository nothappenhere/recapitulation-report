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
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router";
import { formatRupiah } from "@rzkyakbr/libs";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addTitle: string;
  colSpan: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  addTitle,
  colSpan,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const navigate = useNavigate();

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
          placeholder="Cari berdasarkan Nama Pemesan, Tanggal / Waktu Kunjungan, dll..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-md"
        />

        <div className="flex justify-evenly items-center gap-3">
          {/* Add Button */}
          <Button asChild>
            <Link to="add">{addTitle}</Link>
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

      <div className="overflow-hidden rounded-sm border">
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
                const status = row.original.reservationStatus; // ambil dari data
                let statusClass = "";

                switch (status) {
                  case "Batal":
                    statusClass = "bg-red-300";
                    break;
                  case "Reschedule":
                    statusClass = "bg-yellow-200";
                    break;
                  case "Lainnya":
                    statusClass = "bg-blue-200";
                    break;
                  default:
                    statusClass = "";
                    break;
                }

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`cursor-pointer data-[state=selected]:bg-stone-300 ${statusClass}`}
                    onClick={() => navigate(`edit/${row.original._id}`)} // klik baris → navigate
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
        </Table>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-between space-x-2 py-4 px-2">
        {/* Selection Control */}
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} dari{" "}
          {table.getFilteredRowModel().rows.length} baris yang dipilih.
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

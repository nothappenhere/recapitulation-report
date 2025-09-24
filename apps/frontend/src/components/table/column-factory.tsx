/* eslint-disable react-refresh/only-export-components */
import { type Column, type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ColumnsActions } from "@/components/table/column-actions";

// Reusable Sortable Header
export function SortableHeader({
  column,
  title,
}: {
  column: Column<any, any>;
  title: string;
}) {
  return (
    <Button
      variant="ghost"
      className="hover:bg-neutral-300 rounded-xs"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="size-4 mt-0.5" />
    </Button>
  );
}

// Reusable Select Column
export function createSelectColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="me-2 border-black"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Pilih semua"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="me-2 border-black"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Pilih baris"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

// Reusable Column Generator
export function createColumn<T>(
  accessorKey: keyof T,
  title: string,
  options?: Partial<ColumnDef<T>>
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header: ({ column }) => <SortableHeader column={column} title={title} />,
    filterFn: (row, columnId, filterValue) =>
      String(row.getValue(columnId))
        .toLowerCase()
        .includes(filterValue.toLowerCase()),
    meta: { label: title },
    ...options,
  };
}

// Reusable Actions Column
export function createActionsColumn<T extends { _id?: string }>(
  onEdit: (item: T) => void,
  onDelete: (item: T) => void,
  onPrint?: (item: T) => void
): ColumnDef<T> {
  return {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <ColumnsActions
          item={data}
          getId={(item) => item._id || ""}
          onEdit={onEdit}
          onDelete={onDelete}
          onPrint={onPrint}
        />
      );
    },
    meta: { label: "Actions" },
  };
}

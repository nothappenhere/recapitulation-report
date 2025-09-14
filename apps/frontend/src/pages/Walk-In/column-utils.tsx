/* eslint-disable react-refresh/only-export-components */
import { type TWalkIn } from "@rzkyakbr/schemas";
import { type Column, type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnsActions } from "@/components/table/column-actions";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// Sortable Header
export default function SortableHeader({
  column,
  title,
}: {
  column: Column<any, unknown>;
  title: string;
}) {
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

// Selection Column
export const selectColumn: ColumnDef<TWalkIn> = {
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
};

// Generic Column Creator
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

// Dynamic Actions Column Creator
export function createActionsColumn(
  onEdit: (item: TWalkIn) => void,
  onDelete: (item: TWalkIn) => void
): ColumnDef<TWalkIn> {
  return {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const reservation = row.original;

      return (
        <ColumnsActions
          item={reservation}
          getId={(wi) => wi._id || ""}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
    meta: { label: "Actions" },
  };
}

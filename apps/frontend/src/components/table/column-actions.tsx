import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  CopyPlusIcon,
  Ellipsis,
  PrinterIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";

export type ColumnsActionsProps<T> = {
  item: T; // data (reservation, walk-in, dll)
  getId: (item: T) => string | number; // ambil unique ID
  onEdit?: (item: T) => void; // aksi edit
  onDelete?: (item: T) => void; // aksi delete
  onPrint?: (item: T) => void; // aksi print
};

export function ColumnsActions<T>({
  item,
  getId,
  onEdit,
  onDelete,
  onPrint,
}: ColumnsActionsProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-8 p-0 hover:bg-neutral-200 hover:border hover:border-black"
        >
          <span className="sr-only">Open menu</span>
          <Ellipsis className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {/* Copy ID */}
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(String(getId(item)))}
        >
          <CopyPlusIcon size={16} aria-hidden="true" />
          Copy ID
        </DropdownMenuItem>
        {/* Print */}
        {onPrint && (
          <DropdownMenuItem onClick={() => onPrint(item)}>
            <PrinterIcon size={16} aria-hidden="true" />
            Print
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Edit */}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(item)}>
            <SquarePenIcon size={16} aria-hidden="true" />
            Edit
          </DropdownMenuItem>
        )}
        {/* Delete */}
        {onDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(item)}
            variant="destructive"
          >
            <Trash2Icon size={16} aria-hidden="true" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

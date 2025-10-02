import { type UserFullTypes } from "@rzkyakbr/types";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  createColumn,
  createActionsColumn,
  createSelectColumn,
} from "@/components/table/column-factory";

export function useUserColumns(
  onDelete: (item: UserFullTypes) => void,
  onEdit: (item: UserFullTypes) => void
): ColumnDef<UserFullTypes>[] {
  return [
    createSelectColumn<UserFullTypes>(),

    createColumn("NIP", "Nomor Induk Pegawai"),
    createColumn("position", "Jabatan"),
    createColumn("fullName", "Nama Lengkap"),
    createColumn("username", "Username"),
    createColumn("role", "Role"),

    createColumn("lastLogin", "Terakhir Login", {
      cell: ({ row }) => {
        const lastLogin = row.original.lastLogin;
        if (!lastLogin) return "–";
        const date = new Date(lastLogin);
        if (isNaN(date.getTime())) return "–";
        return format(date, "dd MMM yyyy, HH:mm:ss", {
          locale: id,
        });
      },
    }),

    createActionsColumn<UserFullTypes>(onEdit, onDelete),
  ];
}

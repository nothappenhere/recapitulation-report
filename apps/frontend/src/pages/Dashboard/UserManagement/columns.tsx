import { type UserFullTypes } from "@rzkyakbr/types";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  createColumn,
  createActionsColumn,
  createSelectColumn,
} from "@/components/table/column-factory";
import { useNavigate } from "react-router";

export function useUserColumns(
  onDelete: (item: UserFullTypes) => void
): ColumnDef<UserFullTypes>[] {
  const navigate = useNavigate();

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
    createColumn("createdAt", "Tgl. Bergabung", {
      cell: ({ row }) =>
        format(new Date(row.original.createdAt), "dd MMM yyyy, HH:mm:ss", {
          locale: id,
        }),
    }),
    createColumn("updatedAt", "Tgl. Diperbarui", {
      cell: ({ row }) =>
        format(new Date(row.original.updatedAt), "dd MMM yyyy, HH:mm:ss", {
          locale: id,
        }),
    }),

    createActionsColumn<UserFullTypes>(
      (item) => navigate(`edit/${item.username}`),
      onDelete
    ),
  ];
}

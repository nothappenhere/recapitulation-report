import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    label?: string;
    sum?: boolean;
    isCurrency?: boolean;
  }
}

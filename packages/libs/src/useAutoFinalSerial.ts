import { useEffect } from "react";

export function useAutoFinalSerial(
  watch: any,
  setValue: any,
  categories: {
    student?: boolean;
    public?: boolean;
    foreign?: boolean;
    custom?: boolean;
  } = {}
) {
  const categoryMap = {
    student: {
      initial: "initialStudentSerialNumber",
      final: "finalStudentSerialNumber",
      total: "studentMemberTotal",
    },
    public: {
      initial: "initialPublicSerialNumber",
      final: "finalPublicSerialNumber",
      total: "publicMemberTotal",
    },
    foreign: {
      initial: "initialForeignSerialNumber",
      final: "finalForeignSerialNumber",
      total: "foreignMemberTotal",
    },
    custom: {
      initial: "initialCustomSerialNumber",
      final: "finalCustomSerialNumber",
      total: "customMemberTotal",
    },
  } as const;

  (Object.keys(categories) as (keyof typeof categoryMap)[]).forEach((key) => {
    if (!categories[key]) return;

    const { initial, final, total } = categoryMap[key];

    const initialValue = watch(initial) || ""; // simpan sebagai string
    const totalValue = Number(watch(total)) || 0;

    useEffect(() => {
      if (!initialValue || !totalValue) {
        setValue(final, "");
        return;
      }

      // hitung dengan number
      const numericFinal = Number(initialValue) + totalValue - 1;

      // padding supaya panjang sama dengan input awal
      const paddedFinal = String(numericFinal).padStart(
        String(initialValue).length,
        "0"
      );

      setValue(final, paddedFinal);
    }, [initialValue, totalValue]);
  });
}

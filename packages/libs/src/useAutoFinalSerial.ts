import { useEffect } from "react";

function useSerialCategory(
  watch: any,
  setValue: any,
  { initial, final, total }: { initial: string; final: string; total: string }
) {
  const initialValue = watch(initial);
  const finalValue = watch(final);

  useEffect(() => {
    if (!initialValue || !finalValue) {
      setValue(total, 0);
      return;
    }

    const start = Number(initialValue);
    const end = Number(finalValue);

    if (isNaN(start) || isNaN(end) || end < start) {
      setValue(total, 0);
      return;
    }

    // 🔑 kalau ingin inklusif → (end - start + 1)
    const count = end - start;

    setValue(total, count);
  }, [initialValue, finalValue, setValue, total]);
}

export function useAutoFinalSerial(
  watch: any,
  setValue: any,
  categories: {
    student?: boolean;
    public?: boolean;
    foreign?: boolean;
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
  } as const;

  if (categories.student) {
    useSerialCategory(watch, setValue, categoryMap.student);
  }
  if (categories.public) {
    useSerialCategory(watch, setValue, categoryMap.public);
  }
  if (categories.foreign) {
    useSerialCategory(watch, setValue, categoryMap.foreign);
  }
}

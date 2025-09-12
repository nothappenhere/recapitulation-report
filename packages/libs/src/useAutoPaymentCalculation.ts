import { useEffect } from "react";

type PricePerCategory = {
  student: number;
  public: number;
  foreign: number;
  custom: number;
};

export function useAutoPaymentCalculation(
  watch: any,
  setValue: any,
  pricePerCategory: PricePerCategory = {
    student: 3000,
    public: 5000,
    foreign: 25000,
    custom: 0,
  }
) {
  const studentTotal = Number(watch("studentMemberTotal")) || 0;
  const publicTotal = Number(watch("publicMemberTotal")) || 0;
  const foreignTotal = Number(watch("foreignMemberTotal")) || 0;
  const customTotal = Number(watch("customMemberTotal")) || 0;

  const downPayment = Number(watch("downPayment")) || 0;

  useEffect(() => {
    // Hitung total seluruh anggota
    const totalMember = studentTotal + publicTotal + foreignTotal + customTotal;
    setValue("groupMemberTotal", totalMember);

    // Hitung total harga
    const totalPrice =
      studentTotal * pricePerCategory.student +
      publicTotal * pricePerCategory.public +
      foreignTotal * pricePerCategory.foreign +
      customTotal * pricePerCategory.custom;

    setValue("paymentAmount", totalPrice);

    // Hitung kembalian
    const change = Math.max(0, downPayment - totalPrice);
    setValue("changeAmount", change);

    // Tentukan status
    const status: "Paid" | "Unpaid" =
      downPayment >= totalPrice ? "Paid" : "Unpaid";

    setValue("statusPayment", status);
  }, [
    studentTotal,
    publicTotal,
    foreignTotal,
    customTotal,
    downPayment,
    setValue,
  ]);
}

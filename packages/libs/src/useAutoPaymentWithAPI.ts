import { useEffect, useState } from "react";
import { api } from "./axios.js";

type PricePerCategory = {
  student: number;
  public: number;
  foreign: number;
  custom: number;
};

export function useAutoPaymentWithAPI(
  apiUrl: string,
  watch: any,
  setValue: any
) {
  const [prices, setPrices] = useState<PricePerCategory>({
    student: 0,
    public: 0,
    foreign: 0,
    custom: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch harga tiket
  useEffect(() => {
    async function fetchPrices() {
      try {
        setLoading(true);
        const res = await api.get(apiUrl);
        const data = res.data?.data || [];

        const mappedPrices: PricePerCategory = {
          student:
            data.find((item: any) => item.category === "Pelajar")?.unitPrice ||
            0,
          public:
            data.find((item: any) => item.category === "Umum")?.unitPrice || 0,
          foreign:
            data.find((item: any) => item.category === "Asing")?.unitPrice || 0,
          custom:
            data.find((item: any) => item.category === "Khusus")?.unitPrice ||
            0,
        };

        setPrices(mappedPrices);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Gagal mengambil harga tiket");
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
  }, [apiUrl]);

  // Kalkulasi otomatis total pembayaran, kembalian, dan status
  const studentTotal = Number(watch("studentMemberTotal")) || 0;
  const publicTotal = Number(watch("publicMemberTotal")) || 0;
  const foreignTotal = Number(watch("foreignMemberTotal")) || 0;
  const customTotal = Number(watch("customMemberTotal")) || 0;
  const downPayment = Number(watch("downPayment")) || 0;

  useEffect(() => {
    if (loading || error) return;

    // Hitung total seluruh anggota
    const totalMember = studentTotal + publicTotal + foreignTotal + customTotal;
    setValue("groupMemberTotal", totalMember);

    // Hitung total harga
    const totalPrice =
      studentTotal * prices.student +
      publicTotal * prices.public +
      foreignTotal * prices.foreign +
      customTotal * prices.custom;

    const change = Math.max(0, downPayment - totalPrice);
    const status = downPayment >= totalPrice ? "Paid" : "Unpaid";

    setValue("paymentAmount", totalPrice);
    setValue("changeAmount", change);
    setValue("statusPayment", status);
  }, [
    studentTotal,
    publicTotal,
    foreignTotal,
    customTotal,
    downPayment,
    prices,
    loading,
    error,
    setValue,
  ]);

  // return { prices, loading, error };
}

import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { api } from "./axios.js";
import type { AxiosError } from "axios";

type PricePerCategory = {
  student: number;
  public: number;
  foreign: number;
  custom: number;
};

export function useAutoPayment(apiUrl: string, watch: any, setValue: any) {
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
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data harga tiket, silakan coba lagi.";
        toast.error(message);

        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
  }, [apiUrl]);

  const studentTotal = Number(watch("studentMemberTotal")) || 0;
  const publicTotal = Number(watch("publicMemberTotal")) || 0;
  const foreignTotal = Number(watch("foreignMemberTotal")) || 0;
  const customTotal = Number(watch("customMemberTotal")) || 0;
  const downPayment = Number(watch("downPayment")) || 0;

  // Kalkulasi otomatis total pembayaran, kembalian, dan status
  useEffect(() => {
    if (loading || error) return;

    // Hitung total seluruh anggota
    const totalMember = studentTotal + publicTotal + foreignTotal + customTotal;
    setValue("visitorMemberTotal", totalMember);

    // Hitung total seluruh harga
    const studentPrice = studentTotal * prices.student;
    const publicPrice = publicTotal * prices.public;
    const foreignPrice = foreignTotal * prices.foreign;
    const totalPrice =
      studentTotal * prices.student +
      publicTotal * prices.public +
      foreignTotal * prices.foreign;

    setValue("studentTotalAmount", studentPrice);
    setValue("publicTotalAmount", publicPrice);
    setValue("foreignTotalAmount", foreignPrice);
    setValue("totalPaymentAmount", totalPrice);

    // Hitung uang kembalian
    const change = Math.max(0, downPayment - totalPrice);
    setValue("changeAmount", change);

    // Hitung status pembayaran
    const status = downPayment >= totalPrice ? "Lunas" : "Belum Bayar";
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
}

import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { api } from "./axios.js";
import { toast } from "react-hot-toast";
import { type UseFormReturn } from "react-hook-form";

export function useVisitingHourSelect<TForm extends UseFormReturn<any>>(
  form: TForm
) {
  const [visitHours, setVisitHours] = useState<any[]>([]);

  // Fetch waktu kunjungan museum
  useEffect(() => {
    const getVisitingHours = async () => {
      try {
        const res = await api.get(`/visit-hour`);
        setVisitHours(res.data?.data || []);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data waktu kunjungan, silakan coba lagi.";
        toast.error(message);
      }
    };

    getVisitingHours();
  }, []);

  return {
    visitHours,
  };
}

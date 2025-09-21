import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { api } from "./axios.js";
import { toast } from "react-hot-toast";
import { type UseFormReturn } from "react-hook-form";

export function useRegionSelector<TForm extends UseFormReturn<any>>(
  form: TForm
) {
  const [countries, setCountries] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [regencies, setRegencies] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  const provinceCode = form.watch("province");
  const regencyCode = form.watch("regencyOrCity");
  const districtCode = form.watch("district");

  // 1. Fetch negara + provinsi
  useEffect(() => {
    const getProvincesAndCountries = async () => {
      try {
        const [resProvinces, resCountries] = await Promise.all([
          api.get("/region/provinces"),
          api.get("/region/countries"),
        ]);

        setProvinces(resProvinces.data?.data || []);
        setCountries(resCountries.data?.data || []);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data provinsi/negara, silakan coba lagi.";
        toast.error(message);
      }
    };

    getProvincesAndCountries();
  }, []);

  // 2. Fetch regency
  useEffect(() => {
    if (!provinceCode) return;

    const getRegencies = async () => {
      try {
        const res = await api.get(`/region/regencies/${provinceCode}`);
        setRegencies(res.data?.data || []);
        setDistricts([]);
        setVillages([]);

        form.setValue("regencyOrCity", "");
        form.setValue("district", "");
        form.setValue("village", "");
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data kabupaten/kota, silakan coba lagi.";
        toast.error(message);
      }
    };

    getRegencies();
  }, [provinceCode]);

  // 3. Fetch district
  useEffect(() => {
    if (!provinceCode || !regencyCode) return;

    const regencyCodeOnly = regencyCode.split(".")[1];

    const getDistricts = async () => {
      try {
        const res = await api.get(
          `/region/districts/${provinceCode}/${regencyCodeOnly}`
        );
        setDistricts(res.data?.data || []);
        setVillages([]);

        form.setValue("district", "");
        form.setValue("village", "");
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data kecamatan, silakan coba lagi.";
        toast.error(message);
      }
    };

    getDistricts();
  }, [regencyCode]);

  // 4. Fetch village
  useEffect(() => {
    if (!provinceCode || !regencyCode || !districtCode) return;

    const [_, regencyCodeOnly, districtCodeOnly] = districtCode.split(".");

    const getVillages = async () => {
      try {
        const res = await api.get(
          `/region/villages/${provinceCode}/${regencyCodeOnly}/${districtCodeOnly}`
        );
        setVillages(res.data?.data || []);
        form.setValue("village", "");
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data kelurahan/desa, silakan coba lagi.";
        toast.error(message);
      }
    };

    getVillages();
  }, [districtCode]);

  return {
    countries,
    provinces,
    regencies,
    districts,
    villages,
  };
}

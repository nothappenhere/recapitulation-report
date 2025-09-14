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
        console.error("Failed to fetch provinces/countries:", error.message);
        toast.error("Gagal memuat provinsi/negara. Coba refresh halaman.");
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
        console.error("Failed to fetch regencies:", error.message);
        toast.error("Gagal memuat kabupaten/kota. Coba refresh halaman.");
      }
    };

    getRegencies();
  }, [provinceCode, form]);

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
        console.error("Failed to fetch districts:", error.message);
        toast.error("Gagal memuat kecamatan. Coba refresh halaman.");
      }
    };

    getDistricts();
  }, [provinceCode, regencyCode, form]);

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
        console.error("Failed to fetch villages:", error.message);
        toast.error("Gagal memuat kelurahan/desa. Coba refresh halaman.");
      }
    };

    getVillages();
  }, [provinceCode, regencyCode, districtCode, form]);

  return {
    countries,
    provinces,
    regencies,
    districts,
    villages,
  };
}

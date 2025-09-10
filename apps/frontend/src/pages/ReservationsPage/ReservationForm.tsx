import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BookingReservationSchema,
  defaultBookingReservationFormValues,
  type TBookingReservation,
} from "@rzkyakbr/schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  SquareLibrary,
  CalendarIcon,
  ClockIcon,
  Loader2,
  MapPinned,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { AxiosError } from "axios";
import { formatPhoneNumber, formatRupiah } from "@rzkyakbr/libs";
import { api } from "@rzkyakbr/libs";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { SimpleField } from "@/components/form/SimpleField";
import { SelectField } from "@/components/form/SelectField";
import { DateField } from "@/components/form/DateField";
import { Label } from "react-aria-components";

export default function ReservationForm() {
  const { reservationId } = useParams();
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isEditMode = Boolean(reservationId);

  const form = useForm<TBookingReservation>({
    resolver: zodResolver(BookingReservationSchema),
    defaultValues: defaultBookingReservationFormValues,
  });

  const provinceCode = form.watch("province");
  const regencyCode = form.watch("regencyOrCity");
  const districtCode = form.watch("district");

  //* 1. Fetch data provinsi saat load:
  useEffect(() => {
    const getProvinces = async () => {
      try {
        const response = await api.get("/region/provinces");
        setProvinces(response.data?.data);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("Failed to fetch provinces:", error.message);
        toast.error("Failed to fetch provinces, please refresh the page.");
      }
    };

    getProvinces();
  }, []);

  //* 2. Fetch kabupaten/kota berdasarkan provinsi:
  useEffect(() => {
    if (!provinceCode) return;

    const getRegenciesOrCities = async () => {
      try {
        const response = await api.get(`/region/regencies/${provinceCode}`);
        setRegencies(response.data?.data);
        setDistricts([]);
        setVillages([]);

        form.setValue("regencyOrCity", "");
        form.setValue("district", "");
        form.setValue("village", "");
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("Failed to fetch regencies:", error.message);
        toast.error("Failed to fetch regencies, please refresh the page.");
      }
    };

    getRegenciesOrCities();
  }, [form, provinceCode]);

  //* 3. Fetch kecamatan berdasarkan kabupaten/kota:
  useEffect(() => {
    if (!provinceCode) return;
    if (!regencyCode) return;

    const getDistricts = async () => {
      const regencyCodeOnly = regencyCode.split(".")[1];

      try {
        const response = await api.get(
          `/region/districts/${provinceCode}/${regencyCodeOnly}`
        );
        setDistricts(response.data?.data);
        setVillages([]);

        form.setValue("district", "");
        form.setValue("village", "");
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("Failed to fetch districts:", error.message);
        toast.error("Failed to fetch districts, please refresh the page.");
      }
    };

    getDistricts();
  }, [form, provinceCode, regencyCode]);

  //* 4. Fetch desa berdasarkan kecamatan:
  useEffect(() => {
    if (!provinceCode) return;
    if (!regencyCode) return;
    if (!districtCode) return;

    const parts = districtCode.split(".");
    const regencyCodeOnly = parts[1];
    const districtCodeOnly = parts[2];

    const getVillages = async () => {
      try {
        const response = await api.get(
          `/region/villages/${provinceCode}/${regencyCodeOnly}/${districtCodeOnly}`
        );
        setVillages(response.data?.data);

        form.setValue("village", "");
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("Failed to fetch villages:", error.message);
        toast.error("Failed to fetch villages, please refresh the page.");
      }
    };

    getVillages();
  }, [districtCode, form, provinceCode, regencyCode]);

  // Harga per kategori
  const pricePerCategory = {
    Pelajar: 3000,
    Umum: 5000,
    Asing: 25000,
    Khusus: 0,
  };

  const { watch, setValue, reset } = form;
  const category = watch("category");
  const groupMemberTotal = watch("groupMemberTotal");
  const paymentAmount = watch("paymentAmount");
  const downPayment = watch("downPayment");

  //* Hitung otomatis total dan status pembayaran
  useEffect(() => {
    const price = (pricePerCategory[category] || 0) * (groupMemberTotal || 0);
    setValue("paymentAmount", price);
  }, [category, groupMemberTotal]);

  useEffect(() => {
    const change = Math.max(0, (downPayment || 0) - (paymentAmount || 0));
    const status: "Paid" | "DP" | "Unpaid" =
      downPayment >= paymentAmount ? "Paid" : downPayment > 0 ? "DP" : "Unpaid";

    setValue("changeAmount", change);
    setValue("statusPayment", status);
  }, [paymentAmount, downPayment]);

  // 🔹 Fetch reservation by ID kalau sedang edit
  useEffect(() => {
    if (!isEditMode) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // fetch reservation data
        const res = await api.get(`/reservations/${reservationId}`);
        const data = res.data.data;

        // fetch provinsi, regencies, districts, villages sesuai data
        const provincesRes = await api.get("/wilayah/provinces");
        setProvinces(provincesRes.data?.data?.data);

        const regenciesRes = await api.get(
          `/wilayah/regencies/${data.province}`
        );
        setRegencies(regenciesRes.data?.data?.data);

        const regencyCodeOnly = data.regencyOrCity.split(".")[1];
        const districtsRes = await api.get(
          `/wilayah/districts/${data.province}/${regencyCodeOnly}`
        );
        setDistricts(districtsRes.data?.data?.data);

        const districtParts = data.district.split(".");
        const districtCodeOnly = districtParts[2];
        const villagesRes = await api.get(
          `/wilayah/villages/${data.province}/${regencyCodeOnly}/${districtCodeOnly}`
        );
        setVillages(villagesRes.data?.data?.data);

        // reset form setelah semua options terisi
        form.reset({
          ...defaultFormValues,
          ...data,
          reservationDate: data.reservationDate
            ? new Date(data.reservationDate)
            : new Date(),
        });
      } catch (err) {
        toast.error("Data reservasi tidak ditemukan!");
        navigate("/dashboard/reservation");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEditMode, reservationId]);

  //* Submit handler: create atau update
  const onSubmit = async (values: TBookingReservation): Promise<void> => {
    try {
      setLoading(true);
      if (isEditMode) {
        await api.put(`/reservations/${reservationId}`, values);
        toast.success("Reservasi berhasil diperbarui!");
      } else {
        const res = await api.post("/reservations", values);
        toast.success(
          `Reservasi berhasil ditambahkan: ${res.data.data.reservationNumber}`
        );
      }

      navigate("/dashboard/reservation");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan data!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>
          {isEditMode ? "Edit Reservasi" : "Buat Reservasi Baru"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? `Ubah detail reservasi dengan ID: ${reservationId}`
            : "Isi formulir di bawah untuk membuat reservasi baru."}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* ROW 1 */}
              <div className="grid grid-cols-3 gap-3">
                {/* Tanggal Kunjungan */}
                <DateField
                  control={form.control}
                  name="visitingDate"
                  label="Tanggal Kunjungan"
                  placeholder="Pilih tanggal kunjungan"
                  tooltip="Pilih tanggal kunjungan, tidak bisa memilih sebelum hari ini."
                />

                {/* Waktu Kunjungan */}
                <SelectField
                  control={form.control}
                  name="visitingHour"
                  label="Waktu Kunjungan"
                  placeholder="Pilih waktu kunjungan"
                  icon={ClockIcon}
                  options={[
                    { value: "WhatsApp", label: "WhatsApp" },
                    { value: "Google Form", label: "Google Form" },
                    { value: "lainnya", label: "Lainnya..." },
                  ]}
                  tooltip="Tentukan jam kedatangan rombongan sesuai jadwal museum."
                />

                {/* Mekanisme Reservasi */}
                <SelectField
                  control={form.control}
                  name="reservationMechanism"
                  label="Mekanisme Reservasi"
                  placeholder="Pilih mekanisme reservasi"
                  icon={SquareLibrary}
                  options={[
                    { value: "WhatsApp", label: "WhatsApp" },
                    { value: "Google Form", label: "Google Form" },
                    { value: "lainnya", label: "Lainnya..." },
                  ]}
                  tooltip="Pilih metode reservasi yang digunakan, misalnya WhatsApp atau Google Form."
                />
              </div>

              {/* ROW 2 */}
              <div className="grid gap-3">
                <SimpleField
                  control={form.control}
                  name="description"
                  label="Deskripsi"
                  placeholder="Masukan deskripsi"
                  component={<Textarea />}
                  tooltip="Tambahkan keterangan tambahan terkait kunjungan (opsional)."
                />
              </div>

              {/* ROW 3 */}
              <div className="grid grid-cols-3 gap-3">
                {/* Nama Pemesan / Nama Travel */}
                <SimpleField
                  control={form.control}
                  name="ordererNameOrTravelName"
                  label="Nama Pemesan / Travel"
                  placeholder="Masukan nama pemesan / travel"
                  tooltip="Isi dengan nama pemesan atau nama biro travel yang mengatur kunjungan."
                />

                {/* Nomor Telepon */}
                <SimpleField
                  control={form.control}
                  name="phoneNumber"
                  label="Nomor Telepon"
                  placeholder="Masukan nomor telepon"
                  onChangeOverride={(value, field) => {
                    const formatted = formatPhoneNumber(value);
                    field.onChange(formatted);
                  }}
                  tooltip="Masukkan nomor telepon aktif yang bisa dihubungi."
                />

                {/* Nama Rombongan */}
                <SimpleField
                  control={form.control}
                  name="groupName"
                  label="Nama Rombongan"
                  placeholder="Masukan nama rombongan"
                  tooltip="Isi dengan nama rombongan atau identitas kelompok pengunjung."
                />
              </div>

              {/* ROW 4 */}
              <div className="grid grid-cols-5 gap-3">
                {/* Jumlah Anggota Rombongan PELAJAR */}
                <SimpleField
                  control={form.control}
                  name="studentMemberTotal"
                  label="Jumlah Anggota Pelajar"
                  type="number"
                  placeholder="Masukan jumlah angg. pelajar"
                  tooltip="Jumlah anggota rombongan yang berstatus pelajar (SD, SMP, SMA, Mahasiswa)."
                />

                {/* Jumlah Anggota Rombongan UMUM */}
                <SimpleField
                  control={form.control}
                  name="publicMemberTotal"
                  label="Jumlah Anggota Umum"
                  type="number"
                  placeholder="Masukan jumlah angg. umum"
                  tooltip="Jumlah anggota rombongan kategori umum (di luar pelajar/asing/khusus)."
                />

                {/* Jumlah Anggota Rombongan ASING */}
                <SimpleField
                  control={form.control}
                  name="foreignMemberTotal"
                  label="Jumlah Anggota Asing"
                  type="number"
                  placeholder="Masukan jumlah angg. asing"
                  tooltip="Jumlah anggota rombongan yang merupakan pengunjung dari luar negeri."
                />

                {/* Jumlah Anggota Rombongan KHUSUS */}
                <SimpleField
                  control={form.control}
                  name="customMemberTotal"
                  label="Jumlah Anggota Khusus"
                  type="number"
                  placeholder="Masukan jumlah angg. Khusus"
                  tooltip="Jumlah anggota rombongan dengan kategori khusus (misalnya undangan, VIP, dsb)."
                />

                {/* Jumlah Seluruh Anggota Rombongan (readonly) */}
                <SimpleField
                  control={form.control}
                  name="groupMemberTotal"
                  label="Jumlah Seluruh Anggota"
                  type="number"
                  placeholder="Masukan jumlah seluruh angg."
                  disabled
                  tooltip="Jumlah total anggota rombongan. Terhitung otomatis dari semua kategori."
                />
              </div>

              {/* ROW 5 */}
              <div className="grid gap-3">
                <SimpleField
                  control={form.control}
                  name="address"
                  label="Alamat"
                  placeholder="Masukan alamat lengkap"
                  component={<Textarea />}
                  tooltip="Masukkan alamat lengkap pemesan atau instansi asal rombongan."
                />
              </div>

              {/* ROW 6 */}
              <div className="grid grid-cols-4 gap-3">
                {/* Provinsi */}
                <SelectField
                  control={form.control}
                  name="province"
                  label="Provinsi"
                  placeholder="Pilih provinsi"
                  icon={MapPinned}
                  options={provinces.map(
                    (prov: { code: string; name: string }) => ({
                      value: prov.code,
                      label: prov.name,
                    })
                  )}
                  disabled={!provinces.length}
                  tooltip="Pilih provinsi asal rombongan."
                />

                {/* Kabupaten/Kota */}
                <SelectField
                  control={form.control}
                  name="regencyOrCity"
                  label="Kabupaten/Kota"
                  placeholder="Pilih kabupaten/kota"
                  icon={MapPinned}
                  options={regencies.map(
                    (reg: { code: string; name: string }) => ({
                      value: reg.code,
                      label: reg.name,
                    })
                  )}
                  disabled={!regencies.length}
                  tooltip="Pilih kabupaten atau kota sesuai alamat asal rombongan."
                />

                {/* Kecamatan */}
                <SelectField
                  control={form.control}
                  name="district"
                  label="Kecamatan"
                  placeholder="Pilih kecamatan"
                  icon={MapPinned}
                  options={districts.map(
                    (dist: { code: string; name: string }) => ({
                      value: dist.code,
                      label: dist.name,
                    })
                  )}
                  disabled={!districts.length}
                  tooltip="Pilih kecamatan sesuai alamat asal rombongan."
                />

                {/* Kelurahan/Desa */}
                <SelectField
                  control={form.control}
                  name="village"
                  label="Kelurahan/Desa"
                  placeholder="Pilih kelurahan/desa"
                  icon={MapPinned}
                  options={villages.map(
                    (vill: { code: string; name: string }) => ({
                      value: vill.code,
                      label: vill.name,
                    })
                  )}
                  disabled={!villages.length}
                  tooltip="Pilih kelurahan atau desa sesuai alamat asal rombongan."
                />
              </div>

              {/* ROW 7 */}
              <div className="grid grid-cols-4 gap-3">
                {/* Total Pembayaran (readonly) */}
                <SimpleField
                  control={form.control}
                  name="paymentAmount"
                  label="Total Pembayaran"
                  placeholder="Masukan total pembayaran"
                  disabled
                  valueFormatter={(val) => formatRupiah(val || 0)}
                  tooltip="Jumlah total pembayaran yang harus dibayarkan. Dihitung otomatis."
                />

                {/* Uang Muka */}
                <SimpleField
                  control={form.control}
                  name="downPayment"
                  label="Uang Muka"
                  placeholder="Masukan uang muka"
                  onChangeOverride={(e, field) => {
                    const rawValue = e.target.value.replace(/[^\d]/g, "");
                    field.onChange(Number(rawValue));
                  }}
                  valueFormatter={(val) => formatRupiah(val || 0)}
                  tooltip="Masukkan jumlah uang muka minimal 20% dari total pembayaran."
                />

                {/* Uang Kembalian (readonly) */}
                <SimpleField
                  control={form.control}
                  name="changeAmount"
                  label="Uang Kembalian"
                  placeholder="Masukan uang kembalian"
                  disabled
                  valueFormatter={(val) => formatRupiah(val || 0)}
                  tooltip="Jumlah uang kembalian jika pembayaran melebihi total yang ditentukan."
                />

                {/* Status Pembayaran (readonly) */}
                <SimpleField
                  control={form.control}
                  name="statusPayment"
                  label="Status Pembayaran"
                  placeholder="Masukan status pembayaran"
                  disabled
                  valueFormatter={(val: string) =>
                    val === "Paid"
                      ? "Lunas"
                      : val === "DP"
                      ? "DP"
                      : "Belum Bayar"
                  }
                  tooltip="Status pembayaran otomatis: Lunas, DP, atau Belum Bayar."
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Loading...
                  </>
                ) : isEditMode ? (
                  "Update Reservasi"
                ) : (
                  "Tambah Reservasi"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

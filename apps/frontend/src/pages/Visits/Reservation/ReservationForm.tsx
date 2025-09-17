import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ReservationSchema,
  defaultReservationFormValues,
  type TReservation,
} from "@rzkyakbr/schemas";
import {
  api,
  formatPhoneNumber,
  formatRupiah,
  useAutoFinalSerial,
  useAutoPaymentWithAPI,
  useRegionSelector,
  useVisitingHourSelect,
} from "@rzkyakbr/libs";
import {
  SquareLibrary,
  Banknote,
  ClockIcon,
  Flag,
  Loader2,
  MapPinned,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { SimpleField } from "@/components/form/SimpleField";
import { SelectField } from "@/components/form/SelectField";
import { DateField } from "@/components/form/DateField";
import type { AxiosError } from "axios";
import { useUser } from "@/hooks/UserContext";

export default function ReservationForm() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { user } = useUser();
  const reservationAgent = user?._id || null;

  const form = useForm<TReservation>({
    resolver: zodResolver(ReservationSchema),
    defaultValues: defaultReservationFormValues,
  });

  // * Hook untuk mengambil seluruh data waktu kunjungan museum
  // TODO: Akan otomatis fetch data waktu kunjungan dari endpoint API (/visit-hour)
  const { visitHours } = useVisitingHourSelect(form);

  // * Hook untuk mengambil dan mengatur data wilayah (negara, provinsi, kabupaten/kota, kecamatan, desa)
  // TODO: Akan otomatis fetch data sesuai hierarki (provinsi -> kabupaten -> kecamatan -> desa)
  // ? Mengatur ulang field form jika parent berubah (misal ganti provinsi, maka kabupaten/kecamatan/desa direset)
  // ? Return: daftar negara, provinsi, kabupaten, kecamatan, desa
  const { countries, provinces, regencies, districts, villages } =
    useRegionSelector(form);

  //* Hook untuk menghitung otomatis total pembayaran, uang kembalian, dan status pembayaran
  // TODO: Mengambil harga tiket per kategori dari endpoint API (misal /ticket-price)
  // ? Mengalikan (harga * jumlah anggota) untuk setiap kategori
  // ? Menjumlahkan semua kategori agar dapat total pembayaran
  // ? Menghitung otomatis kembalian dari downPayment (uang muka)
  // ? Menentukan status pembayaran: "Paid" kalau lunas, "Unpaid" kalau belum lunas
  useAutoPaymentWithAPI("/ticket-price", form.watch, form.setValue);

  //* Hook untuk menghitung otomatis nomor seri akhir tiap kategori
  // ? Berdasarkan input nomor seri awal + jumlah anggota - 1
  // TODO: Contoh: nomor awal 100, jumlah 5 → nomor akhir = 104
  // ? Memastikan format tetap sesuai (misal leading zero tetap ada)
  // ? Bekerja untuk semua kategori (student, public, foreign, custom)
  useAutoFinalSerial(form.watch, form.setValue, {
    student: true,
    public: true,
    foreign: true,
    custom: true,
  });

  //* Fetch jika sedang edit
  useEffect(() => {
    if (!isEditMode) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/reservation/${id}`);
        const data = res.data.data;
        console.log(data);

        form.reset(data);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
        toast.error(message);

        navigate("/dashboard/visits");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEditMode, id, navigate]);

  //* Submit handler: create atau update
  const onSubmit = async (values: TReservation): Promise<void> => {
    try {
      if (isEditMode) {
        const res = await api.put(`/reservation/${id}`, values);
        toast.success(`${res.data.message}`);
      } else {
        const res = await api.post("/reservation", {
          ...values,
          reservationAgent,
        });
        toast.success(`${res.data.message}.`);
      }

      form.reset();
      navigate("/dashboard/visits");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menyimpan data, silakan coba lagi.";
      toast.error(message);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>
          {isEditMode ? "Edit Data Reservasi" : "Pendataan Reservasi Baru"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? `Ubah detail reservasi dengan ID: ${id}`
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
                  options={visitHours.map(
                    (vh: { _id: string; timeRange: string }) => ({
                      value: vh._id,
                      label: vh.timeRange,
                    })
                  )}
                  tooltip="Tentukan jam kunjungan sesuai jadwal museum."
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
                  tooltip="Pilih metode reservasi yang digunakan."
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
                  // tampilkan pakai formatter
                  valueFormatter={(value) =>
                    value ? formatPhoneNumber(String(value)) : ""
                  }
                  // konversi kembali ke raw number saat user mengetik
                  onChangeOverride={(e, field) => {
                    const raw = e.target.value.replace(/\D/g, ""); // hanya angka
                    field.onChange(
                      raw.startsWith("0") ? "62" + raw.slice(1) : raw
                    );
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
                  type="number"
                  name="studentMemberTotal"
                  label="Jumlah Anggota Pelajar"
                  placeholder="Masukan jumlah angg. pelajar"
                  tooltip="Jumlah anggota rombongan yang berstatus pelajar (TK / Paud, SD, SMP, SMA, Mahasiswa)."
                />

                {/* Jumlah Anggota Rombongan UMUM */}
                <SimpleField
                  control={form.control}
                  type="number"
                  name="publicMemberTotal"
                  label="Jumlah Anggota Umum"
                  placeholder="Masukan jumlah angg. umum"
                  tooltip="Jumlah anggota rombongan kategori umum (di luar Pelajar/Asing/Khusus)."
                />

                {/* Jumlah Anggota Rombongan ASING */}
                <SimpleField
                  control={form.control}
                  type="number"
                  name="foreignMemberTotal"
                  label="Jumlah Anggota Asing"
                  placeholder="Masukan jumlah angg. asing"
                  tooltip="Jumlah anggota rombongan yang merupakan pengunjung dari luar negeri."
                />

                {/* Jumlah Anggota Rombongan KHUSUS */}
                <SimpleField
                  control={form.control}
                  type="number"
                  name="customMemberTotal"
                  label="Jumlah Anggota Khusus"
                  placeholder="Masukan jumlah angg. Khusus"
                  tooltip="Jumlah anggota rombongan dengan kategori khusus (misalnya undangan, VIP, dsb)."
                />

                {/* Jumlah Seluruh Anggota Rombongan (readonly) */}
                <SimpleField
                  control={form.control}
                  type="number"
                  name="groupMemberTotal"
                  label="Jumlah Seluruh Anggota"
                  placeholder="Masukan jumlah seluruh angg."
                  disabled
                  tooltip="Jumlah total anggota rombongan (terisi otomatis dari semua kategori)."
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
              <div className="grid grid-cols-5 gap-3">
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
                  disabled={!isEditMode || !provinces.length}
                  tooltip="Pilih provinsi asal ."
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
                  disabled={!isEditMode || !regencies.length}
                  tooltip="Pilih kabupaten / kota asal pemesan."
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
                  disabled={!isEditMode || !districts.length}
                  tooltip="Pilih kecamatan asal pemesan."
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
                  disabled={!isEditMode || !villages.length}
                  tooltip="Pilih kelurahan / desa asal pemesan."
                />

                {/* Negara */}
                <SelectField
                  control={form.control}
                  name="country"
                  label="Negara Asal "
                  placeholder="Pilih negara asal "
                  icon={Flag}
                  options={countries.map(
                    (country: { code: string; name: string }) => ({
                      value: country.name,
                      label: country.code,
                    })
                  )}
                  disabled={
                    !isEditMode ||
                    !Number(Number(form.getValues("foreignMemberTotal")))
                  }
                  tooltip="Pilih negara asal pemesan (jika ada anggota asing)."
                  countrySelect
                />
              </div>

              {/* ROW 7 */}
              <div className="grid grid-cols-5 gap-3">
                {/* Total Pembayaran (readonly) */}
                <SimpleField
                  control={form.control}
                  name="paymentAmount"
                  label="Total Pembayaran"
                  placeholder="Masukan total pembayaran"
                  disabled
                  valueFormatter={(val) => formatRupiah(val || 0)}
                  tooltip="Jumlah total pembayaran yang harus dibayarkan  (terhitung otomatis)."
                />

                {/* Metode Pembayaran */}
                <SelectField
                  control={form.control}
                  name="paymentMethod"
                  label="Metode Pembayaran"
                  placeholder="Pilih metode pembayaran"
                  icon={Banknote}
                  options={[
                    { label: "Tunai", value: "Tunai" },
                    { label: "Transfer", value: "Transfer" },
                    { label: "QRIS", value: "QRIS" },
                  ]}
                  tooltip="Metode pembayaran tiket."
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
                  tooltip="Jumlah uang muka yang dibayarkan."
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
                  valueFormatter={(val) =>
                    val === "Paid" ? "Lunas" : "Belum Bayar"
                  }
                  tooltip="Status pembayaran terisi otomatis (Lunas atau Belum Bayar)."
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
                  "Perbarui Reservasi"
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

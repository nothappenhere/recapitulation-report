import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DirectReservation,
  defaultDirectReservationFormValues,
  type TDirectReservation,
} from "@rzkyakbr/schemas";
import {
  api,
  formatRupiah,
  isWithinOperationalHours,
  mapRegionNames,
  useAutoPayment,
  useRegionSelector,
} from "@rzkyakbr/libs";
import {
  ArrowLeft,
  Banknote,
  Flag,
  Loader2,
  MapPinned,
  Printer,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";
import { useMediaQuery } from "react-responsive";
import type { AxiosError } from "axios";
import { SimpleField } from "@/components/form/SimpleField";
import { DateField } from "@/components/form/DateField";
import { ComboboxField } from "@/components/form/ComboboxField";
import { PhoneField } from "@/components/form/PhoneField";
import { NumberFieldInput } from "@/components/form/NumberField";
import { SelectField } from "@/components/form/SelectField";
import { useUser } from "@/hooks/use-user-context";
import { useCallback, useEffect, useState } from "react";
import ReservationFormSkeleton from "@/components/skeleton/ReservationFormSkeleton";
import AlertDelete from "@/components/AlertDelete";

export default function DirectReservationForm() {
  const { uniqueCode } = useParams();
  const isEditMode = Boolean(uniqueCode);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 639 });
  const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const { user } = useUser();
  const Agent = user?._id || null;

  const form = useForm<TDirectReservation>({
    resolver: zodResolver(DirectReservation),
    defaultValues: defaultDirectReservationFormValues,
  });

  //* for submit button validation purposes
  const foreignTotal = form.watch("foreignMemberTotal");
  const visitorTotal = form.watch("visitorMemberTotal");
  const phoneNumber = form.watch("phoneNumber");
  const totalPaymentAmount = form.watch("totalPaymentAmount");
  const paymentMethod = form.watch("paymentMethod");
  const downPayment = form.watch("downPayment");

  // * Hook untuk mengambil dan mengatur data wilayah (negara, provinsi, kabupaten/kota, kecamatan, desa)
  const { countries, provinces, regencies, districts, villages } =
    useRegionSelector(form);

  //* Hook untuk menghitung otomatis total pembayaran, uang kembalian, dan status pembayaran
  useAutoPayment("/ticket-price", form.watch, form.setValue);

  //* Fetch data if currently editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await api.get(`/direct-reservation/${uniqueCode}`);
        const WalkinData = res.data.data;

        const formData: TDirectReservation = {
          ...WalkinData,
          visitingDate: new Date(WalkinData.visitingDate),
          province:
            provinces.find((p) => p.name === WalkinData.province)?.code || "-",
          regencyOrCity:
            regencies.find((r) => r.name === WalkinData.regencyOrCity)?.code ||
            "-",
          district:
            districts.find((d) => d.name === WalkinData.district)?.code || "-",
          village:
            villages.find((v) => v.name === WalkinData.village)?.code || "-",
          country:
            countries.find((c) => c.name === WalkinData.country)?.name ||
            WalkinData.country,
        };

        form.reset(formData);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
        toast.error(message);

        navigate("/dashboard/direct-reservation", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    form,
    navigate,
    uniqueCode,
    isEditMode,
    provinces,
    regencies,
    districts,
    villages,
    countries,
  ]);

  //* Submit handler: create or update data
  const onSubmit = async (values: TDirectReservation): Promise<void> => {
    try {
      const {
        provinceName,
        regencyName,
        districtName,
        villageName,
        countryName,
      } = mapRegionNames(values, {
        provinces,
        regencies,
        districts,
        villages,
        countries,
      });

      const payload = {
        ...values,
        province: foreignTotal > 0 ? "-" : provinceName,
        regencyOrCity: foreignTotal > 0 ? "-" : regencyName,
        district: foreignTotal > 0 ? "-" : districtName,
        village: foreignTotal > 0 ? "-" : villageName,
        country: !foreignTotal ? "Indonesia" : countryName,
        agent: Agent,
      };

      let res = null;
      if (!isEditMode) {
        // Create data
        res = await api.post(`/direct-reservation`, payload);
      } else {
        // Update data
        res = await api.put(`/direct-reservation/${uniqueCode}`, payload);
      }

      const { reservationNumber } = res.data.data;
      toast.success(`${res.data.message}.`);
      form.reset();
      navigate(`/dashboard/direct-reservation/print/${reservationNumber}`, {
        replace: true,
      });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menyimpan data, silakan coba lagi.";
      toast.error(message);
    }
  };

  //* Delete handler: delete data after confirmation
  const confirmDelete = useCallback(async () => {
    if (!uniqueCode || !isEditMode) return;

    try {
      const res = await api.delete(`/direct-reservation/${uniqueCode}`);
      toast.success(`${res.data.message}.`);
      navigate("/dashboard/direct-reservation");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menghapus data, silakan coba lagi.";
      toast.error(message);
    } finally {
      setDeleteOpen(false);
    }
  }, [navigate, uniqueCode, isEditMode]);

  return (
    <>
      {loading ? (
        <ReservationFormSkeleton />
      ) : (
        <>
          <AlertDelete
            open={isDeleteOpen}
            setOpen={setDeleteOpen}
            onDelete={confirmDelete}
          />

          <Card className="shadow-lg rounded-md">
            <CardHeader className="text-center">
              <CardTitle>
                {isEditMode
                  ? "Edit Data Reservasi Langsung"
                  : "Pendataan Reservasi Langsung"}
              </CardTitle>
              <CardDescription>
                {isEditMode
                  ? `Ubah detail reservasi langsung dengan kode: ${uniqueCode}`
                  : "Isi formulir di bawah untuk mencatat reservasi langsung."}
              </CardDescription>

              <CardAction className="flex gap-2">
                {/* Back */}
                <Button asChild>
                  <Link to="/dashboard/direct-reservation">
                    <ArrowLeft />
                    Kembali
                  </Link>
                </Button>

                {isEditMode && (
                  <>
                    {/* Print */}
                    <Button variant="outline" asChild>
                      <Link
                        to={`/dashboard/direct-reservation/print/${uniqueCode}`}
                      >
                        <Printer />
                        Print
                      </Link>
                    </Button>

                    {/* Delete */}
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteOpen(true)}
                    >
                      <Trash2 />
                      Hapus
                    </Button>
                  </>
                )}
              </CardAction>
            </CardHeader>
            <Separator />
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-6">
                    {/* ROW 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Tanggal Kunjungan */}
                      <DateField
                        control={form.control}
                        name="visitingDate"
                        label="Tanggal Kunjungan"
                        placeholder="Pilih tanggal kunjungan"
                        tooltip="Tanggal kunjungan (hanya bisa memilih hari ini)."
                        disabledForward
                        disabled={isEditMode}
                      />

                      {/* Nama Pemesan */}
                      <SimpleField
                        control={form.control}
                        name="ordererName"
                        label="Nama Pemesan"
                        placeholder="Masukan nama pemesan"
                        tooltip="Isi dengan nama pemesan yang berkunjung."
                        disabled={isEditMode}
                      />

                      {/* Nomor Telepon */}
                      <PhoneField
                        control={form.control}
                        name="phoneNumber"
                        label="Nomor Telepon"
                        placeholder="Masukan nomor telepon"
                        tooltip="Nomor telepon aktif yang dapat dihubungi."
                        disabled={isEditMode}
                      />
                    </div>

                    {/* Kondisional berdasarkan ukuran layar */}
                    {isMobile && (
                      <>
                        {/* ROW 2 (mobile-only) */}
                        <div className="grid grid-cols-1 gap-4">
                          {/* Jumlah Seluruh PELAJAR */}
                          <NumberFieldInput
                            control={form.control}
                            name="studentMemberTotal"
                            label="Jumlah Pelajar"
                            placeholder="0"
                            tooltip="Jumlah anggota pelajar."
                            minValue={0}
                            defaultValue={0}
                            disabled={isEditMode}
                          />

                          {/* Total Harga Keseluruhan PELAJAR (readonly) */}
                          <SimpleField
                            control={form.control}
                            name="studentTotalAmount"
                            label="Total Harga Tiket Pelajar"
                            placeholder="0"
                            tooltip="Total harga tiket kategori pelajar."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />

                          {/* Jumlah Anggota UMUM */}
                          <NumberFieldInput
                            control={form.control}
                            name="publicMemberTotal"
                            label="Jumlah Umum"
                            placeholder="0"
                            tooltip="Jumlah anggota umum."
                            minValue={0}
                            defaultValue={0}
                            disabled={isEditMode}
                          />

                          {/* Total Harga Keseluruhan UMUM (readonly) */}
                          <SimpleField
                            control={form.control}
                            name="publicTotalAmount"
                            label="Total Harga Tiket Umum"
                            placeholder="0"
                            tooltip="Total harga tiket kategori umum."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />

                          {/* Jumlah Anggota ASING */}
                          <NumberFieldInput
                            control={form.control}
                            name="foreignMemberTotal"
                            label="Jumlah Asing"
                            placeholder="0"
                            tooltip="Jumlah anggota asing."
                            minValue={0}
                            defaultValue={0}
                            disabled={isEditMode}
                          />

                          {/* Total Harga Keseluruhan ASING (readonly) */}
                          <SimpleField
                            control={form.control}
                            name="foreignTotalAmount"
                            label="Total Harga Tiket Asing"
                            placeholder="0"
                            tooltip="Total harga tiket kategori asing."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />

                          {/* Jumlah Seluruh Anggota */}
                          <NumberFieldInput
                            control={form.control}
                            name="visitorMemberTotal"
                            label="Total Seluruh Pengunjung"
                            placeholder="0"
                            tooltip="Jumlah total seluruh pengunjung."
                            minValue={0}
                            defaultValue={0}
                            disabled={isEditMode}
                          />

                          {/* Total Harga Pembayaran (readonly) */}
                          <SimpleField
                            control={form.control}
                            name="totalPaymentAmount"
                            label="Total Pembayaran Harga Tiket"
                            placeholder="Masukan total pembayaran"
                            tooltip="Jumlah total pembayaran harga tiket."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />
                        </div>
                      </>
                    )}

                    {isTablet && (
                      <>
                        {/* ROW 2 (tablet-only) */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            {/* Jumlah Seluruh PELAJAR */}
                            <NumberFieldInput
                              control={form.control}
                              name="studentMemberTotal"
                              label="Jumlah Pelajar"
                              placeholder="0"
                              tooltip="Jumlah anggota pelajar."
                              minValue={0}
                              defaultValue={0}
                              disabled={isEditMode}
                            />

                            {/* Jumlah Anggota UMUM */}
                            <NumberFieldInput
                              control={form.control}
                              name="publicMemberTotal"
                              label="Jumlah Umum"
                              placeholder="0"
                              tooltip="Jumlah anggota umum."
                              minValue={0}
                              defaultValue={0}
                              disabled={isEditMode}
                            />

                            {/* Jumlah Anggota ASING */}
                            <NumberFieldInput
                              control={form.control}
                              name="foreignMemberTotal"
                              label="Jumlah Asing"
                              placeholder="0"
                              tooltip="Jumlah anggota asing."
                              minValue={0}
                              defaultValue={0}
                              disabled={isEditMode}
                            />

                            {/* Jumlah Seluruh Anggota */}
                            <NumberFieldInput
                              control={form.control}
                              name="visitorMemberTotal"
                              label="Total Seluruh Pengunjung"
                              placeholder="0"
                              tooltip="Jumlah total seluruh pengunjung."
                              minValue={0}
                              defaultValue={0}
                              disabled={isEditMode}
                            />
                          </div>

                          <div className="flex flex-col gap-4">
                            {/* Total Harga Keseluruhan PELAJAR (readonly) */}
                            <SimpleField
                              control={form.control}
                              name="studentTotalAmount"
                              label="Total Harga Tiket Pelajar"
                              placeholder="0"
                              tooltip="Total harga tiket kategori pelajar."
                              valueFormatter={(val) => formatRupiah(val || 0)}
                              disabled
                            />

                            {/* Total Harga Keseluruhan UMUM (readonly) */}
                            <SimpleField
                              control={form.control}
                              name="publicTotalAmount"
                              label="Total Harga Tiket Umum"
                              placeholder="0"
                              tooltip="Total harga tiket kategori umum."
                              valueFormatter={(val) => formatRupiah(val || 0)}
                              disabled
                            />

                            {/* Total Harga Keseluruhan ASING (readonly) */}
                            <SimpleField
                              control={form.control}
                              name="foreignTotalAmount"
                              label="Total Harga Tiket Asing"
                              placeholder="0"
                              tooltip="Total harga tiket kategori asing."
                              valueFormatter={(val) => formatRupiah(val || 0)}
                              disabled
                            />

                            {/* Total Harga Pembayaran (readonly) */}
                            <SimpleField
                              control={form.control}
                              name="totalPaymentAmount"
                              label="Total Pembayaran Harga Tiket"
                              placeholder="Masukan total pembayaran"
                              tooltip="Jumlah total pembayaran harga tiket."
                              valueFormatter={(val) => formatRupiah(val || 0)}
                              disabled
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {isDesktop && (
                      <>
                        {/* ROW 2 (desktop only) */}
                        <div className="grid grid-cols-4 gap-4">
                          {/* Jumlah Seluruh PELAJAR */}
                          <NumberFieldInput
                            control={form.control}
                            name="studentMemberTotal"
                            label="Jumlah Pelajar"
                            placeholder="0"
                            tooltip="Jumlah anggota pelajar."
                            minValue={0}
                            defaultValue={0}
                            disabled={isEditMode}
                          />

                          {/* Jumlah Anggota UMUM */}
                          <NumberFieldInput
                            control={form.control}
                            name="publicMemberTotal"
                            label="Jumlah Umum"
                            placeholder="0"
                            tooltip="Jumlah anggota umum."
                            minValue={0}
                            defaultValue={0}
                            disabled={isEditMode}
                          />

                          {/* Jumlah Anggota ASING */}
                          <NumberFieldInput
                            control={form.control}
                            name="foreignMemberTotal"
                            label="Jumlah Asing"
                            placeholder="0"
                            tooltip="Jumlah anggota asing."
                            minValue={0}
                            defaultValue={0}
                            disabled={isEditMode}
                          />

                          {/* Jumlah Seluruh Anggota */}
                          <NumberFieldInput
                            control={form.control}
                            name="visitorMemberTotal"
                            label="Total Seluruh Pengunjung"
                            placeholder="0"
                            tooltip="Jumlah total seluruh pengunjung."
                            minValue={0}
                            defaultValue={0}
                            disabled={isEditMode}
                          />

                          {/* Total Harga Keseluruhan PELAJAR (readonly) */}
                          <SimpleField
                            control={form.control}
                            name="studentTotalAmount"
                            label="Total Harga Tiket Pelajar"
                            placeholder="0"
                            tooltip="Total harga tiket kategori pelajar."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />

                          {/* Total Harga Keseluruhan UMUM (readonly) */}
                          <SimpleField
                            control={form.control}
                            name="publicTotalAmount"
                            label="Total Harga Tiket Umum"
                            placeholder="0"
                            tooltip="Total harga tiket kategori umum."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />

                          {/* Total Harga Keseluruhan ASING (readonly) */}
                          <SimpleField
                            control={form.control}
                            name="foreignTotalAmount"
                            label="Total Harga Tiket Asing"
                            placeholder="0"
                            tooltip="Total harga tiket kategori asing."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />

                          {/* Total Harga Pembayaran (readonly) */}
                          <SimpleField
                            control={form.control}
                            name="totalPaymentAmount"
                            label="Total Pembayaran Harga Tiket"
                            placeholder="Masukan total pembayaran"
                            tooltip="Jumlah total pembayaran harga tiket."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />
                        </div>
                      </>
                    )}

                    {visitorTotal > 19 && (
                      <h2 className="text-xl font-bold text-center max-w-10/12 mx-auto">
                        Ketentuan Pembuatan Reservasi Langsung
                        <br />
                        <span className="text-base font-normal">
                          Jumlah maksimal pembelian tiket langsung adalah 19
                          orang. Untuk rombongan yang lebih dari itu, silakan
                          melakukan reservasi terlebih dahulu beberapa hari
                          sebelum kedatangan melalui konter tiket atau
                          menghubungi nomor berikut:
                        </span>
                        <br />
                        <span className="text-base font-normal">
                          (022)-7213822 atau 0811-1111-9330.
                        </span>
                        <br />
                        <span className="text-base font-medium">
                          Terima Kasih.
                        </span>
                      </h2>
                    )}

                    {/* ROW 3 */}
                    <div className="grid gap-3">
                      {/* Alamat */}
                      <SimpleField
                        control={form.control}
                        name="address"
                        label="Alamat"
                        placeholder="Masukan alamat"
                        component={
                          <Textarea
                            className="rounded-xs"
                            disabled={isEditMode}
                          />
                        }
                        tooltip="Masukkan alamat lengkap pemesan."
                      />
                    </div>

                    {/* ROW 4 */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {/* Provinsi */}
                      <ComboboxField
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
                        disabled={
                          !provinces.length || foreignTotal > 0 || isEditMode
                        }
                        tooltip="Pilih provinsi asal pemesan."
                      />

                      {/* Kabupaten/Kota */}
                      <ComboboxField
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
                        disabled={
                          !regencies.length || foreignTotal > 0 || isEditMode
                        }
                        tooltip="Pilih kabupaten/kota asal pemesan."
                      />

                      {/* Kecamatan */}
                      <ComboboxField
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
                        disabled={
                          !districts.length || foreignTotal > 0 || isEditMode
                        }
                        tooltip="Pilih kecamatan asal pemesan."
                      />

                      {/* Kelurahan/Desa */}
                      <ComboboxField
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
                        disabled={
                          !villages.length || foreignTotal > 0 || isEditMode
                        }
                        tooltip="Pilih kelurahan/desa asal pemesan."
                      />

                      {/* Negara */}
                      <ComboboxField
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
                        tooltip="Pilih negara asal pemesan."
                        disabled={foreignTotal === 0 || isEditMode}
                        countrySelect
                      />
                    </div>

                    {/* ROW 5 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {/* Metode Pembayaran */}
                      <SelectField
                        control={form.control}
                        name="paymentMethod"
                        label="Metode Pembayaran"
                        placeholder="Pilih metode pembayaran"
                        icon={Banknote}
                        options={[
                          { label: "Tunai", value: "Tunai" },
                          { label: "QRIS", value: "QRIS" },
                          { label: "Lainnya", value: "Lainnya" },
                        ]}
                        tooltip="Metode pembayaran tiket."
                      />

                      {/* Uang Pembayaran */}
                      <SimpleField
                        control={form.control}
                        name="downPayment"
                        label="Uang Pembayaran"
                        placeholder="Masukan uang pembayaran"
                        onChangeOverride={(e, field) => {
                          const rawValue = e.target.value.replace(/[^\d]/g, "");
                          field.onChange(Number(rawValue));
                        }}
                        valueFormatter={(val) => formatRupiah(val || 0)}
                        tooltip="Jumlah uang yang dibayarkan."
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
                        tooltip="Status pembayaran terisi otomatis (Lunas atau Belum Bayar)."
                      />
                    </div>

                    {/* Submit Button */}
                    {isWithinOperationalHours() && (
                      <Button
                        type="submit"
                        className="rounded-xs"
                        disabled={
                          form.formState.isSubmitting ||
                          visitorTotal === 0 ||
                          visitorTotal > 19 ||
                          !phoneNumber ||
                          paymentMethod === "Lainnya" ||
                          downPayment < totalPaymentAmount
                        }
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            {isEditMode
                              ? "Perbarui Reservasi Langsung"
                              : "Tambah Reservasi Langsung"}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex flex-col justify-center items-center gap-2">
              <h2 className="text-xl font-bold text-center">
                Ketentuan {isEditMode ? "Pembaruan" : "Pembuatan"} Reservasi
                Langsung
              </h2>

              <div className="flex justify-center items-center">
                <span className="text-base font-normal text-center max-w-1/2 border p-4">
                  {isEditMode ? "Pembaruan" : "Pembuatan"} reservasi langsung
                  hanya dapat dilakukan 30 menit sebelum jam operasional: 09:00
                  – 15:00 WIB.
                </span>

                <span className="text-base font-normal text-center max-w-1/2 border p-4">
                  Silakan pilih Metode Pembayaran, serta Uang Pembayaran{" "}
                  <span className="underline">tidak boleh kurang dari</span>{" "}
                  Total Pembayaran Harga Tiket.
                </span>
              </div>

              <span className="text-base font-medium">Terima Kasih.</span>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
}

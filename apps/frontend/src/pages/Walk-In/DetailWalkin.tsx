import { useEffect, useState } from "react";
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
  WalkInSchema,
  defaultWalkInFormValues,
  type TWalkIn,
} from "@rzkyakbr/schemas";
import {
  api,
  formatPhoneNumber,
  formatRupiah,
  useAutoPayment,
  useRegionSelector,
} from "@rzkyakbr/libs";
import {
  ArrowLeft,
  Banknote,
  ClockIcon,
  Flag,
  Loader2,
  MapPinned,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";
import { SimpleField } from "@/components/form/SimpleField";
import { SelectField } from "@/components/form/SelectField";
import { DateField } from "@/components/form/DateField";
import { RangeField } from "@/components/form/RangeField";
import type { AxiosError } from "axios";
import { useUser } from "@/hooks/UserContext";
import WalkinFormSkeleton from "@/components/skeleton/WalkinFormSkeleton";
import { useMediaQuery } from "react-responsive";
import { PhoneField } from "@/components/form/PhoneField";
import { NumberFieldInput } from "@/components/form/NumberField";
import { ComboboxField } from "@/components/form/ComboboxField";

export default function DetailWalkin() {
  const { uniqueCode } = useParams();
  const isEditMode = Boolean(uniqueCode);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const { user } = useUser();
  const Agent = user?._id || null;

  const form = useForm<TWalkIn>({
    resolver: zodResolver(WalkInSchema),
    defaultValues: defaultWalkInFormValues,
  });

  // * Hook untuk mengambil dan mengatur data wilayah (negara, provinsi, kabupaten/kota, kecamatan, desa)
  const { countries, provinces, regencies, districts, villages } =
    useRegionSelector(form);

  //* Hook untuk menghitung otomatis total pembayaran, uang kembalian, dan status pembayaran
  useAutoPayment("/ticket-price", form.watch, form.setValue);

  //* Fetch jika sedang edit
  useEffect(() => {
    if (!isEditMode) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/walk-in/${uniqueCode}`);
        const WalkinData = res.data.data;

        const formData: TWalkIn = {
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

        navigate("/dashboard/walk-in", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    uniqueCode,
    isEditMode,
    form,
    provinces,
    regencies,
    districts,
    villages,
    countries,
    navigate,
  ]);

  const totalPaymentAmount = form.watch("totalPaymentAmount");
  const paymentMethod = form.watch("paymentMethod");
  const downPayment = form.watch("downPayment");

  //* Submit handler: update
  const onSubmit = async (values: TWalkIn): Promise<void> => {
    if (values.downPayment < values.paymentAmount) {
      toast.error("Uang muka tidak boleh kurang dari total pembayaran!");
      return;
    }

    try {
      // cari nama berdasarkan kode
      const provinceName =
        provinces.find((p) => p.code === values.province)?.name || "-";
      const regencyName =
        regencies.find((r) => r.code === values.regencyOrCity)?.name || "-";
      const districtName =
        districts.find((d) => d.code === values.district)?.name || "-";
      const villageName =
        villages.find((v) => v.code === values.village)?.name || "-";
      const countryName =
        countries.find((c) => c.code === values.country)?.name ||
        values.country;

      const payload = {
        ...values,
        province: provinceName,
        regencyOrCity: regencyName,
        district: districtName,
        village: villageName,
        country: countryName,
        agent: Agent,
      };

      const res = await api.put(`/walk-in/${uniqueCode}`, payload);
      const { walkInNumber } = res.data.data;
      toast.success(`${res.data.message}`);

      form.reset();
      navigate(`/dashboard/walk-in/print/${walkInNumber}`, { replace: true });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menyimpan data, silakan coba lagi.";
      toast.error(message);
    }
  };

  return (
    <>
      {loading ? (
        <WalkinFormSkeleton />
      ) : (
        <Card className="shadow-lg rounded-md">
          <CardHeader className="text-center">
            <CardTitle>Edit Data Kunjungan</CardTitle>
            <CardDescription>
              Ubah detail kunjungan dengan Kode: {uniqueCode}
            </CardDescription>

            <CardAction>
              <Button asChild>
                <Link to="/dashboard/walk-in">
                  <ArrowLeft />
                  Kembali
                </Link>
              </Button>
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
                    />

                    {/* Nama Pemesan */}
                    <SimpleField
                      control={form.control}
                      name="ordererName"
                      label="Nama Pemesan"
                      placeholder="Masukan nama pemesan"
                      tooltip="Nama pemesan yang berkunjungan."
                      disabled
                    />

                    {/* Nomor Telepon */}
                    <PhoneField
                      control={form.control}
                      name="phoneNumber"
                      label="Nomor Telepon"
                      placeholder="Masukan nomor telepon"
                      tooltip="Nomor telepon aktif yang dapat dihubungi."
                      disabled
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
                          disabled
                        />

                        {/* Total Harga Keseluruhan PELAJAR () */}
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
                          disabled
                        />

                        {/* Total Harga Keseluruhan UMUM () */}
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
                          disabled
                        />

                        {/* Total Harga Keseluruhan ASING () */}
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
                          tooltip="Jumlah total pengunjung."
                          minValue={0}
                          defaultValue={0}
                          disabled
                        />

                        {/* Total Harga Pembayaran () */}
                        <SimpleField
                          control={form.control}
                          name="totalPaymentAmount"
                          label="Total Pembayaran Harga Tiket"
                          placeholder="Masukan total pembayaran"
                          tooltip="Jumlah total pembayaran."
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
                            disabled
                          />

                          {/* Jumlah Seluruh Anggota */}
                          <NumberFieldInput
                            control={form.control}
                            name="visitorMemberTotal"
                            label="Total Seluruh Pengunjung"
                            placeholder="0"
                            tooltip="Jumlah total pengunjung."
                            minValue={0}
                            defaultValue={0}
                            disabled
                          />
                        </div>

                        <div className="flex flex-col gap-4">
                          {/* Total Harga Keseluruhan PELAJAR () */}
                          <SimpleField
                            control={form.control}
                            name="studentTotalAmount"
                            label="Total Harga Tiket Pelajar"
                            placeholder="0"
                            tooltip="Total harga tiket kategori pelajar."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />

                          {/* Total Harga Keseluruhan UMUM () */}
                          <SimpleField
                            control={form.control}
                            name="publicTotalAmount"
                            label="Total Harga Tiket Umum"
                            placeholder="0"
                            tooltip="Total harga tiket kategori umum."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />

                          {/* Total Harga Keseluruhan ASING () */}
                          <SimpleField
                            control={form.control}
                            name="foreignTotalAmount"
                            label="Total Harga Tiket Asing"
                            placeholder="0"
                            tooltip="Total harga tiket kategori asing."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />

                          {/* Total Harga Pembayaran () */}
                          <SimpleField
                            control={form.control}
                            name="totalPaymentAmount"
                            label="Total Pembayaran Harga Tiket"
                            placeholder="Masukan total pembayaran"
                            tooltip="Jumlah total pembayaran."
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
                          disabled
                        />

                        {/* Jumlah Seluruh Anggota */}
                        <NumberFieldInput
                          control={form.control}
                          name="visitorMemberTotal"
                          label="Total Seluruh Pengunjung"
                          placeholder="0"
                          tooltip="Jumlah total pengunjung."
                          minValue={0}
                          defaultValue={0}
                          disabled
                        />

                        {/* Total Harga Keseluruhan PELAJAR () */}
                        <SimpleField
                          control={form.control}
                          name="studentTotalAmount"
                          label="Total Harga Tiket Pelajar"
                          placeholder="0"
                          tooltip="Total harga tiket kategori pelajar."
                          valueFormatter={(val) => formatRupiah(val || 0)}
                          disabled
                        />

                        {/* Total Harga Keseluruhan UMUM () */}
                        <SimpleField
                          control={form.control}
                          name="publicTotalAmount"
                          label="Total Harga Tiket Umum"
                          placeholder="0"
                          tooltip="Total harga tiket kategori umum."
                          valueFormatter={(val) => formatRupiah(val || 0)}
                          disabled
                        />

                        {/* Total Harga Keseluruhan ASING () */}
                        <SimpleField
                          control={form.control}
                          name="foreignTotalAmount"
                          label="Total Harga Tiket Asing"
                          placeholder="0"
                          tooltip="Total harga tiket kategori asing."
                          valueFormatter={(val) => formatRupiah(val || 0)}
                          disabled
                        />

                        {/* Total Harga Pembayaran () */}
                        <SimpleField
                          control={form.control}
                          name="totalPaymentAmount"
                          label="Total Pembayaran Harga Tiket"
                          placeholder="Masukan total pembayaran"
                          tooltip="Jumlah total pembayaran."
                          valueFormatter={(val) => formatRupiah(val || 0)}
                          disabled
                        />
                      </div>
                    </>
                  )}

                  {/* ROW 3 */}
                  <div className="grid gap-3">
                    {/* Alamat */}
                    <SimpleField
                      control={form.control}
                      name="address"
                      label="Alamat"
                      placeholder="Masukan alamat"
                      component={<Textarea className="rounded-xs" disabled />}
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
                      tooltip="Pilih provinsi asal pemesan."
                      disabled
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
                      disabled={!regencies.length}
                      tooltip="Pilih kabupaten/kota asal pemesan."
                      disabled
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
                      disabled={!districts.length}
                      tooltip="Pilih kecamatan asal pemesan."
                      disabled
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
                      disabled={!villages.length}
                      tooltip="Pilih kelurahan/desa asal pemesan."
                      disabled
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
                      countrySelect
                      disabled
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
                      ]}
                      tooltip="Metode pembayaran tiket."
                    />

                    {/* Uang Pembayar */}
                    <SimpleField
                      control={form.control}
                      name="downPayment"
                      label="Uang Pembayar"
                      placeholder="Masukan uang pembayar"
                      onChangeOverride={(e, field) => {
                        const rawValue = e.target.value.replace(/[^\d]/g, "");
                        field.onChange(Number(rawValue));
                      }}
                      valueFormatter={(val) => formatRupiah(val || 0)}
                      tooltip="Jumlah uang yang dibayarkan."
                    />

                    {/* Uang Kembalian () */}
                    <SimpleField
                      control={form.control}
                      name="changeAmount"
                      label="Uang Kembalian"
                      placeholder="Masukan uang kembalian"
                      disabled
                      valueFormatter={(val) => formatRupiah(val || 0)}
                      tooltip="Jumlah uang kembalian jika pembayaran melebihi total yang ditentukan."
                    />

                    {/* Status Pembayaran () */}
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
                  <Button
                    type="submit"
                    className="rounded-xs"
                    disabled={
                      form.formState.isSubmitting ||
                      paymentMethod === "-" ||
                      downPayment < totalPaymentAmount
                    }
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Perbarui Data Kunjungan"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <h2 className="text-xl font-bold text-center">
              Ketentuan Pembaruan Data Kunjungan
              <br />
              <span className="text-base font-normal">
                Silakan pilih Metode Pembayaran, serta Uang Pembayaran{" "}
                <span className="underline">tidak boleh kurang dari</span> Total
                Pembayaran Harga Tiket.
              </span>
              <br />
              <span className="text-base font-medium">Terima Kasih.</span>
            </h2>
          </CardFooter>
        </Card>
      )}
    </>
  );
}

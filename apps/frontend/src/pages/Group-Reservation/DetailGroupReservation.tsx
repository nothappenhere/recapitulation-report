import { useCallback, useEffect, useState } from "react";
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
  ReservationSchema,
  defaultReservationFormValues,
  type TReservation,
} from "@rzkyakbr/schemas";
import {
  api,
  formatPhoneNumber,
  formatRupiah,
  isWithinOperationalHours,
  mapRegionNames,
  useAutoFinalSerial,
  useAutoPayment,
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
  ArrowLeft,
  Printer,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";
import { SimpleField } from "@/components/form/SimpleField";
import { SelectField } from "@/components/form/SelectField";
import { DateField } from "@/components/form/DateField";
import type { AxiosError } from "axios";
import { useUser } from "@/hooks/UserContext";
import ReservationFormSkeleton from "@/components/skeleton/ReservationFormSkeleton";
import { ComboboxField } from "@/components/form/ComboboxField";
import { useMediaQuery } from "react-responsive";
import { PhoneField } from "@/components/form/PhoneField";
import { NumberFieldInput } from "@/components/form/NumberField";
import AlertDelete from "@/components/AlertDelete";

export default function DetailGroupReservation() {
  const { uniqueCode } = useParams();
  const isEditMode = Boolean(uniqueCode);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const { user } = useUser();
  const Agent = user?._id || null;

  const form = useForm<TReservation>({
    resolver: zodResolver(ReservationSchema),
    defaultValues: defaultReservationFormValues,
  });

  // * Hook untuk mengambil seluruh data waktu kunjungan museum
  const { visitHours } = useVisitingHourSelect(form);

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
        const res = await api.get(`/reservation/${uniqueCode}`);
        const reservationData = res.data.data;

        const formData: TReservation = {
          ...reservationData,
          visitingDate: new Date(reservationData.visitingDate),
          visitingHour: reservationData.visitingHour._id,
          province:
            provinces.find((p) => p.name === reservationData.province)?.code ||
            "",
          regencyOrCity:
            regencies.find((r) => r.name === reservationData.regencyOrCity)
              ?.code || "",
          district:
            districts.find((d) => d.name === reservationData.district)?.code ||
            "",
          village:
            villages.find((v) => v.name === reservationData.village)?.code ||
            "",
          country:
            countries.find((c) => c.name === reservationData.country)?.name ||
            reservationData.country,
        };

        form.reset(formData);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
        toast.error(message);

        navigate("/dashboard/group-reservation", { replace: true });
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

  const visitorTotal = form.watch("visitorMemberTotal");
  const phoneNumber = form.watch("phoneNumber");
  const totalPaymentAmount = form.watch("totalPaymentAmount");
  const paymentMethod = form.watch("paymentMethod");
  const downPayment = form.watch("downPayment");

  //* Submit handler update
  const onSubmit = async (values: TReservation): Promise<void> => {
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
        province: provinceName,
        regencyOrCity: regencyName,
        district: districtName,
        village: villageName,
        country: countryName,
        agent: Agent,
      };

      const res = await api.put(`/reservation/${uniqueCode}`, payload);
      const { reservationNumber } = res.data.data;
      toast.success(`${res.data.message}`);

      form.reset();
      navigate(`/dashboard/group-reservation/print/${reservationNumber}`, {
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

  // TODO: Handler delete setelah dikonfirmasi
  const confirmDelete = useCallback(async () => {
    if (!uniqueCode) return;

    try {
      const res = await api.delete(`/walk-in/${uniqueCode}`);
      toast.success(`${res.data.message}.`);
      navigate("/dashboard/walk-in");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menghapus data, silakan coba lagi.";
      toast.error(message);
    } finally {
      setDeleteOpen(false);
    }
  }, [navigate, uniqueCode]);

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

          <Card>
            <CardHeader className="text-center">
              <CardTitle>Edit Data Reservasi</CardTitle>
              <CardDescription>
                Ubah detail reservasi dengan kode: {uniqueCode}
              </CardDescription>

              <CardAction className="flex gap-2">
                {/* Back */}
                <Button asChild>
                  <Link to="/dashboard/group-reservation">
                    <ArrowLeft />
                    Kembali
                  </Link>
                </Button>

                {/* Print */}
                <Button variant="outline" asChild>
                  <Link to={`/dashboard/group-reservation/print/${uniqueCode}`}>
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
                  Delete
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
                        tooltip="Tanggal kunjungan (tidak bisa memilih sebelum hari ini)."
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
                            disabled: vh.timeRange.includes("Istirahat"),
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
                          { value: "Whatsapp", label: "Whatsapp" },
                          { value: "Google Form", label: "Google Form" },
                          {
                            value: "Datang Langsung",
                            label: "Datang Langsung",
                          },
                          { value: "Lainnya", label: "Lainnya..." },
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
                        component={<Textarea className="rounded-xs" />}
                        tooltip="Tambahkan keterangan tambahan terkait kunjungan (opsional)."
                      />
                    </div>

                    {/* ROW 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Nama Pemesan */}
                      <SimpleField
                        control={form.control}
                        name="ordererName"
                        label="Nama Pemesan"
                        placeholder="Masukan nama pemesan"
                        tooltip="Isi dengan nama pemesan yang mengatur kunjungan."
                      />

                      {/* Nomor Telepon */}
                      <PhoneField
                        control={form.control}
                        name="phoneNumber"
                        label="Nomor Telepon"
                        placeholder="Masukan nomor telepon"
                        tooltip="Nomor telepon aktif yang dapat dihubungi."
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
                            tooltip="Jumlah total pengunjung."
                            minValue={0}
                            defaultValue={0}
                          />

                          {/* Total Harga Pembayaran (readonly) */}
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
                            tooltip="Jumlah total pembayaran."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />
                        </div>
                      </>
                    )}

                    {visitorTotal < 19 && (
                      <h2 className="text-xl font-bold text-center max-w-10/12 mx-auto">
                        Ketentuan Pembuatan Reservasi Rombongan
                        <br />
                        <span className="text-base font-normal">
                          Jumlah minimal reservasi rombongan adalah 19 orang.
                          Untuk rombongan kurang dari itu, silakan melakukan
                          reservasi secara langsung melalui konter tiket yang
                          tersedia.{" "}
                        </span>
                        <br />
                        <span className="text-base font-medium">
                          Terima Kasih.
                        </span>
                      </h2>
                    )}

                    {/* ROW 5 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Status Reservasi */}
                      <SelectField
                        control={form.control}
                        name="reservationStatus"
                        label="Status Reservasi"
                        placeholder="Pilih status reservasi"
                        icon={SquareLibrary}
                        options={[
                          { value: "Hadir", label: "Hadir" },
                          { value: "Reschedule", label: "Reschedule" },
                          {
                            value: "Batal Hadir",
                            label: "Batal Hadir",
                          },
                          { value: "Lainnya", label: "Lainnya..." },
                        ]}
                        tooltip="Pilih status reservasi berdasarkan kejadian dilapangan."
                      />

                      {/* Jumlah Seluruh Anggota */}
                      <NumberFieldInput
                        control={form.control}
                        name="actualMemberTotal"
                        label="Total Aktual Kehadiran Seluruh Pengunjung"
                        placeholder="0"
                        tooltip="Jumlah total aktual kehadiran pengunjung."
                        minValue={0}
                        defaultValue={0}
                      />
                    </div>

                    {/* ROW 6 */}
                    <div className="grid gap-3">
                      {/* Alamat */}
                      <SimpleField
                        control={form.control}
                        name="address"
                        label="Alamat"
                        placeholder="Masukan alamat"
                        component={<Textarea className="rounded-xs" />}
                        tooltip="Masukkan alamat lengkap pemesan atau instansi asal rombongan."
                      />
                    </div>

                    {/* ROW 7 */}
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
                      />
                    </div>

                    {/* ROW 8 */}
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
                          visitorTotal < 19 ||
                          !phoneNumber ||
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
                          "Perbarui Data Reservasi"
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex flex-col justify-center items-center gap-2">
              <h2 className="text-xl font-bold text-center">
                Ketentuan Pembaruan Data Reservasi
              </h2>

              <div className="flex justify-center items-center">
                {!isWithinOperationalHours() && (
                  <span className="text-base font-normal text-center max-w-1/2 border py-4 px-3">
                    Pembaruan reservasi hanya dapat dilakukan 30 menit sebelum
                    jam operasional Museum Geologi: 09:00 – 15:00 WIB.
                  </span>
                )}

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

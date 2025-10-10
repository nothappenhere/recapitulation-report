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
  CustomReservationSchema,
  defaultCustomReservationFormValues,
  type TCustomReservation,
} from "@rzkyakbr/schemas";
import {
  api,
  formatRupiah,
  isWithinOperationalHours,
  mapRegionNames,
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
  Trash2,
  Printer,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate, useParams } from "react-router";
import { SimpleField } from "@/components/form/SimpleField";
import { SelectField } from "@/components/form/SelectField";
import { DateField } from "@/components/form/DateField";
import type { AxiosError } from "axios";
import { useUser } from "@/hooks/use-user-context";
import { ComboboxField } from "@/components/form/ComboboxField";
import { PhoneField } from "@/components/form/PhoneField";
import { NumberFieldInput } from "@/components/form/NumberField";
import { FileUploadField } from "@/components/form/FileUploadField";
import { useCallback, useEffect, useState } from "react";
import ReservationFormSkeleton from "@/components/skeleton/ReservationFormSkeleton";
import AlertDelete from "@/components/AlertDelete";

export default function CustomReservationForm() {
  const { uniqueCode } = useParams();
  const isEditMode = Boolean(uniqueCode);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialFiles, setInitialFiles] = useState<
    {
      name: string;
      size: number;
      type: string;
      url: string;
      id: string;
    }[]
  >([]);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 639 });
  const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const { user } = useUser();
  const Agent = user?._id || null;

  const form = useForm<TCustomReservation>({
    resolver: zodResolver(CustomReservationSchema),
    defaultValues: defaultCustomReservationFormValues,
  });

  //* for submit button validation purposes
  const attachments = form.watch("attachments");
  const guideTotal = form.watch("publicMemberTotal");
  const customTotal = form.watch("customMemberTotal");
  const visitorTotal = form.watch("visitorMemberTotal");
  const phoneNumber = form.watch("phoneNumber");
  const totalPaymentAmount = form.watch("totalPaymentAmount");
  const paymentMethod = form.watch("paymentMethod");
  const downPayment = form.watch("downPayment");

  // * Hook untuk mengambil seluruh data waktu kunjungan museum
  const { visitHours } = useVisitingHourSelect(form);

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
        const res = await api.get(`/custom-reservation/${uniqueCode}`);
        const reservationData = res.data.data;

        const formData: TCustomReservation = {
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

        // Map data from API response to expected format for FileUploadField
        const mappedFiles = reservationData.attachments.map((file: any) => ({
          name: file.fileName,
          size: file.size,
          type: file.mimeType,
          path: file.path, // sesuaikan path jika perlu
          // url: `${import.meta.env.VITE_BASE_URL}/uploads/images/${
          //   file.fileName
          // }`, // sesuaikan path jika perlu
          id: file._id,
        }));
        setInitialFiles(mappedFiles);

        form.reset({
          ...formData,
          attachments: mappedFiles,
        });
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
        toast.error(message);

        navigate("/dashboard/custom-reservation", { replace: true });
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
  const onSubmit = async (values: TCustomReservation): Promise<void> => {
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

      const formData = new FormData();

      // Append semua data
      formData.append("agent", String(Agent));

      formData.append("visitingDate", values.visitingDate.toString());
      formData.append("visitingHour", values.visitingHour);
      formData.append("description", values.description || "-");

      formData.append("ordererName", values.ordererName);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("groupName", values.groupName);

      formData.append("publicMemberTotal", String(values.publicMemberTotal));
      formData.append("customMemberTotal", String(values.customMemberTotal));
      formData.append("visitorMemberTotal", String(values.visitorMemberTotal));
      formData.append("actualMemberTotal", String(values.actualMemberTotal));

      formData.append("reservationStatus", values.reservationStatus);

      formData.append("address", values.address);
      formData.append("province", customTotal > 0 ? provinceName : "-");
      formData.append("regencyOrCity", customTotal > 0 ? regencyName : "-");
      formData.append("district", customTotal > 0 ? districtName : "-");
      formData.append("village", customTotal > 0 ? villageName : "-");
      formData.append("country", !customTotal ? "Indonesia" : countryName);

      formData.append("publicTotalAmount", String(values.publicTotalAmount));
      formData.append("customTotalAmount", String(values.customTotalAmount));
      formData.append("totalPaymentAmount", String(values.totalPaymentAmount));
      formData.append("downPayment", String(values.downPayment));
      formData.append("changeAmount", String(values.changeAmount));

      formData.append("paymentMethod", values.paymentMethod);
      formData.append("statusPayment", values.statusPayment);

      // if (!isEditMode && values.attachments && values.attachments.length > 0) {
      //   values.attachments.forEach((file: File) => {
      //     formData.append("attachments", file);
      //   });
      // } else {
      //   const newFiles = values.attachments.filter((f) => f instanceof File);
      //   newFiles.forEach((file) => formData.append("attachments", file));
      // }

      const newFiles = values.attachments.filter((f) => f instanceof File);
      newFiles.forEach((file) => formData.append("attachments", file));

      // Jika kamu mau backend tahu file lama yang masih dipakai:
      const oldFileIds = values.attachments
        .filter((f: any) => !(f instanceof File) && f.id)
        .map((f: any) => f.id);

      if (oldFileIds.length > 0) {
        formData.append("existingAttachments", JSON.stringify(oldFileIds));
      }

      let res = null;
      if (!isEditMode) {
        // Create data
        res = await api.post(`/custom-reservation`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Update data
        res = await api.put(`/custom-reservation/${uniqueCode}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      const { reservationNumber } = res.data.data;
      toast.success(`${res.data.message}.`);
      form.reset();
      navigate(`/dashboard/custom-reservation/print/${reservationNumber}`, {
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
      const res = await api.delete(`/custom-reservation/${uniqueCode}`);
      toast.success(`${res.data.message}.`);
      navigate("/dashboard/custom-reservation");
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
                  ? "Edit Data Reservasi Khusus"
                  : "Pendataan Reservasi Khusus"}
              </CardTitle>
              <CardDescription>
                {isEditMode
                  ? `Ubah detail reservasi khusus dengan kode: ${uniqueCode}`
                  : "Isi formulir di bawah untuk mencatat reservasi khusus."}
              </CardDescription>

              <CardAction className="flex gap-2">
                {/* Back */}
                <Button asChild>
                  <Link to="/dashboard/custom-reservation">
                    <ArrowLeft />
                    Kembali
                  </Link>
                </Button>

                {isEditMode && (
                  <>
                    {/* Print */}
                    <Button variant="outline" asChild>
                      <Link
                        to={`/dashboard/custom-reservation/print/${uniqueCode}`}
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
                {/* <pre>{JSON.stringify(form.formState.errors, null, 3)}</pre> */}

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
                          { value: "Lainnya", label: "Lainnya" },
                        ]}
                        tooltip="Pilih metode reservasi yang digunakan."
                      />
                    </div>

                    {/* ROW 2 */}
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
                        {/* ROW 3 (mobile-only) */}
                        <div className="grid grid-cols-1 gap-4">
                          {/* Jumlah Anggota PEMANDU */}
                          <NumberFieldInput
                            control={form.control}
                            name="publicMemberTotal"
                            label="Jumlah Pemandu"
                            placeholder="0"
                            tooltip="Jumlah anggota pemandu."
                            minValue={0}
                            defaultValue={0}
                          />

                          {/* Total Harga Keseluruhan PEMANDU (readonly) */}
                          <SimpleField
                            control={form.control}
                            name="publicTotalAmount"
                            label="Total Harga Tiket Pemandu"
                            placeholder="0"
                            tooltip="Total harga tiket kategori pemandu."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />

                          {/* Jumlah Anggota KHUSUS */}
                          <NumberFieldInput
                            control={form.control}
                            name="customMemberTotal"
                            label="Jumlah Khusus"
                            placeholder="0"
                            tooltip="Jumlah anggota khusus."
                            minValue={0}
                            defaultValue={0}
                          />

                          {/* Total Harga Keseluruhan KHUSUS (readonly) */}
                          <SimpleField
                            control={form.control}
                            name="customTotalAmount"
                            label="Total Harga Tiket Khusus"
                            placeholder="0"
                            tooltip="Total harga tiket kategori khusus."
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
                        {/* ROW 3 (tablet-only) */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            {/* Jumlah Anggota PEMANDU */}
                            <NumberFieldInput
                              control={form.control}
                              name="publicMemberTotal"
                              label="Jumlah Pemandu"
                              placeholder="0"
                              tooltip="Jumlah anggota pemandu."
                              minValue={0}
                              defaultValue={0}
                            />

                            {/* Jumlah Anggota KHUSUS */}
                            <NumberFieldInput
                              control={form.control}
                              name="customMemberTotal"
                              label="Jumlah Khusus"
                              placeholder="0"
                              tooltip="Jumlah anggota khusus."
                              minValue={0}
                              defaultValue={0}
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
                            />
                          </div>

                          <div className="flex flex-col gap-4">
                            {/* Total Harga Keseluruhan PEMANDU (readonly) */}
                            <SimpleField
                              control={form.control}
                              name="publicTotalAmount"
                              label="Total Harga Tiket Pemandu"
                              placeholder="0"
                              tooltip="Total harga tiket kategori pemandu."
                              valueFormatter={(val) => formatRupiah(val || 0)}
                              disabled
                            />

                            {/* Total Harga Keseluruhan KHUSUS (readonly) */}
                            <SimpleField
                              control={form.control}
                              name="customTotalAmount"
                              label="Total Harga Tiket Khusus"
                              placeholder="0"
                              tooltip="Total harga tiket kategori khusus."
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
                        {/* ROW 3 (desktop only) */}
                        <div className="grid grid-cols-3 gap-4">
                          {/* Jumlah Anggota PEMANDU */}
                          <NumberFieldInput
                            control={form.control}
                            name="publicMemberTotal"
                            label="Jumlah Pemandu"
                            placeholder="0"
                            tooltip="Jumlah anggota pemandu."
                            minValue={0}
                            defaultValue={0}
                          />

                          {/* Jumlah Anggota KHUSUS */}
                          <NumberFieldInput
                            control={form.control}
                            name="customMemberTotal"
                            label="Jumlah Khusus"
                            placeholder="0"
                            tooltip="Jumlah anggota khusus."
                            minValue={0}
                            defaultValue={0}
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
                          />

                          {/* Total Harga Keseluruhan PEMANDU (readonly) */}
                          <SimpleField
                            control={form.control}
                            name="publicTotalAmount"
                            label="Total Harga Tiket Pemandu"
                            placeholder="0"
                            tooltip="Total harga tiket kategori pemandu."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />

                          {/* Total Harga Keseluruhan KHUSUS (readonly) */}
                          <SimpleField
                            control={form.control}
                            name="customTotalAmount"
                            label="Total Harga Tiket Khusus"
                            placeholder="0"
                            tooltip="Total harga tiket kategori khusus."
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

                    {/* ROW 4 */}
                    <div className="grid gap-3">
                      <SimpleField
                        control={form.control}
                        name="description"
                        label="Keterangan"
                        placeholder="Tambahkan keterangan (opsional)"
                        component={<Textarea className="rounded-xs" />}
                        tooltip="Tambahkan catatan tambahan terkait kunjungan."
                      />
                    </div>

                    {isEditMode && (
                      <>
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

                          {/* Jumlah Seluruh Kehadiran Anggota */}
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
                      </>
                    )}

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
                        disabled={!provinces.length}
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

                    {/* ROW 9 */}
                    <div className="grid gap-3">
                      {/* File Upload */}
                      <FileUploadField
                        control={form.control}
                        name="attachments"
                        label="Lampiran File Nota Dinas Permohonan Pengajuan Tarif Khusus"
                        accept="image/*,application/pdf"
                        initialFiles={isEditMode ? initialFiles : []}
                        isEditMode={isEditMode}
                      />
                    </div>

                    {/* Submit Button */}
                    {isWithinOperationalHours() && (
                      <Button
                        type="submit"
                        className="rounded-xs"
                        disabled={
                          form.formState.isSubmitting ||
                          guideTotal === 0 ||
                          customTotal === 0 ||
                          visitorTotal === 0 ||
                          attachments.length === 0 ||
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
                              ? "Perbarui Reservasi Khusus"
                              : "Tambah Reservasi Khusus"}
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
                Khusus
              </h2>

              <div className="flex justify-center items-center">
                <span className="text-base font-normal text-center max-w-1/2 border py-4 px-3">
                  {isEditMode ? "Pembaruan" : "Pembuatan"} reservasi khusus
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

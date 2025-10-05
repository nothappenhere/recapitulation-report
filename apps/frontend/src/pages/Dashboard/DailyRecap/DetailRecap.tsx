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
  DailyRecapSchema,
  defaultDailyRecapFormValues,
  type TDailyRecap,
} from "@rzkyakbr/schemas";
import {
  api,
  formatRupiah,
  isWithinOperationalHours,
  useAutoFinalSerial,
  useAutoPayment,
} from "@rzkyakbr/libs";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";
import { SimpleField } from "@/components/form/SimpleField";
import { DateField } from "@/components/form/DateField";
import type { AxiosError } from "axios";
import { useUser } from "@/hooks/use-user-context";
import ReservationFormSkeleton from "@/components/skeleton/ReservationFormSkeleton";
import { useMediaQuery } from "react-responsive";
import { NumberFieldInput } from "@/components/form/NumberField";
import AlertDelete from "@/components/AlertDelete";
import { RangeField } from "@/components/form/RangeField";

export default function DetailRecap() {
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

  const form = useForm<TDailyRecap>({
    resolver: zodResolver(DailyRecapSchema),
    defaultValues: defaultDailyRecapFormValues,
  });

  //* Hook untuk menghitung otomatis total pembayaran, uang kembalian, dan status pembayaran
  useAutoPayment("/ticket-price", form.watch, form.setValue);

  //* tolong berikan penjelasan singkat untuk fungsi ini...
  useAutoFinalSerial(form.watch, form.setValue, {
    student: true,
    public: true,
    foreign: true,
  });

  //* Fetch jika sedang edit
  useEffect(() => {
    if (!isEditMode) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await api.get(`/daily-recap/${uniqueCode}`);
        const recapData = res.data.data;

        form.reset(recapData);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
        toast.error(message);

        navigate("/dashboard/daily-recap", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form, isEditMode, navigate, uniqueCode]);

  const initialStudentSerialNumber = form.watch("initialStudentSerialNumber");
  const finalStudentSerialNumber = form.watch("finalStudentSerialNumber");
  const initialPublicSerialNumber = form.watch("initialPublicSerialNumber");
  const finalPublicSerialNumber = form.watch("finalPublicSerialNumber");
  const initialForeignSerialNumber = form.watch("initialForeignSerialNumber");
  const finalForeignSerialNumber = form.watch("finalForeignSerialNumber");

  //* Submit handler update
  const onSubmit = async (values: TDailyRecap): Promise<void> => {
    try {
      const payload = {
        ...values,
        agent: Agent,
      };

      const res = await api.put(`/daily-recap/${uniqueCode}`, payload);
      toast.success(`${res.data.message}.`);

      form.reset();
      navigate(`/dashboard/daily-recap`, {
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
      const res = await api.delete(`/daily-recap/${uniqueCode}`);
      toast.success(`${res.data.message}.`);
      navigate("/dashboard/daily-recap");
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

          <Card className="shadow-lg rounded-md">
            <CardHeader className="text-center">
              <CardTitle>Edit Data Rekap Harian</CardTitle>
              <CardDescription>
                Ubah detail rekap harian dengan kode: {uniqueCode}
              </CardDescription>

              <CardAction className="flex gap-2">
                {/* Back */}
                <Button asChild>
                  <Link to="/dashboard/daily-recap">
                    <ArrowLeft />
                    Kembali
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
              </CardAction>
            </CardHeader>
            <Separator />
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-6">
                    {/* ROW 1 */}
                    <div className="grid gap-4">
                      {/* Tanggal Rekapitulasi */}
                      <DateField
                        control={form.control}
                        name="recapDate"
                        label="Tanggal Rekapitulasi"
                        placeholder="Pilih tanggal rekapitulasi"
                        tooltip="Pilih tanggal laporan harian dibuat."
                      />
                    </div>

                    {/* ROW 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* No. Seri Pelajar */}
                      <RangeField
                        control={form.control}
                        minName="initialStudentSerialNumber"
                        maxName="finalStudentSerialNumber"
                        label="No. Seri Pelajar"
                        placeholder={["Nomor seri awal", "Nomor seri akhir"]}
                        tooltip="Nomor seri tiket kategori Pelajar. Nomor awal otomatis diisi berdasarkan data terakhir, sedangkan nomor akhir perlu Anda masukkan."
                      />

                      {/* No. Seri Umum */}
                      <RangeField
                        control={form.control}
                        minName="initialPublicSerialNumber"
                        maxName="finalPublicSerialNumber"
                        label="No. Seri Umum"
                        placeholder={["Nomor seri awal", "Nomor seri akhir"]}
                        tooltip="Nomor seri tiket kategori Umum. Nomor awal otomatis diisi dari data terakhir, isi nomor akhir sesuai tiket yang dipakai."
                      />

                      {/* No. Seri Asing */}
                      <RangeField
                        control={form.control}
                        minName="initialForeignSerialNumber"
                        maxName="finalForeignSerialNumber"
                        label="No. Seri Asing"
                        placeholder={["Nomor seri awal", "Nomor seri akhir"]}
                        tooltip="Nomor seri tiket kategori Asing. Nomor awal otomatis diisi dari data terakhir, isi nomor akhir sesuai tiket yang dipakai."
                      />
                    </div>

                    {/* ROW 3 */}
                    <div className="grid gap-3">
                      {/* Deskripsi */}
                      <SimpleField
                        control={form.control}
                        name="description"
                        label="Deskripsi"
                        placeholder="Tambahkan keterangan (opsional)"
                        component={<Textarea className="rounded-xs" />}
                        tooltip="Tambahkan catatan tambahan terkait rekap harian."
                      />
                    </div>

                    {/* Kondisional berdasarkan ukuran layar */}
                    {isMobile && (
                      <>
                        {/* ROW 4 (mobile-only) */}
                        <div className="grid grid-cols-1 gap-4">
                          {/* Jumlah Seluruh PELAJAR */}
                          <NumberFieldInput
                            control={form.control}
                            name="studentMemberTotal"
                            label="Jumlah Pelajar"
                            placeholder="0"
                            tooltip="Jumlah anggota pelajar (terhitung otomatis)."
                            minValue={0}
                            defaultValue={0}
                            disabled
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
                            tooltip="Jumlah anggota umum (terhitung otomatis)."
                            minValue={0}
                            defaultValue={0}
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

                          {/* Jumlah Anggota ASING */}
                          <NumberFieldInput
                            control={form.control}
                            name="foreignMemberTotal"
                            label="Jumlah Asing"
                            placeholder="0"
                            tooltip="Jumlah anggota asing (terhitung otomatis)."
                            minValue={0}
                            defaultValue={0}
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

                          {/* Jumlah Seluruh Anggota */}
                          <NumberFieldInput
                            control={form.control}
                            name="visitorMemberTotal"
                            label="Total Seluruh Pengunjung"
                            placeholder="0"
                            tooltip="Jumlah  total pengunjung (terhitung otomatis)."
                            minValue={0}
                            defaultValue={0}
                            disabled
                          />

                          {/* Total Harga Pembayaran (readonly) */}
                          <SimpleField
                            control={form.control}
                            name="totalPaymentAmount"
                            label="Total Pendapatan Harga Tiket"
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
                        {/* ROW 4 (tablet-only) */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            {/* Jumlah Seluruh PELAJAR */}
                            <NumberFieldInput
                              control={form.control}
                              name="studentMemberTotal"
                              label="Jumlah Pelajar"
                              placeholder="0"
                              tooltip="Jumlah anggota pelajar (terhitung otomatis)."
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
                              tooltip="Jumlah anggota umum (terhitung otomatis)."
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
                              tooltip="Jumlah anggota asing (terhitung otomatis)."
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
                              tooltip="Jumlah  total pengunjung (terhitung otomatis)."
                              minValue={0}
                              defaultValue={0}
                              disabled
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
                              label="Total Pendapatan Harga Tiket"
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
                        {/* ROW 4 (desktop only) */}
                        <div className="grid grid-cols-4 gap-4">
                          {/* Jumlah Seluruh PELAJAR */}
                          <NumberFieldInput
                            control={form.control}
                            name="studentMemberTotal"
                            label="Jumlah Pelajar"
                            placeholder="0"
                            tooltip="Jumlah anggota pelajar (terhitung otomatis)."
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
                            tooltip="Jumlah anggota umum (terhitung otomatis)."
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
                            tooltip="Jumlah anggota asing (terhitung otomatis)."
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
                            tooltip="Jumlah  total pengunjung (terhitung otomatis)."
                            minValue={0}
                            defaultValue={0}
                            disabled
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
                            label="Total Pendapatan Harga Tiket"
                            placeholder="Masukan total pembayaran"
                            tooltip="Jumlah total pembayaran."
                            valueFormatter={(val) => formatRupiah(val || 0)}
                            disabled
                          />
                        </div>
                      </>
                    )}

                    {/* Submit Button */}
                    {isWithinOperationalHours() && (
                      <Button
                        type="submit"
                        className="rounded-xs"
                        disabled={
                          form.formState.isSubmitting ||
                          finalStudentSerialNumber <=
                            initialStudentSerialNumber ||
                          finalPublicSerialNumber <=
                            initialPublicSerialNumber ||
                          finalForeignSerialNumber <= initialForeignSerialNumber
                        }
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Perbarui Rekap Harian"
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex flex-col justify-center items-center gap-2">
              <h2 className="text-xl font-bold text-center">
                Ketentuan Pembaruan Data Rekap Harian
              </h2>

              <div className="flex justify-center items-center">
                <span className="text-base font-normal text-center max-w-1/2 border py-4 px-3">
                  Pembaruan rekap harian hanya dapat dilakukan 30 menit sebelum
                  jam operasional Museum Geologi: 09:00 – 15:00 WIB.
                </span>

                <span className="text-base font-normal text-center max-w-1/2 border p-4">
                  Silakan isi No. Seri Awal dan Akhir pada setiap kategori,
                  serta No. Seri Akhir{" "}
                  <span className="underline">tidak boleh kurang dari</span> No.
                  Seri Awal.
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

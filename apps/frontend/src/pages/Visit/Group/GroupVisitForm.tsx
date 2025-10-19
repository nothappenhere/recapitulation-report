import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GroupReservationSchema,
  defaultGroupReservationFormValues,
  type TGroupReservation,
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
  ClockIcon,
  Flag,
  Loader2,
  MapPinned,
  SquareLibrary,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useMediaQuery } from "react-responsive";
import type { AxiosError } from "axios";
import { SimpleField } from "@/components/form/SimpleField";
import { DateField } from "@/components/form/DateField";
import { ComboboxField } from "@/components/form/ComboboxField";
import { PhoneField } from "@/components/form/PhoneField";
import { NumberFieldInput } from "@/components/form/NumberField";
import { SelectField } from "@/components/form/SelectField";

export default function GroupVisitForm() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const form = useForm<TGroupReservation>({
    resolver: zodResolver(
      GroupReservationSchema
    ) as Resolver<TGroupReservation>,
    defaultValues: defaultGroupReservationFormValues,
  });

  //* for submit button validation purposes
  const foreignTotal = form.watch("foreignMemberTotal");
  const visitorTotal = form.watch("visitorMemberTotal");
  const phoneNumber = form.watch("phoneNumber");

  // * Hook untuk mengambil seluruh data waktu kunjungan museum
  const { visitHours } = useVisitingHourSelect(form);

  // * Hook untuk mengambil dan mengatur data wilayah (negara, provinsi, kabupaten/kota, kecamatan, desa)
  const { countries, provinces, regencies, districts, villages } =
    useRegionSelector(form);

  //* Hook untuk menghitung otomatis total pembayaran, uang kembalian, dan status pembayaran
  useAutoPayment("/ticket-price", form.watch, form.setValue);

  //* Submit handler: create
  const onSubmit = async (values: TGroupReservation): Promise<void> => {
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
      };

      const res = await api.post(`/group-reservation`, payload);

      const { reservationNumber } = res.data.data;
      form.reset();
      navigate(`${reservationNumber}`, { replace: true });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menyimpan data, silakan coba lagi.";
      toast.error(message);
    }
  };

  return (
    <Card className="m-5 shadow-lg rounded-md">
      <CardHeader className="text-center">
        <CardTitle>Pendataan Reservasi Rombongan</CardTitle>
        <CardDescription>
          Isi formulir di bawah untuk mencatat reservasi rombongan.
        </CardDescription>
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
                        tooltip="Jumlah total seluruh pengunjung."
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
                      tooltip="Jumlah total seluruh pengunjung."
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

              {visitorTotal < 19 && (
                <h2 className="text-xl font-bold text-center max-w-10/12 mx-auto">
                  Ketentuan Pendataan Reservasi Rombongan
                  <br />
                  <span className="text-base font-normal">
                    Jumlah minimal reservasi rombongan adalah 19 orang. Untuk
                    rombongan yang kurang dari itu, silakan melakukan reservasi
                    secara langsung melalui konter tiket yang tersedia.{" "}
                  </span>
                  <br />
                  <span className="text-base font-medium">Terima Kasih.</span>
                </h2>
              )}

              {/* ROW 5 */}
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

              {/* ROW 6 */}
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
                  disabled={!provinces.length || foreignTotal > 0}
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
                  disabled={!regencies.length || foreignTotal > 0}
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
                  disabled={!districts.length || foreignTotal > 0}
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
                  disabled={!villages.length || foreignTotal > 0}
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
                  disabled={foreignTotal === 0}
                  countrySelect
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
                    !phoneNumber
                  }
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <h2 className="text-xl font-bold text-center">
          Ketentuan Pendataan Reservasi Rombongan
          <br />
          <span className="text-base font-normal">
            Pendataan reservasi rombongan hanya dapat dilakukan 30 menit sebelum
            jam operasional Museum Geologi:
          </span>
          <br />
          <span className="text-base font-normal">09:00 – 15:00 WIB</span>
          <br />
          <span className="text-base font-medium">Terima Kasih.</span>
        </h2>
      </CardFooter>
    </Card>
  );
}

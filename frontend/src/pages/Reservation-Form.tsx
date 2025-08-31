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
  reservationSchema,
  type ReservationFormValues,
} from "@/schemas/reservationSchema";
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { formatRupiah } from "@/lib/formatter";

export default function ReservationForm() {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      reservationNumber: 0,
      salesNumber: 0,
      reservationDate: new Date(),
      visitingHour: "",
      category: "",
      groupName: "",
      groupMemberTotal: 0,
      ordererName: "",
      phoneNumber: "",
      address: "",
      province: "",
      districtOrCity: "",
      subdistrict: "",
      village: "",
      paymentAmount: 0,
      downPayment: 0,
    },
  });

  const provinceCode = form.watch("province");
  const regencyCode = form.watch("districtOrCity");
  const districtCode = form.watch("subdistrict");

  // 1. Fetch data provinsi saat load:
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/wilayah/provinces")
      .then((res) => setProvinces(res.data.data))
      .catch((err) => console.error("Failed to fetch provinces:", err));
  }, []);

  // 2. Fetch kabupaten/kota berdasarkan provinsi:
  useEffect(() => {
    if (!provinceCode) return;

    axios
      .get(
        `http://localhost:5000/api/wilayah/regencies?provinceCode=${provinceCode}`
      )
      .then((res) => {
        setRegencies(res.data.data);
        setDistricts([]);
        setVillages([]);
        form.setValue("districtOrCity", "");
        form.setValue("subdistrict", "");
        form.setValue("village", "");
      })
      .catch((err) => console.error("Failed to fetch regencies:", err));
  }, [provinceCode]);

  // 3. Fetch kecamatan berdasarkan kabupaten/kota:
  useEffect(() => {
    if (!regencyCode) return;

    const regencyCodeOnly = regencyCode.split(".")[1];

    axios
      .get(
        `http://localhost:5000/api/wilayah/districts?provinceCode=${provinceCode}&regencyCode=${regencyCodeOnly}`
      )
      .then((res) => {
        setDistricts(res.data.data);
        setVillages([]);
        form.setValue("subdistrict", "");
        form.setValue("village", "");
      })
      .catch((err) => console.error("Failed to fetch districts:", err));
  }, [regencyCode]);

  // 4. Fetch desa berdasarkan kecamatan:
  useEffect(() => {
    if (!districtCode) return;

    const parts = districtCode.split(".");
    const regencyCodeOnly = parts[1];
    const districtCodeOnly = parts[2];

    axios
      .get(
        `http://localhost:5000/api/wilayah/villages?provinceCode=${provinceCode}&regencyCode=${regencyCodeOnly}&districtCode=${districtCodeOnly}`
      )
      .then((res) => {
        setVillages(res.data.data);
        form.setValue("village", "");
      })
      .catch((err) => console.error("Failed to fetch villages:", err));
  }, [districtCode]);

  // Harga per kategori
  const pricePerCategory = {
    Pelajar: 3000,
    Umum: 5000,
    Asing: 25000,
    Khusus: 0,
  };

  const category = form.watch("category");
  const groupMemberTotal = form.watch("groupMemberTotal");

  useEffect(() => {
    if (
      !category ||
      groupMemberTotal === undefined ||
      groupMemberTotal === null
    )
      return;

    const price = pricePerCategory[category] ?? 0;
    const total = price * groupMemberTotal;

    form.setValue("paymentAmount", total);
  }, [category, groupMemberTotal]);

  const onSubmit = async (values: ReservationFormValues) => {
    try {
      setLoading(true);
      console.log("Submitting form data:", values);

      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        // Bisa ambil pesan error dari response body juga kalau ada
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Failed to submit form";
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Server response:", result);

      // Contoh: reset form setelah submit sukses
      form.reset();

      // Contoh: tampilkan notifikasi sukses (gunakan library notifikasi jika ada)
      alert("Reservasi berhasil disimpan!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        `Gagal submit form: ${error instanceof Error ? error.message : error}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">Welcome back</CardTitle>
        <CardDescription className="text-muted-foreground text-balance">
          Login with your Apple or Google account
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-3">
                {/* Nomor Reservasi Field */}
                <FormField
                  control={form.control}
                  name="reservationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Reservasi</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Masukan nomor reservasi"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nomor Penjualan Field */}
                <FormField
                  control={form.control}
                  name="salesNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Penjualan</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Masukan nomor penjualan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Kategori Field */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pelajar">Pelajar</SelectItem>
                          <SelectItem value="Umum">Umum</SelectItem>
                          <SelectItem value="Asing">Asing</SelectItem>
                          <SelectItem value="Khusus">Khusus</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Tanggal Reservasi Field */}
                <FormField
                  control={form.control}
                  name="reservationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Reservasi</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "border-black rounded-sm pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: id })
                              ) : (
                                <span>Pilih tanggal</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-75" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Waktu Kunjungan Field */}
                <FormField
                  control={form.control}
                  name="visitingHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waktu Kunjungan</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="time"
                            step="1"
                            placeholder="Masukan waktu kunjungan"
                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:size-4 [&::-webkit-calendar-picker-indicator]:opacity-75 [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:appearance-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {/* Nama Pemesan Field */}
                <FormField
                  control={form.control}
                  name="ordererName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Pemesan</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Masukan nama pemesan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nomor Telepon Field */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Masukan nomor telepon"
                          value={field.value}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, ""); // ambil angka saja

                            // Normalisasi awal menjadi +62
                            let formatted = "";
                            if (rawValue.startsWith("0")) {
                              formatted = "+62" + rawValue.slice(1);
                            } else if (rawValue.startsWith("62")) {
                              formatted = "+62" + rawValue.slice(2);
                            } else if (rawValue.startsWith("8")) {
                              formatted = "+62" + rawValue;
                            } else {
                              formatted = rawValue;
                            }

                            // Tambahkan format spasi/dash sesuai kebutuhan
                            const formatWithSpaces = formatted.replace(
                              /^(\+62)(\d{3})(\d{4})(\d{0,4})/,
                              (_, p1, p2, p3, p4) => {
                                return [p1, p2, p3, p4]
                                  .filter(Boolean)
                                  .join("-");
                              }
                            );

                            field.onChange(formatWithSpaces);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nama Rombongan Field */}
                <FormField
                  control={form.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Rombongan</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Masukan nama rombongan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Jumlah Anggota Rombongan Field */}
                <FormField
                  control={form.control}
                  name="groupMemberTotal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Anggota Rombongan</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukan jumlah anggota rombongan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Masukan alamat lengkap"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {/* Provinsi Field */}
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provinsi</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!provinces.length}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih provinsi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provinces.map((prov) => (
                            <SelectItem key={prov.code} value={prov.code}>
                              {prov.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Kabupaten/Kota Field */}
                <FormField
                  control={form.control}
                  name="districtOrCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kabupaten/Kota</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!regencies.length}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih kabupaten/kota" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regencies.map((reg) => (
                            <SelectItem key={reg.code} value={reg.code}>
                              {reg.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Kecamatan Field */}
                <FormField
                  control={form.control}
                  name="subdistrict"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kecamatan</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!districts.length}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Kecamatan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {districts.map((dist) => (
                            <SelectItem key={dist.code} value={dist.code}>
                              {dist.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Kelurahan/Desa Field */}
                <FormField
                  control={form.control}
                  name="village"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kelurahan/Desa</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!villages.length}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Kelurahan/Desa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {villages.map((vill) => (
                            <SelectItem key={vill.code} value={vill.code}>
                              {vill.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Total Pembayaran Field */}
                <FormField
                  control={form.control}
                  name="paymentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Pembayaran</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Masukan total pembayaran"
                          disabled
                          value={formatRupiah(field.value || 0)} // << tampilkan dalam format Rupiah
                          onChange={() => {}}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Uang Muka Field */}
                <FormField
                  control={form.control}
                  name="downPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uang Muka</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Masukan uang muka"
                          value={formatRupiah(field.value || 0)} // tampilkan hasil format
                          onChange={(e) => {
                            // Ambil hanya angka dari input (hapus Rp dan titik)
                            const rawValue = e.target.value.replace(
                              /[^\d]/g,
                              ""
                            );
                            field.onChange(Number(rawValue));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Separator />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Loading
                  </>
                ) : (
                  "Tambah reservasi"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

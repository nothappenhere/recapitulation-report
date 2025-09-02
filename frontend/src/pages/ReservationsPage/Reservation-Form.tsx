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
  reservationFormSchema,
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
import axios, { AxiosError } from "axios";
import { formatRupiah } from "@/lib/formatter";
import api from "@/lib/axios";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import toast from "react-hot-toast";

export default function ReservationForm() {
  const { reservationId } = useParams();
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof reservationFormSchema>>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      category: undefined,
      reservationDate: new Date(),
      visitingHour: "",
      ordererName: "",
      phoneNumber: "",
      address: "",
      groupName: "",
      groupMemberTotal: 0,
      province: "",
      regencyOrCity: "",
      district: "",
      village: "",
      paymentAmount: 0,
      downPayment: 0,
      changeAmount: 0,
      statusPayment: "Unpaid",
    },
  });

  const provinceCode = form.watch("province");
  const regencyCode = form.watch("regencyOrCity");
  const districtCode = form.watch("district");

  //* 1. Fetch data provinsi saat load:
  useEffect(() => {
    const getProvinces = async () => {
      try {
        const response = await api.get("/wilayah/provinces");
        setProvinces(response.data?.data?.data);
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
        const response = await api.get(`/wilayah/regencies/${provinceCode}`);
        setRegencies(response.data?.data?.data);
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
          `/wilayah/districts/${provinceCode}/${regencyCodeOnly}`
        );
        setDistricts(response.data?.data?.data);
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
          `/wilayah/villages/${provinceCode}/${regencyCodeOnly}/${districtCodeOnly}`
        );
        setVillages(response.data?.data?.data);
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
  }, [form, category, groupMemberTotal]);

  const paymentAmount = form.watch("paymentAmount");
  const downPayment = form.watch("downPayment");
  useEffect(() => {
    const payment = paymentAmount || 0;
    const down = downPayment || 0;

    // Hitung uang kembalian
    const change = down > payment ? down - payment : 0;
    form.setValue("changeAmount", change);

    // Tentukan status pembayaran
    let status: "Paid" | "DP" | "Unpaid" = "Unpaid";

    if (down >= payment && payment > 0) {
      status = "Paid";
    } else if (down > 0 && down < payment) {
      status = "DP";
    }

    form.setValue("statusPayment", status);
  }, [form, paymentAmount, downPayment]);

  // 🔹 Fetch reservation by ID kalau sedang edit
  useEffect(() => {
    if (!reservationId) return;

    const fetchReservation = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/reservations/${reservationId}`
        );
        const data = res.data;

        // reset form dengan data dari server
        form.reset({
          ...data,
          reservationDate: data.reservationDate
            ? new Date(data.reservationDate)
            : new Date(),
        });
      } catch (err) {
        console.error("Failed to fetch reservation:", err);
        alert("Data reservasi tidak ditemukan");
        navigate("/reservations"); // balik ke list kalau gagal
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  //* Submit handler: create atau update
  const onSubmit = async (values: ReservationFormValues) => {
    try {
      setLoading(true);

      if (reservationId) {
        // Update reservasi
        await axios.put(
          `http://localhost:5000/api/reservations/${reservationId}`,
          values
        );
        alert("Reservasi berhasil diperbarui!");
      } else {
        // Tambah reservasi baru
        const response = await api.post("/reservations", values);
        console.log(response);
        alert(
          `Reservasi berhasil ditambahkan! No: ${response.data.data.reservationNumber}`
        );
      }

      navigate("/dashboard/reservation"); // balik ke list setelah submit
    } catch (error) {
      console.error(error);
      alert("Gagal simpan reservasi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">
          {reservationId ? "Edit Reservasi" : "Buat Reservasi Baru"}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-balance">
          {reservationId
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
                              variant="outline"
                              className={cn(
                                "border-black rounded-sm pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: id })
                              ) : (
                                <span className="text-muted-foreground">
                                  Pilih tanggal reservasi
                                </span>
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
                              date < new Date() || date < new Date("1900-01-01")
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
                            step="-1"
                            placeholder="Masukan waktu kunjungan"
                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:size-4 [&::-webkit-calendar-picker-indicator]:right-2.5 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:appearance-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ROW 2 */}
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

              {/* ROW 3 */}
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

              {/* ROW 4 */}
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
                  name="regencyOrCity"
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
                  name="district"
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
                            <SelectValue placeholder="Pilih kecamatan" />
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
                            <SelectValue placeholder="Pilih kelurahan/desa" />
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

              {/* ROW 5 */}
              <div className="grid grid-cols-4 gap-3">
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
                          value={formatRupiah(field.value || 0)}
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
                          value={formatRupiah(field.value || 0)}
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

                {/* Uang Kembalian Field */}
                <FormField
                  control={form.control}
                  name="changeAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uang Kembalian</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Masukan uang kembalian"
                          disabled
                          value={formatRupiah(field.value || 0)}
                          onChange={() => {}}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status Pembayaran Field */}
                <FormField
                  control={form.control}
                  name="statusPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Pembayaran</FormLabel>
                      <Input
                        type="text"
                        disabled
                        value={
                          field.value === "Paid"
                            ? "Lunas"
                            : field.value === "DP"
                            ? "DP"
                            : "Belum Bayar"
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Loading
                  </>
                ) : reservationId ? (
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

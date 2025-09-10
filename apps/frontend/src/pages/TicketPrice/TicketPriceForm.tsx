import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { api } from "@rzkyakbr/libs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { formatRupiah } from "@rzkyakbr/libs";
import type { AxiosError } from "axios";
import {
  TicketPriceSchema,
  type TicketPriceFormSchema,
} from "@rzkyakbr/schemas";

export default function TicketPriceForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
    reset,
  } = useForm<TicketPriceFormSchema>({
    resolver: zodResolver(TicketPriceSchema),
    defaultValues: {
      category: undefined,
      unitPrice: 0,
    },
  });

  // 🔹 Fetch jika sedang edit
  useEffect(() => {
    if (!ticketId) return;

    const fetchTicketPrice = async () => {
      try {
        const res = await api.get(`/ticket-price/${ticketId}`);
        const { category, unitPrice } = res.data.data;
        setValue("category", category);
        setValue("unitPrice", unitPrice);
        setIsEdit(true);
      } catch (err) {
        toast.error("Data tidak ditemukan.");
        navigate("/dashboard/ticket-price");
      }
    };

    fetchTicketPrice();
  }, [ticketId]);

  //* Fetch kategori (untuk disabled select)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(`/ticket-price`);
        const items = res.data.data || [];

        const categories = items.map(
          (item: { category: string; unitPrice: number }) => item.category
        );
        setExistingCategories(categories);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.log(`Gagal memuat data kategori: ${error}`);
        toast.error("Gagal memuat data kategori yang tersedia.");
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: TicketPriceFormSchema) => {
    try {
      if (isEdit && ticketId) {
        await api.put(`/ticket-price/${ticketId}`, data);
        toast.success("Harga tiket berhasil diperbarui.");
      } else {
        await api.post(`/ticket-price`, data);
        toast.success("Harga tiket berhasil ditambahkan.");
      }

      navigate("/dashboard/ticket-price");
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <div className="flex justify-center items-center mt-14">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEdit ? "Edit Harga Tiket" : "Tambah Harga Tiket"}
            </CardTitle>
            <CardDescription>
              {isEdit
                ? "Perbarui informasi harga tiket di bawah ini."
                : "Masukkan informasi harga tiket di bawah ini."}
            </CardDescription>

            <CardAction>
              <Badge
                asChild
                variant="outline"
                className="py-1.5 hover:cursor-pointer"
              >
                <Link to="/dashboard/ticket-price">
                  <ArrowLeft className="mr-1" />
                  Kembali
                </Link>
              </Badge>
            </CardAction>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Golongan Field */}
              <div className="grid gap-4">
                <Label htmlFor="category">Golongan</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih golongan" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Pelajar", "Umum", "Asing", "Khusus"].map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                            disabled={
                              !isEdit && existingCategories.includes(item)
                            }
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Harga Satuan Field */}
              <div className="grid gap-4">
                <Label htmlFor="unitPrice">Harga Satuan</Label>
                <Controller
                  control={control}
                  name="unitPrice"
                  render={({ field }) => (
                    <Input
                      id="unitPrice"
                      type="text"
                      inputMode="numeric"
                      placeholder="Masukkan harga satuan"
                      value={
                        isNaN(field.value) || field.value === 0
                          ? ""
                          : formatRupiah(Number(field.value))
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^0-9]/g, ""); // buang selain angka
                        field.onChange(rawValue ? Number(rawValue) : 0);
                      }}
                    />
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Loading
                  </>
                ) : isEdit ? (
                  "Perbarui"
                ) : (
                  "Simpan"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

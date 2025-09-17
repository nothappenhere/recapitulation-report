import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  defaultTicketPriceFormValues,
  TicketPriceSchema,
  type TTicketPrice,
} from "@rzkyakbr/schemas";
import { api, formatRupiah } from "@rzkyakbr/libs";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, List, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { SelectField } from "@/components/form/SelectField";
import { SimpleField } from "@/components/form/SimpleField";

export default function TicketPriceForm() {
  const { id } = useParams();
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const form = useForm<TTicketPrice>({
    resolver: zodResolver(TicketPriceSchema),
    defaultValues: defaultTicketPriceFormValues,
  });

  //* Fetch jika sedang edit
  useEffect(() => {
    if (!id) return;

    const fetchTicketPrice = async () => {
      try {
        const res = await api.get(`/ticket-price/${id}`);
        const { category, unitPrice } = res.data.data;

        form.setValue("category", category);
        form.setValue("unitPrice", unitPrice);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
        toast.error(message);

        navigate("/dashboard/ticket-price");
      }
    };

    fetchTicketPrice();
  }, [form, navigate, id]);

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
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
        toast.error(message);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (values: TTicketPrice) => {
    try {
      if (isEditMode && id) {
        const res = await api.put(`/ticket-price/${id}`, values);
        toast.success(`${res.data.message}.`);
      } else {
        const res = await api.post(`/ticket-price`, values);
        toast.success(`${res.data.message}.`);
      }

      form.reset();
      navigate("/dashboard/ticket-price");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menyimpan data, silakan coba lagi.";
      toast.error(message);
    }
  };

  return (
    <div className="flex justify-center items-center mt-14">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditMode ? "Edit Data Harga Tiket" : "Pendataan Harga Tiket"}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? `Ubah detail harga tiket dengan ID: ${id}`
                : "Isi formulir di bawah untuk membuat harga tiket baru."}
            </CardDescription>

            <CardAction>
              <Badge
                asChild
                variant="outline"
                className="py-1.5 hover:cursor-pointer"
              >
                <Link to="/dashboard/ticket-price">
                  <ArrowLeft className="mr-0.5" />
                  Kembali
                </Link>
              </Badge>
            </CardAction>
          </CardHeader>
          <Separator />
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  {/* Kategori */}
                  <div className="grid gap-3">
                    <SelectField
                      control={form.control}
                      name="category"
                      label="Kategori"
                      placeholder="Pilih Kategori"
                      icon={List}
                      options={[
                        {
                          value: "Pelajar",
                          label: "Pelajar",
                          disabled:
                            !isEditMode &&
                            existingCategories.includes("Pelajar"),
                        },
                        {
                          value: "Umum",
                          label: "Umum",
                          disabled:
                            !isEditMode && existingCategories.includes("Umum"),
                        },
                        {
                          value: "Asing",
                          label: "Asing",
                          disabled:
                            !isEditMode && existingCategories.includes("Asing"),
                        },
                        {
                          value: "Khusus",
                          label: "Khusus",
                          disabled:
                            !isEditMode &&
                            existingCategories.includes("Khusus"),
                        },
                      ]}
                      tooltip="Pilih kategori/golongan untuk tiket ini."
                    />
                  </div>

                  {/* Harga Satuan */}
                  <div className="grid gap-3">
                    <SimpleField
                      control={form.control}
                      name="unitPrice"
                      label="Harga Satuan"
                      placeholder="Masukan harga satuan"
                      tooltip="Masukan harga dalam rupiah (contoh: 25.000)"
                      // tampilkan dalam format rupiah
                      valueFormatter={(value) =>
                        isNaN(value) || value === 0
                          ? ""
                          : formatRupiah(Number(value))
                      }
                      // parsing balik ke number saat ketik
                      onChangeOverride={(e, field) => {
                        const raw = e.target.value.replace(/[^0-9]/g, ""); // hanya angka
                        field.onChange(raw ? Number(raw) : 0);
                      }}
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
                      "Perbarui Harga Tiket"
                    ) : (
                      "Tambah Harga Tiket"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

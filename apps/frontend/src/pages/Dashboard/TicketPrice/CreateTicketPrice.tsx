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
import { Link, useNavigate } from "react-router";
import { ArrowLeft, List, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { SelectField } from "@/components/form/SelectField";
import { SimpleField } from "@/components/form/SimpleField";
import TicketPriceFormSkeleton from "@/components/skeleton/TicketPriceFormSkeleton";
import { useUser } from "@/hooks/use-user-context";

export default function CreateTicketPrice() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);

  const { user } = useUser();
  const role = user?.role || null;

  if (role !== "Administrator") {
    toast.error("Anda tidak memiliki akses untuk mengunjungi halaman ini.");
    navigate("/dashboard/ticket-price", { replace: true });
  }

  const form = useForm<TTicketPrice>({
    resolver: zodResolver(TicketPriceSchema),
    defaultValues: defaultTicketPriceFormValues,
  });

  //* Fetch kategori (untuk disabled select)
  useEffect(() => {
    const fetchTicketPrices = async () => {
      setLoading(true);

      try {
        const res = await api.get("/ticket-price");
        const existing = res.data.data || [];

        const items = res.data.data || [];
        const categories = items.map(
          (item: { category: string; unitPrice: number }) => item.category
        );
        setExistingCategories(categories);

        if (existing.length >= 4) {
          toast.error("Tidak bisa menambahkan lebih dari 4 kategori.");
          navigate("/dashboard/ticket-price", { replace: true });
        }
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
        toast.error(message);

        navigate("/dashboard/ticket-price", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchTicketPrices();
  }, [navigate]);

  const category = form.watch("category");

  //* Submit handler: create
  const onSubmit = async (values: TTicketPrice): Promise<void> => {
    try {
      const res = await api.post(`/ticket-price`, values);
      toast.success(`${res.data.message}.`);

      form.reset();
      navigate("/dashboard/ticket-price", { replace: true });
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
        <TicketPriceFormSkeleton />
      ) : (
        <div className="flex justify-center items-center mt-14">
          <div className="w-full max-w-sm">
            <Card className="shadow-lg rounded-md">
              <CardHeader>
                <CardTitle>Pendataan Harga Tiket</CardTitle>
                <CardDescription>
                  Isi formulir di bawah untuk membuat harga tiket baru.
                </CardDescription>

                <CardAction>
                  <Button asChild>
                    <Link to="/dashboard/ticket-price">
                      <ArrowLeft className="mr-0.5" />
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
                              disabled: existingCategories.includes("Pelajar"),
                            },
                            {
                              value: "Umum",
                              label: "Umum",
                              disabled: existingCategories.includes("Umum"),
                            },
                            {
                              value: "Asing",
                              label: "Asing",
                              disabled: existingCategories.includes("Asing"),
                            },
                            {
                              value: "Khusus",
                              label: "Khusus",
                              disabled: existingCategories.includes("Khusus"),
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
                          onChangeOverride={(e, field) => {
                            const rawValue = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ); // hanya angka
                            field.onChange(Number(rawValue));
                          }}
                          valueFormatter={(val) => formatRupiah(val || 0)}
                          tooltip="Masukan harga tiket untuk kategori/golongan ini."
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="rounded-xs"
                        disabled={
                          form.formState.isSubmitting || category === ""
                        }
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin" />
                            Loading...
                          </>
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
      )}
    </>
  );
}

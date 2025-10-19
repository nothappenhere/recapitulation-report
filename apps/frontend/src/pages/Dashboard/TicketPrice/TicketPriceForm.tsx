import { useCallback, useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { ArrowLeft, List, Loader2, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { SelectField } from "@/components/form/SelectField";
import { SimpleField } from "@/components/form/SimpleField";
import FormSkeleton from "@/components/skeleton/FormSkeleton";
import AlertDelete from "@/components/AlertDelete";
import { useUser } from "@/hooks/use-user-context";

export default function TicketPriceForm() {
  const { category } = useParams();
  const isEditMode = Boolean(category);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const { user } = useUser();
  const role = user?.role || null;
  if (role !== "Administrator") {
    toast.error("Anda tidak memiliki akses untuk mengunjungi halaman ini.");
    navigate("/dashboard/ticket-price", { replace: true });
  }

  const form = useForm<TTicketPrice>({
    resolver: zodResolver(TicketPriceSchema) as Resolver<TTicketPrice>,
    defaultValues: defaultTicketPriceFormValues,
  });

  //* for submit button validation purposes
  const selectedCategory = form.watch("category");

  //* Fetch category (for disabled select)
  useEffect(() => {
    const fetchTicketPrices = async () => {
      setLoading(true);

      try {
        const res = await api.get("/ticket-price");

        if (!isEditMode) {
          const existing = res.data.data || [];
          if (existing.length >= 4) {
            toast.error("Jumlah maksimum 4 kategori telah terisi.");
            navigate("/dashboard/ticket-price", { replace: true });
          }
        }

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

        navigate("/dashboard/ticket-price", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchTicketPrices();
  }, [navigate, isEditMode]);

  //* Fetch data if currently editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/ticket-price/${category}`);
        const ticketPriceData: TTicketPrice = res.data.data;
        form.reset(ticketPriceData);
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

    fetchData();
  }, [form, navigate, category, isEditMode]);

  //* Submit handler: create or update data
  const onSubmit = async (values: TTicketPrice): Promise<void> => {
    try {
      let res = null;
      if (!isEditMode) {
        // Create data
        res = await api.post(`/ticket-price`, values);
      } else {
        // Update data
        res = await api.put(`/ticket-price/${category}`, values);
      }

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

  //* Delete handler: delete data after confirmation
  const confirmDelete = useCallback(async () => {
    if (!category || !isEditMode) return;

    try {
      const res = await api.delete(`/ticket-price/${category}`);
      toast.success(`${res.data.message}.`);
      navigate("/dashboard/ticket-price");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menghapus data, silakan coba lagi.";
      toast.error(message);
    } finally {
      setDeleteOpen(false);
    }
  }, [navigate, category, isEditMode]);

  return (
    <>
      {loading ? (
        <FormSkeleton />
      ) : (
        <>
          <AlertDelete
            open={isDeleteOpen}
            setOpen={setDeleteOpen}
            onDelete={confirmDelete}
          />

          <div className="flex justify-center items-center mt-10">
            <div className="w-full max-w-sm">
              <Card className="shadow-lg rounded-md">
                <CardHeader>
                  <CardTitle>
                    {isEditMode
                      ? "Edit Data Harga Tiket"
                      : "Pendataan Harga Tiket"}
                  </CardTitle>
                  <CardDescription>
                    {isEditMode
                      ? `Ubah detail harga tiket dengan kategori: ${category}`
                      : "Isi formulir di bawah untuk membuat harga tiket baru."}
                  </CardDescription>

                  <CardAction className="flex flex-col gap-2">
                    {/* Back */}
                    <Button asChild>
                      <Link to="/dashboard/ticket-price">
                        <ArrowLeft />
                        Kembali
                      </Link>
                    </Button>

                    {/* Delete */}
                    {isEditMode && (
                      <Button
                        variant="destructive"
                        onClick={() => setDeleteOpen(true)}
                      >
                        <Trash2 />
                        Hapus
                      </Button>
                    )}
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
                                  existingCategories.includes("Pelajar") ||
                                  isEditMode,
                              },
                              {
                                value: "Umum",
                                label: "Umum",
                                disabled:
                                  existingCategories.includes("Umum") ||
                                  isEditMode,
                              },
                              {
                                value: "Asing",
                                label: "Asing",
                                disabled:
                                  existingCategories.includes("Asing") ||
                                  isEditMode,
                              },
                              {
                                value: "Khusus",
                                label: "Khusus",
                                disabled:
                                  existingCategories.includes("Khusus") ||
                                  isEditMode,
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
                            form.formState.isSubmitting ||
                            selectedCategory === ""
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
                                ? "Perbarui Harga Tiket"
                                : "Tambah Harga Tiket"}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
  );
}

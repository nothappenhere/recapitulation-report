import { useCallback, useEffect, useState } from "react";
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
import { ArrowLeft, List, Loader2, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { SelectField } from "@/components/form/SelectField";
import { SimpleField } from "@/components/form/SimpleField";
import TicketPriceFormSkeleton from "@/components/skeleton/TicketPriceFormSkeleton";
import { useUser } from "@/hooks/use-user-context";
import AlertDelete from "@/components/AlertDelete";

export default function DetailTicketPrice() {
  const { category } = useParams();
  const isEditMode = Boolean(category);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  //* Fetch jika sedang edit
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

  //* Submit handler: update
  const onSubmit = async (values: TTicketPrice): Promise<void> => {
    try {
      const res = await api.put(`/ticket-price/${category}`, values);
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

  // TODO: Handler delete setelah dikonfirmasi
  const confirmDelete = useCallback(async () => {
    if (!category) return;

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
  }, [category, navigate]);

  return (
    <>
      {loading ? (
        <TicketPriceFormSkeleton />
      ) : (
        <>
          <AlertDelete
            open={isDeleteOpen}
            setOpen={setDeleteOpen}
            onDelete={confirmDelete}
          />

          <div className="flex justify-center items-center mt-14">
            <div className="w-full max-w-sm">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Data Harga Tiket</CardTitle>
                  <CardDescription>
                    Ubah detail harga tiket dengan kategori: {category}
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
                                disabled: form.watch("category") !== "Pelajar",
                              },
                              {
                                value: "Umum",
                                label: "Umum",
                                disabled: form.watch("category") !== "Umum",
                              },
                              {
                                value: "Asing",
                                label: "Asing",
                                disabled: form.watch("category") !== "Asing",
                              },
                              {
                                value: "Khusus",
                                label: "Khusus",
                                disabled: form.watch("category") !== "Khusus",
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
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? (
                            <>
                              <Loader2 className="animate-spin" />
                              Loading...
                            </>
                          ) : (
                            "Perbarui Harga Tiket"
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

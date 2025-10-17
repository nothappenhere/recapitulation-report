import { api, setTitle } from "@rzkyakbr/libs";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { TicketPriceCard } from "./TicketPriceCard";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { type AxiosError } from "axios";
import { useUser } from "@/hooks/use-user-context";
import AlertDelete from "@/components/AlertDelete";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import { ArrowUpRightIcon, RefreshCw, TicketIcon } from "lucide-react";
import type { TicketPriceFullTypes } from "@rzkyakbr/types";

export default function TicketPricePage() {
  setTitle("Ticket Price - GeoVisit");

  const [data, setData] = useState<TicketPriceFullTypes[]>([]);
  const [selectedItem, setSelectedItem] = useState<TicketPriceFullTypes | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const { user } = useUser();
  const role = user?.role || null;

  //* Fetch data for displaying card
  const fetchTicketPrices = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get(`/ticket-price`);
      setData(res.data.data);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTicketPrices();
  }, [fetchTicketPrices]);

  //* Delete handler: delete data after confirmation
  const confirmDelete = async () => {
    if (!selectedItem) return;
    setLoading(true);

    try {
      const res = await api.delete(`/ticket-price/${selectedItem.category}`);
      toast.success(`${res.data.message}.`);
      setData((prev) => prev.filter((tp) => tp._id !== selectedItem._id));
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Terjadi kesalahan saat menghapus data, silakan coba lagi.";
      toast.error(message);
    } finally {
      setSelectedItem(null);
      setDeleteOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && data.length > 0 ? (
        <CardSkeleton />
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Ticket Price Card for each Category*/}
              <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
                {data.map((tp) => (
                  <TicketPriceCard
                    key={tp._id}
                    ticketPrice={tp}
                    onEdit={() => setSelectedItem(tp)}
                    onDelete={() => {
                      setSelectedItem(tp);
                      setDeleteOpen(true);
                    }}
                  />
                ))}
              </div>

              {data.length === 0 ? (
                role === "Administrator" ? (
                  <>
                    {/* Teks dan tombol untuk admin */}
                    <Empty className="mt-16">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <TicketIcon />
                        </EmptyMedia>
                        <EmptyTitle> Tidak ada daftar harga tiket.</EmptyTitle>
                        <EmptyDescription>
                          Siap untuk mengatur harga tiket kunjungan ke Museum
                          Geologi? Buat data pertama untuk memulai.
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button
                          variant="link"
                          asChild
                          className="text-muted-foreground"
                          size="sm"
                        >
                          <Link to="add">
                            Tambah Harga Tiket <ArrowUpRightIcon />
                          </Link>
                        </Button>
                      </EmptyContent>
                    </Empty>
                  </>
                ) : (
                  <>
                    {/* Teks dan tombol untuk user biasa */}
                    <Empty className="mt-16">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <TicketIcon />
                        </EmptyMedia>
                        <EmptyTitle> Tidak ada daftar harga tiket.</EmptyTitle>
                        <EmptyDescription>
                          Anda tidak memiliki akses untuk menambahkan harga
                          tiket. Silakan hubungi Administrator jika diperlukan.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </>
                )
              ) : data.length > 0 && data.length < 4 ? (
                role === "Administrator" && (
                  <div className="flex items-center justify-center">
                    <Button asChild className="my-1.5">
                      <Link to="add">Tambah Harga Tiket</Link>
                    </Button>
                  </div>
                )
              ) : null}

              {role === "User" && data.length !== 0 && (
                <div className="flex items-center justify-center">
                  <Button onClick={fetchTicketPrices}>
                    <RefreshCw className="mt-0.5" />
                    Refresh
                  </Button>
                </div>
              )}

              {selectedItem && (
                <AlertDelete
                  open={isDeleteOpen}
                  setOpen={setDeleteOpen}
                  onDelete={confirmDelete}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

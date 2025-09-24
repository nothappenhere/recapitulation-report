import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api, formatPhoneNumber, formatRupiah } from "@rzkyakbr/libs";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { formatDate } from "@rzkyakbr/libs";
import { InfoRow } from "@/lib/InfoRow";
import type { WalkInFullTypes } from "@rzkyakbr/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function WalkinPrintPage() {
  const { uniqueCode } = useParams();
  const [walkin, setWalkin] = useState<WalkInFullTypes | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //* Fetch data
  useEffect(() => {
    if (!uniqueCode) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/walk-in/${uniqueCode}`);
        setWalkin(res.data.data);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
        toast.error(message);

        navigate("/dashboard/walk-in", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uniqueCode, navigate]);

  if (!walkin) return <p>Loading...</p>;

  return (
    <>
      {walkin && (
        <div className="print:w-[76mm] print:mx-auto print:text-xs print:font-mono print:m-0 print:p-0 ">
          <Card className="max-w-[76mm] mx-auto font-mono text-xs">
            <CardHeader className="flex flex-col items-center justify-center">
              <Avatar>
                <AvatarImage src="/img/logo-mg.png" alt="Logo Museum Geologi" />
                <AvatarFallback>MG</AvatarFallback>
              </Avatar>

              <CardTitle>Bukti Pembayaran Tiket Kunjungan</CardTitle>
              <CardTitle>Museum Geologi</CardTitle>
              <CardTitle>Jl. Diponegoro No. 57, Kota Bandung</CardTitle>
              <CardTitle>Telp : 022-7213822</CardTitle>
              <CardTitle>Fax : 022-7213822</CardTitle>
              <CardTitle>Email : museum-geologi@esdm.go.id</CardTitle>
            </CardHeader>

            <CardContent className="border-y py-4 grid gap-2">
              <InfoRow label="No. Kunjungan" value={walkin.walkInNumber} />

              <InfoRow
                label="Tgl. Kunjungan"
                value={format(
                  new Date(walkin.visitingDate),
                  "dd MMM yyyy, HH:MM:SS",
                  {
                    locale: id,
                  }
                )}
              />
              <InfoRow label="Nama Pemesan" value={walkin.ordererName} />
              <InfoRow label="No. Telepon" value={`${walkin.phoneNumber}`} />

              <InfoRow
                label="Pelajar (Student)"
                value={`${walkin.studentMemberTotal} pengunjung`}
              />
              <InfoRow
                label="Harga Tiket"
                value={`${formatRupiah(walkin.studentTotalAmount)}`}
              />

              <InfoRow
                label="Umum (Public)"
                value={`${walkin.publicMemberTotal} pengunjung`}
              />
              <InfoRow
                label="Harga Tiket"
                value={`${formatRupiah(walkin.publicTotalAmount)}`}
              />

              <InfoRow
                label="Asing (Foreigner)"
                value={`${walkin.foreignMemberTotal} pengunjung`}
              />
              <InfoRow
                label="Harga Tiket"
                value={`${formatRupiah(walkin.foreignTotalAmount)}`}
              />

              <InfoRow
                label="Total Pengunjung (Visitors)"
                value={`${walkin.visitorMemberTotal} pengunjung`}
              />
              <InfoRow
                label="Total Harga Tiket"
                value={`${formatRupiah(walkin.totalPaymentAmount)}`}
              />

              <InfoRow label="Status Pembayaran" value={walkin.statusPayment} />
            </CardContent>

            <p className="text-center mt-2">
              # Terima Kasih Atas Kunjungan Anda #
            </p>

            {/* Tombol hanya muncul di layar */}
            <CardFooter className="flex justify-end items-center print:hidden">
              <Button onClick={() => window.print()}>Print</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}

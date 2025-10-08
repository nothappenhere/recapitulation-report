import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { api, formatRupiah } from "@rzkyakbr/libs";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { InfoRow } from "@/components/InfoRow";
import type { GroupReservationFullTypes } from "@rzkyakbr/types";
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
import { ArrowLeft, Printer } from "lucide-react";

export default function GroupReservationPrintPage() {
  const { uniqueCode } = useParams();
  const [reservationData, setReservationData] =
    useState<GroupReservationFullTypes | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //* Fetch data
  useEffect(() => {
    if (!uniqueCode) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await api.get(`/group-reservation/${uniqueCode}`);
        setReservationData(res.data.data);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
        toast.error(message);

        navigate("/dashboard/group-reservation", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uniqueCode, navigate]);

  if (loading || !reservationData) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <>
      {reservationData && (
        <div className="print:w-[76mm] print:mx-auto print:text-xs print:font-mono print:m-0 print:p-0">
          <Card className="max-w-[76mm] mx-auto font-mono text-xs">
            <CardHeader className="flex flex-col items-center justify-center">
              <Avatar>
                <AvatarImage src="/img/logo-mg.png" alt="Logo Museum Geologi" />
                <AvatarFallback>MG</AvatarFallback>
              </Avatar>

              <CardTitle>Bukti Pembayaran Reservasi</CardTitle>
              <CardTitle>Museum Geologi</CardTitle>
              <CardTitle>Jl. Diponegoro No. 57, Kota Bandung</CardTitle>
              <CardTitle>Telp : 022-7213822</CardTitle>
              <CardTitle>Fax : 022-7213822</CardTitle>
              <CardTitle>Email : museum-geologi@esdm.go.id</CardTitle>
              <CardTitle>Website : museum.geologi.esdm.go.id</CardTitle>
            </CardHeader>

            <CardContent className="border-y py-4 grid gap-2">
              <InfoRow
                label="Kode Reservasi (Reservation code)"
                value={reservationData.reservationNumber}
              />

              <InfoRow
                label="Tgl. Kunjungan (Visiting Date)"
                value={format(
                  new Date(reservationData.visitingDate),
                  `dd MMM yyyy`,
                  {
                    locale: id,
                  }
                )}
              />
              <InfoRow
                label="Waktu Kunjungan (Visiting Hour)"
                value={`${reservationData.visitingHour.timeRange}`}
              />
              <InfoRow
                label="Nama Pemesan (Orderer Name)"
                value={reservationData.ordererName}
              />
              <InfoRow
                label="No. Telepon (Phone Number)"
                value={`${reservationData.phoneNumber}`}
              />

              <InfoRow
                label="Pelajar (Student)"
                value={`${reservationData.studentMemberTotal} pengunjung`}
              />
              <InfoRow
                label="Harga Tiket (Ticket Price)"
                value={`${formatRupiah(reservationData.studentTotalAmount)}`}
              />

              <InfoRow
                label="Umum (Public)"
                value={`${reservationData.publicMemberTotal} pengunjung`}
              />
              <InfoRow
                label="Harga Tiket (Ticket Price)"
                value={`${formatRupiah(reservationData.publicTotalAmount)}`}
              />

              <InfoRow
                label="Asing (Foreigner)"
                value={`${reservationData.foreignMemberTotal} pengunjung`}
              />
              <InfoRow
                label="Harga Tiket (Ticket Price)"
                value={`${formatRupiah(reservationData.foreignTotalAmount)}`}
              />

              <InfoRow
                label="Total Pengunjung (Visitors)"
                value={`${reservationData.visitorMemberTotal} pengunjung`}
              />
              <InfoRow
                label="Total Harga Tiket (Ttl. Ticket Price)"
                value={`${formatRupiah(reservationData.totalPaymentAmount)}`}
              />

              <InfoRow
                label="Metode Pembayaran (Payment Method)"
                value={reservationData.paymentMethod}
              />
              <InfoRow
                label="Status Pembayaran (Payment Status)"
                value={reservationData.statusPayment}
              />
            </CardContent>

            <p className="text-center">
              ~ Terima Kasih Atas Kunjungan Anda, <br />
              Kami Harapkan Kunjungan Anda Kembali. ~
            </p>

            <div className="flex justify-center">
              <img
                src="/img/logo-smart-mg.png"
                alt="Logo Smart Museum Geologi"
                width={128}
                height={128}
              />
            </div>

            {/* Tombol hanya muncul di layar */}
            <CardFooter className="flex flex-col justify-between items-center gap-3 border-t border-dashed print:hidden">
              <Button variant="outline" onClick={() => window.print()}>
                Print
                <Printer />
              </Button>

              <Button asChild>
                <Link to="/dashboard/group-reservation">
                  <ArrowLeft />
                  Kembali ke Pencarian
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}

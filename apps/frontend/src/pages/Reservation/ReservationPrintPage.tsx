import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api, formatPhoneNumber } from "@rzkyakbr/libs";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { formatDate } from "@rzkyakbr/libs";
import { InfoRow } from "@/lib/InfoRow";
import type { Reservation } from "@rzkyakbr/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ReservationPrintPage() {
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/reservation/${id}`);
        setReservation(res.data.data);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
        toast.error(message);

        navigate("/dashboard/reservation", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (!reservation) return <p>Loading...</p>;

  return (
    <>
      {reservation && (
        <div className="print:w-[76mm] print:mx-auto print:text-xs print:font-mono print:m-0 print:p-0 ">
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
            </CardHeader>

            <CardContent className="border-y py-4">
              <InfoRow
                label="No. Reservasi"
                value={reservation.bookingNumber}
              />
              <InfoRow
                label="Tgl. Pemesanan"
                value={formatDate(reservation.createdAt)}
              />
              <InfoRow
                label="Nama Pemesan"
                value={reservation.ordererNameOrTravelName}
              />
              <InfoRow
                label="No. Telepon"
                value={`${formatPhoneNumber(reservation.phoneNumber)}`}
              />
              <InfoRow label="Alamat" value={reservation.address} />
              <InfoRow
                label="Tgl. Kunjungan"
                value={formatDate(reservation.visitingDate)}
              />
              <InfoRow
                label="Waktu Kunjungan"
                value={reservation.visitingHour.timeRange}
              />
              <InfoRow label="Nama Rombongan" value={reservation.groupName} />
              <InfoRow
                label="Total Pelajar"
                value={`${reservation.studentMemberTotal} pengunjung`}
              />
              <InfoRow
                label="Total Umum"
                value={`${reservation.publicMemberTotal} pengunjung`}
              />
              <InfoRow
                label="Total Asing"
                value={`${reservation.foreignMemberTotal} pengunjung`}
              />
              <InfoRow
                label="Jml. Pengunjung"
                value={`${reservation.groupMemberTotal} pengunjung`}
              />
              <InfoRow
                label="Total Bayar"
                value={`Rp${reservation.paymentAmount.toLocaleString("id-ID")}`}
              />
              <InfoRow
                label="Status Bayar"
                value={
                  reservation.statusPayment === "Paid" ? "Lunas" : "Belum Bayar"
                }
              />
            </CardContent>

            <p className="text-center mt-2">
              # Terima kasih Atas Kunjungan Anda #
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

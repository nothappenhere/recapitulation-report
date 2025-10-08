import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api, formatRupiah } from "@rzkyakbr/libs";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { type CustomReservationFullTypes } from "@rzkyakbr/types";
import { QRCodeSVG } from "qrcode.react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CustomQRPage() {
  const { uniqueCode } = useParams();
  const [data, setData] = useState<CustomReservationFullTypes | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!uniqueCode) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await api.get(`/custom-reservation/${uniqueCode}`);
        setData(res.data.data);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response.data.message}!`
          : "Terjadi kesalahan saat memuat data, silakan coba lagi.";
        toast.error(message);

        // window.location.href = "https://museum.geologi.esdm.go.id/";
        navigate("/visit/custom", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, uniqueCode]);

  if (loading || !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="m-5">
      <Card className="max-w-xl mx-auto shadow-lg rounded-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-lg sm:text-xl font-semibold">
            Pengisian data reservasi Anda telah kami terima.
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Simpan kode QR ini (<span className="italic">screenshot</span> jika
            perlu) dan tunjukkan di loket Penjualan Tiket pada hari
            kedatangan/kunjungan.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center gap-6">
            {/* QR Code */}
            <QRCodeSVG
              value={data.reservationNumber}
              size={220}
              bgColor="#F8B500"
              fgColor="#000000"
              marginSize={2}
              imageSettings={{
                src: "/img/logo-mg.png",
                height: 48,
                width: 48,
                excavate: true,
              }}
            />

            {/* Walk-in number */}
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">Kode Reservasi</p>
              <p className="text-lg font-bold tracking-wide">
                {data.reservationNumber}
              </p>
            </div>

            {/* Ticket breakdown */}
            <div className="w-full space-y-3">
              {[
                {
                  label: "Pemandu (Guide)",
                  count: data.publicMemberTotal,
                  price: data.publicTotalAmount,
                },
                {
                  label: "Khusus (Custom)",
                  count: data.customMemberTotal,
                  price: data.customTotalAmount,
                },
                {
                  label: "Total Pengunjung (Visitors)",
                  count: data.visitorMemberTotal,
                  price: data.totalPaymentAmount,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center px-3 py-2 rounded-md border bg-muted/30"
                >
                  <div>
                    <p className="text-sm font-medium mb-1">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.count} pengunjung
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatRupiah(item.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            Terima kasih atas kunjungan Anda ke Museum Geologi. Yuk isi{" "}
            <span className="font-medium">Survey Kepuasan Pengunjung</span> di
            bawah ini untuk peningkatan kualitas layanan kami.
          </p>
          <Button asChild size="lg">
            <a href="https://museum.geologi.esdm.go.id/" target="_blank">
              Isi Survey Kepuasan
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

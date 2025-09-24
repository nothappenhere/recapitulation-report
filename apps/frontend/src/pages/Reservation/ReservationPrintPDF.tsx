import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

type Reservation = {
  _id: string;
  bookingNumber: string;
  ordererNameOrTravelName: string;
  phoneNumber: string;
  visitingDate: string;
  groupName: string;
  paymentAmount: number;
};

export default function ReservationPrintPDF() {
  const { id } = useParams<{ id: string }>();

  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/reservation/${id}`)
      .then((res) => res.json())
      .then((data) => setReservation(data.data));
  }, [id]);

  const handleGeneratePDF = () => {
    if (!reservation) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [76, 200], // lebar 76mm, tinggi bisa disesuaikan
    });

    doc.setFontSize(10);
    doc.text("Bukti Reservasi", 38, 10, { align: "center" });

    let y = 20;
    const addLine = (label: string, value: string) => {
      doc.text(`${label}: ${value}`, 2, y);
      y += 6;
    };

    addLine("No. Booking", reservation.bookingNumber);
    addLine("Nama", reservation.ordererNameOrTravelName);
    addLine("Telepon", reservation.phoneNumber);
    addLine(
      "Tanggal",
      new Date(reservation.visitingDate).toLocaleDateString("id-ID")
    );
    addLine("Rombongan", reservation.groupName);
    addLine("Total", `Rp${reservation.paymentAmount.toLocaleString("id-ID")}`);

    doc.text("Terima kasih 🙏", 38, y + 10, { align: "center" });

    // Preview + AutoPrint
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  if (!reservation) return <p>Loading...</p>;

  return (
    <button
      onClick={handleGeneratePDF}
      className="px-4 py-2 bg-green-500 text-white rounded"
    >
      Print PDF
    </button>
  );
}

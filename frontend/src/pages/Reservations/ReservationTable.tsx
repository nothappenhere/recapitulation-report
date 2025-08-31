import api from "@/lib/axios";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import type { ReservationFormValues } from "@/schemas/reservationSchema";
import toast from "react-hot-toast";

export default function DemoPage() {
  const [data, setData] = useState<ReservationFormValues[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchReservations() {
      setLoading(true);
      try {
        const res = await api.get("/reservations");
        setData(res.data);
      } catch (error) {
        toast.error("Failed to fetch reservations");
        console.error("Failed to fetch reservations", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReservations();
  }, []);

  return (
    <div className="container mx-auto">
      {loading && <p className="text-center">Loading...</p>}

      <DataTable columns={columns} data={data} />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // sesuaikan import sesuai shadcn/ui

interface Reservation {
  _id: string;
  ordererName: string;
  phoneNumber: string;
  address: string;
  category: string;
  province: string;
  districtOrCity: string;
  subdistrict: string;
  village: string;
  groupName: string;
  groupMemberTotal: number;
  reservationDate: string; // ISO string
  downPayment: number;
  paymentAmount: number;
  reservationNumber: number;
  salesNumber: number;
  visitingHour: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReservationTable() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchReservations() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/reservations");
        const data = await res.json();
        setReservations(data);
      } catch (error) {
        console.error("Failed to fetch reservations", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReservations();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reservation Number</TableHead>
              <TableHead>Orderer Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Reservation Date</TableHead>
              <TableHead>Visiting Hour</TableHead>
              <TableHead>Group Name</TableHead>
              <TableHead>Group Members</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Down Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.reservationNumber}</TableCell>
                <TableCell>{item.ordererName}</TableCell>
                <TableCell>{item.phoneNumber}</TableCell>
                <TableCell>
                  {new Date(item.reservationDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>{item.visitingHour}</TableCell>
                <TableCell>{item.groupName}</TableCell>
                <TableCell>{item.groupMemberTotal}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.downPayment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

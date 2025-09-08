"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";

export default function WeeklyReportTable({ refreshTrigger }) {
  const [reports, setReports] = useState<any[]>([]);
  const [ticketPrices, setTicketPrices] = useState<Record<string, number>>({});

  // Ambil harga tiket
  const fetchTicketPrices = async () => {
    try {
      const res = await api.get("/harga-tiket");
      if (res.data.success) {
        const prices: Record<string, number> = {};
        res.data.data.ticketPrice.forEach((p: any) => {
          prices[p.group] = p.unitPrice;
        });
        setTicketPrices(prices);
      }
    } catch (err) {
      console.error("Error fetching ticket prices:", err);
    }
  };

  // Ambil laporan mingguan
  const fetchReports = async () => {
    try {
      const res = await api.get("/laporan");
      if (res.data.success) {
        setReports(res.data.data.reports);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchTicketPrices();
    fetchReports();
  }, [refreshTrigger]);

  const formatCurrency = (value?: number) =>
    value ? value.toLocaleString("id-ID") : "-";

  // Buat variabel total akumulasi
  const grandTotals = {
    pelajar: { ticket: 0, revenue: 0 },
    umum: { ticket: 0, revenue: 0 },
    asing: { ticket: 0, revenue: 0 },
    khusus: { ticket: 0, revenue: 0 },
    totalRevenue: 0,
    totalVisitor: 0,
  };

  return (
    <Table>
      <TableCaption>Laporan Mingguan</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead colSpan={2} className="text-center">
            Pelajar
          </TableHead>
          <TableHead colSpan={2} className="text-center">
            Umum
          </TableHead>
          <TableHead colSpan={2} className="text-center">
            Asing
          </TableHead>
          <TableHead colSpan={2} className="text-center">
            Khusus
          </TableHead>
          <TableHead>Total Rp.</TableHead>
          <TableHead>Total Visitor</TableHead>
        </TableRow>
        <TableRow>
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead>Jlh Tiket</TableHead>
          <TableHead>Rp.</TableHead>
          <TableHead>Jlh Tiket</TableHead>
          <TableHead>Rp.</TableHead>
          <TableHead>Jlh Tiket</TableHead>
          <TableHead>Rp.</TableHead>
          <TableHead>Jlh Tiket</TableHead>
          <TableHead>Rp.</TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((r, idx) => {
          let totalRevenue = 0;

          const getRow = (category: string) => {
            const ticketCount =
              r.categories.find((c: any) => c.category === category)
                ?.ticketCount || 0;
            const revenue = ticketCount * (ticketPrices[category] || 0);
            totalRevenue += revenue;
            return { ticketCount, revenue };
          };

          const pelajar = getRow("Pelajar");
          const umum = getRow("Umum");
          const asing = getRow("Asing");
          const khusus = getRow("Khusus");

          // Tambah ke total akumulasi
          grandTotals.pelajar.ticket += pelajar.ticketCount;
          grandTotals.pelajar.revenue += pelajar.revenue;
          grandTotals.umum.ticket += umum.ticketCount;
          grandTotals.umum.revenue += umum.revenue;
          grandTotals.asing.ticket += asing.ticketCount;
          grandTotals.asing.revenue += asing.revenue;
          grandTotals.khusus.ticket += khusus.ticketCount;
          grandTotals.khusus.revenue += khusus.revenue;
          grandTotals.totalRevenue += totalRevenue;
          grandTotals.totalVisitor += r.totalVisitor;

          return (
            <TableRow key={r._id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                {new Date(r.visitDate).toLocaleDateString("id-ID")}
              </TableCell>
              {/* Pelajar */}
              <TableCell>{pelajar.ticketCount}</TableCell>
              <TableCell>{formatCurrency(pelajar.revenue)}</TableCell>
              {/* Umum */}
              <TableCell>{umum.ticketCount}</TableCell>
              <TableCell>{formatCurrency(umum.revenue)}</TableCell>
              {/* Asing */}
              <TableCell>{asing.ticketCount}</TableCell>
              <TableCell>{formatCurrency(asing.revenue)}</TableCell>
              {/* Khusus */}
              <TableCell>{khusus.ticketCount}</TableCell>
              <TableCell>{formatCurrency(khusus.revenue)}</TableCell>
              {/* Total */}
              <TableCell>{formatCurrency(totalRevenue)}</TableCell>
              <TableCell>{r.totalVisitor}</TableCell>
            </TableRow>
          );
        })}

        {/* Baris Total */}
        <TableRow className="font-bold text-blue-600">
          <TableCell colSpan={2} className="text-center">
            JUMLAH
          </TableCell>
          <TableCell>{grandTotals.pelajar.ticket}</TableCell>
          <TableCell>{formatCurrency(grandTotals.pelajar.revenue)}</TableCell>
          <TableCell>{grandTotals.umum.ticket}</TableCell>
          <TableCell>{formatCurrency(grandTotals.umum.revenue)}</TableCell>
          <TableCell>{grandTotals.asing.ticket}</TableCell>
          <TableCell>{formatCurrency(grandTotals.asing.revenue)}</TableCell>
          <TableCell>{grandTotals.khusus.ticket}</TableCell>
          <TableCell>{formatCurrency(grandTotals.khusus.revenue)}</TableCell>
          <TableCell>{formatCurrency(grandTotals.totalRevenue)}</TableCell>
          <TableCell>{grandTotals.totalVisitor}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

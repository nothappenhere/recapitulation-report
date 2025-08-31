import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// contoh data laporan mingguan
const laporanMingguan = [
  {
    tanggal: "31 Juli '25",
    golA: { tiket: 369, rupiah: "1.107.000" },
    golB: { tiket: 223, rupiah: "1.115.000" },
    golC: { tiket: 19, rupiah: "475.000" },
    golD: { tiket: "-", rupiah: "-" },
    jumlah: "2.697.000",
    pengunjung: 611,
  },
  {
    tanggal: "1 Agustus '25",
    golA: { tiket: 400, rupiah: "1.200.000" },
    golB: { tiket: 180, rupiah: "900.000" },
    golC: { tiket: 10, rupiah: "250.000" },
    golD: { tiket: "-", rupiah: "-" },
    jumlah: "2.350.000",
    pengunjung: 590,
  },
  // bisa tambah data lain di sini
];

function WeeklyReportTable() {
  return (
    <Table>
      <TableCaption>Laporan Mingguan Agustus 2025</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead rowSpan={2} className="text-center border">
            No
          </TableHead>
          <TableHead rowSpan={2} className="text-center border">
            Tanggal Kunjungan
          </TableHead>

          {/* Golongan A */}
          <TableHead colSpan={2} className="text-center border">
            Golongan A (Pelajar)
          </TableHead>

          {/* Golongan B */}
          <TableHead colSpan={2} className="text-center border">
            Golongan B (Umum)
          </TableHead>

          {/* Golongan C */}
          <TableHead colSpan={2} className="text-center border">
            Golongan C (Asing)
          </TableHead>

          {/* Golongan D */}
          <TableHead colSpan={2} className="text-center border">
            Golongan D (Khusus)
          </TableHead>

          <TableHead rowSpan={2} className="text-center border">
            Jumlah (Rp.)
          </TableHead>
          <TableHead rowSpan={2} className="text-center border">
            Jlh Pengunjung
          </TableHead>
        </TableRow>

        <TableRow>
          <TableHead className="text-center border">Jlh Tiket</TableHead>
          <TableHead className="text-center border">Rp.</TableHead>
          <TableHead className="text-center border">Jlh Tiket</TableHead>
          <TableHead className="text-center border">Rp.</TableHead>
          <TableHead className="text-center border">Jlh Tiket</TableHead>
          <TableHead className="text-center border">Rp.</TableHead>
          <TableHead className="text-center border">Jlh Tiket</TableHead>
          <TableHead className="text-center border">Rp.</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {laporanMingguan.map((row, index) => (
          <TableRow key={index}>
            <TableCell className="border text-center">{index + 1}</TableCell>
            <TableCell className="border text-center">{row.tanggal}</TableCell>
            <TableCell className="border text-center">
              {row.golA.tiket}
            </TableCell>
            <TableCell className="border text-center">
              {row.golA.rupiah}
            </TableCell>
            <TableCell className="border text-center">
              {row.golB.tiket}
            </TableCell>
            <TableCell className="border text-center">
              {row.golB.rupiah}
            </TableCell>
            <TableCell className="border text-center">
              {row.golC.tiket}
            </TableCell>
            <TableCell className="border text-center">
              {row.golC.rupiah}
            </TableCell>
            <TableCell className="border text-center">
              {row.golD.tiket}
            </TableCell>
            <TableCell className="border text-center">
              {row.golD.rupiah}
            </TableCell>
            <TableCell className="border text-center">{row.jumlah}</TableCell>
            <TableCell className="border text-center">
              {row.pengunjung}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default WeeklyReportTable;

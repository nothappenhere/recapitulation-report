import { z } from "zod";

export const DailyRecapSchema = z.object({
  recapDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
    message: "Tanggal rekap tidak boleh kosong/invalid!",
  }),
  description: z.string().optional().default("-"),

  studentMemberTotal: z.coerce
    .number()
    .nonnegative("Jumlah pelajar tidak boleh negative!"),
  publicMemberTotal: z.coerce
    .number()
    .nonnegative("Jumlah umum tidak boleh negative!"),
  foreignMemberTotal: z.coerce
    .number()
    .nonnegative("Jumlah asing tidak boleh negative!"),
  visitorMemberTotal: z.coerce
    .number()
    .min(1, "Jumlah total seluruh pengunjung minimal 1 orang!")
    .nonnegative("Jumlah total seluruh pengunjung tidak boleh negative!"),

  studentTotalAmount: z.coerce
    .number()
    .nonnegative("Jumlah total pembayaran pelajar tidak boleh negative!"),
  publicTotalAmount: z.coerce
    .number()
    .nonnegative("Jumlah total pembayaran umum tidak boleh negative!"),
  foreignTotalAmount: z.coerce
    .number()
    .nonnegative("Jumlah total pembayaran asing tidak boleh negative!"),
  totalPaymentAmount: z.coerce
    .number()
    .nonnegative(
      "Jumlah total pembayaran seluruh pengunjung tidak boleh negative!"
    ),

  initialStudentSerialNumber: z.coerce
    .number()
    .nonnegative("Nomor seri awal pelajar tidak boleh negative!")
    .default(0),
  finalStudentSerialNumber: z.coerce
    .number()
    .nonnegative("Nomor seri akhir pelajar tidak boleh negative!")
    .default(0),
  initialPublicSerialNumber: z.coerce
    .number()
    .nonnegative("Nomor seri awal umum tidak boleh negative!")
    .default(0),
  finalPublicSerialNumber: z.coerce
    .number()
    .nonnegative("Nomor seri akhir umum tidak boleh negative!")
    .default(0),
  initialForeignSerialNumber: z.coerce
    .number()
    .nonnegative("Nomor seri awal asing tidak boleh negative!")
    .default(0),
  finalForeignSerialNumber: z.coerce
    .number()
    .nonnegative("Nomor seri akhir asing tidak boleh negative!")
    .default(0),
});

export type TDailyRecap = z.infer<typeof DailyRecapSchema>;

export const defaultDailyRecapFormValues: TDailyRecap = {
  recapDate: new Date(),
  description: "",

  studentMemberTotal: 0,
  publicMemberTotal: 0,
  foreignMemberTotal: 0,
  visitorMemberTotal: 0,

  studentTotalAmount: 0,
  publicTotalAmount: 0,
  foreignTotalAmount: 0,
  totalPaymentAmount: 0,

  initialStudentSerialNumber: 0,
  finalStudentSerialNumber: 0,
  initialPublicSerialNumber: 0,
  finalPublicSerialNumber: 0,
  initialForeignSerialNumber: 0,
  finalForeignSerialNumber: 0,
};

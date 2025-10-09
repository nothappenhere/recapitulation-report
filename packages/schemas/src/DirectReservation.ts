import { z } from "zod";

export const DirectReservation = z.object({
  visitingDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
    message: "Tanggal kunjungan tidak boleh kosong/invalid!",
  }),
  ordererName: z.string().nonempty("Nama pemesan tidak boleh kosong!"),
  phoneNumber: z.string().nonempty("Nomor telepon tidak boleh kosong!"),

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

  address: z.string().nonempty("Alamat tidak boleh kosong!").default("-"),
  province: z.string().optional().default("-"),
  regencyOrCity: z.string().optional().default("-"),
  district: z.string().optional().default("-"),
  village: z.string().optional().default("-"),
  country: z.string().optional().default("Indonesia"),

  paymentMethod: z
    .enum(["Tunai", "QRIS", "Lainnya"], "Metode pembayaran tidak boleh kosong!")
    .optional()
    .default("Lainnya"),
  downPayment: z.coerce
    .number()
    .nonnegative("Jumlah uang pembayaran tidak boleh negative!")
    .optional()
    .default(0),
  changeAmount: z.coerce
    .number()
    .nonnegative("Jumlah uang kembalian tidak boleh negative!")
    .optional()
    .default(0),
  statusPayment: z
    .enum(["Lunas", "Belum Bayar"], "Status pembayaran tidak boleh kosong!")
    .optional()
    .default("Belum Bayar"),
});

export type TDirectReservation = z.infer<typeof DirectReservation>;
export const defaultDirectReservationFormValues: TDirectReservation = {
  visitingDate: new Date(),
  ordererName: "",
  phoneNumber: "",

  studentMemberTotal: 0,
  publicMemberTotal: 0,
  foreignMemberTotal: 0,
  visitorMemberTotal: 0,

  studentTotalAmount: 0,
  publicTotalAmount: 0,
  foreignTotalAmount: 0,
  totalPaymentAmount: 0,

  address: "",
  province: "",
  regencyOrCity: "",
  district: "",
  village: "",
  country: "Indonesia",

  paymentMethod: "Lainnya",
  downPayment: 0,
  changeAmount: 0,
  statusPayment: "Belum Bayar",
};

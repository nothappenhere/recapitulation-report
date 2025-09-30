import { z } from "zod";

export const WalkInSchema = z.object({
  visitingDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
    message: "Tanggal kunjungan tidak boleh kosong!",
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
    .min(1, "Jumlah total seluruh pengunjung minimal 1 orang!"),

  address: z.string().nonempty("Alamat tidak boleh kosong!").default("-"),
  province: z.string().optional().default("-"),
  regencyOrCity: z.string().optional().default("-"),
  district: z.string().optional().default("-"),
  village: z.string().optional().default("-"),
  country: z.string().optional().default("Indonesia"),

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
    .nonnegative("Jumlah total pembayaran tidak boleh negative!"),

  paymentMethod: z
    .enum(["Tunai", "QRIS", "Lainnya"], "Metode pembayaran tidak boleh kosong!")
    .optional()
    .default("Lainnya"),
  downPayment: z.coerce.number().optional().default(0),
  changeAmount: z.coerce.number().optional().default(0),
  statusPayment: z
    .enum(["Lunas", "Belum Bayar"], "Status pembayaran tidak boleh kosong!")
    .optional()
    .default("Belum Bayar"),

  // initialStudentSerialNumber: z.coerce
  //   .number()
  //   .nonnegative("Nomor awal pelajar tidak boleh negative!")
  //   .default(0),
  // finalStudentSerialNumber: z.coerce
  //   .number()
  //   .nonnegative("Nomor akhir pelajar tidak boleh negative!")
  //   .default(0),
  // initialPublicSerialNumber: z.coerce
  //   .number()
  //   .nonnegative("Nomor awal umum tidak boleh negative!")
  //   .default(0),
  // finalPublicSerialNumber: z.coerce
  //   .number()
  //   .nonnegative("Nomor akhir umum tidak boleh negative!")
  //   .default(0),
  // initialForeignSerialNumber: z.coerce
  //   .number()
  //   .nonnegative("Nomor awal asing tidak boleh negative!")
  //   .default(0),
  // finalForeignSerialNumber: z.coerce
  //   .number()
  //   .nonnegative("Nomor akhir asing tidak boleh negative!")
  //   .default(0),
});

export type TWalkIn = z.infer<typeof WalkInSchema>;

export const defaultWalkInFormValues: TWalkIn = {
  visitingDate: new Date(),
  ordererName: "",
  phoneNumber: "",

  studentMemberTotal: 0,
  publicMemberTotal: 0,
  foreignMemberTotal: 0,
  visitorMemberTotal: 0,

  address: "",
  province: "",
  regencyOrCity: "",
  district: "",
  village: "",
  country: "Indonesia",

  studentTotalAmount: 0,
  publicTotalAmount: 0,
  foreignTotalAmount: 0,
  totalPaymentAmount: 0,

  paymentMethod: "Lainnya",
  downPayment: 0,
  changeAmount: 0,
  statusPayment: "Belum Bayar",

  // initialStudentSerialNumber: 0,
  // finalStudentSerialNumber: 0,
  // initialPublicSerialNumber: 0,
  // finalPublicSerialNumber: 0,
  // initialForeignSerialNumber: 0,
  // finalForeignSerialNumber: 0,
};

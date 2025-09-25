import { z } from "zod";

export const ReservationSchema = z.object({
  visitingDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
    message: "Tanggal kunjungan tidak boleh kosong!",
  }),
  visitingHour: z.string().nonempty("Waktu Kunjungan tidak boleh kosong!"),
  reservationMechanism: z
    .enum(
      ["Whatsapp", "Google Form", "Datang Langsung", "Lainnya"],
      "Mekanisme reservasi tidak boleh kosong!"
    )
    .optional()
    .default("Lainnya"),
  description: z.string().optional().default("-"),

  ordererName: z.string().nonempty("Nama pemesan tidak boleh kosong!"),
  phoneNumber: z.string().nonempty("Nomor telepon tidak boleh kosong!"),
  groupName: z.string().nonempty("Nama Rombongan tidak boleh kosong!"),

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

  actualMemberTotal: z.coerce.number().optional().default(0),
  reservationStatus: z
    .enum(
      ["Hadir", "Reschedule", "Batal Hadir", "Lainnya"],
      "Status reservasi tidak boleh kosong!"
    )
    .optional()
    .default("Lainnya"),

  address: z.string().nonempty("Alamat tidak boleh kosong!"),
  province: z.string().nonempty("Provinsi tidak boleh kosong!"),
  regencyOrCity: z.string().nonempty("Kabupaten/Kota tidak boleh kosong!"),
  district: z.string().nonempty("Kecamatan tidak boleh kosong!"),
  village: z.string().nonempty("Kelurahan/Desa tidak boleh kosong!"),
  country: z
    .string()
    .nonempty("Negara asal tidak boleh kosong!")
    .default("Indonesia"),

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
    .enum(["Tunai", "QRIS", "-"], "Metode pembayaran tidak boleh kosong!")
    .optional()
    .default("-"),
  downPayment: z.coerce.number().optional().default(0),
  changeAmount: z.coerce.number().optional().default(0),
  statusPayment: z
    .enum(["Lunas", "Belum Bayar"], "Status pembayaran tidak boleh kosong!")
    .optional()
    .default("Belum Bayar"),
});

export type TReservation = z.infer<typeof ReservationSchema>;

export const defaultReservationFormValues: TReservation = {
  visitingDate: new Date(),
  visitingHour: "",
  reservationMechanism: "Lainnya",
  description: "",

  ordererName: "",
  phoneNumber: "",
  groupName: "",

  studentMemberTotal: 0,
  publicMemberTotal: 0,
  foreignMemberTotal: 0,
  visitorMemberTotal: 0,

  actualMemberTotal: 0,
  reservationStatus: "Lainnya",

  address: "",
  province: "",
  regencyOrCity: "",
  district: "",
  village: "",
  country: "",

  studentTotalAmount: 0,
  publicTotalAmount: 0,
  foreignTotalAmount: 0,
  totalPaymentAmount: 0,

  paymentMethod: "-",
  downPayment: 0,
  changeAmount: 0,
  statusPayment: "Belum Bayar",
};

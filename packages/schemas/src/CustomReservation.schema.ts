import { z } from "zod";

export const CustomReservationSchema = z.object({
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

  guideMemberTotal: z.coerce
    .number()
    .nonnegative("Jumlah pemandu tidak boleh negative!"),
  customMemberTotal: z.coerce
    .number()
    .min(1, "Jumlah total seluruh anggota minimal 1 orang!"),
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
  province: z.string().optional().default("-"),
  regencyOrCity: z.string().optional().default("-"),
  district: z.string().optional().default("-"),
  village: z.string().optional().default("-"),
  country: z.string().optional().default("Indonesia"),

  guideTotalAmount: z.coerce
    .number()
    .nonnegative("Jumlah total pembayaran pemandu tidak boleh negative!"),
  customTotalAmount: z.coerce
    .number()
    .nonnegative("Jumlah total pembayaran khusus tidak boleh negative!"),
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
});

export type TCustomReservation = z.infer<typeof CustomReservationSchema>;

export const defaultCustomReservationFormValues: TCustomReservation = {
  visitingDate: new Date(),
  visitingHour: "",
  reservationMechanism: "Lainnya",
  description: "",

  ordererName: "",
  phoneNumber: "",
  groupName: "",

  guideMemberTotal: 0,
  customMemberTotal: 0,
  visitorMemberTotal: 0,

  actualMemberTotal: 0,
  reservationStatus: "Lainnya",

  address: "",
  province: "",
  regencyOrCity: "",
  district: "",
  village: "",
  country: "Indonesia",

  guideTotalAmount: 0,
  customTotalAmount: 0,
  totalPaymentAmount: 0,

  paymentMethod: "Lainnya",
  downPayment: 0,
  changeAmount: 0,
  statusPayment: "Belum Bayar",
};

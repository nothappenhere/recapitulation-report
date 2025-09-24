import { z } from "zod";

export const ReservationSchema = z.object({
  visitingDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
    message: "Tanggal kunjungan tidak boleh kosong / invalid!",
  }),
  visitingHour: z.string().nonempty("Waktu Kunjungan tidak boleh kosong!"),
  reservationMechanism: z
    .string()
    .nonempty("Mekanisme reservasi tidak boleh kosong!"),
  description: z.string().optional().default("-"),

  ordererNameOrTravelName: z
    .string()
    .nonempty("Nama pemesan / travel tidak boleh kosong!"),
  phoneNumber: z.string().nonempty("Nomor telepon tidak boleh kosong!"),
  groupName: z.string().nonempty("Nama Rombongan tidak boleh kosong!"),

  studentMemberTotal: z.coerce
    .number()
    .nonnegative("Total anggota pelajar tidak boleh kosong / negative!"),
  publicMemberTotal: z.coerce
    .number()
    .nonnegative("Total anggota umum tidak boleh kosong / negative!"),
  foreignMemberTotal: z.coerce
    .number()
    .nonnegative("Total anggota asing tidak boleh kosong / negative!"),
  groupMemberTotal: z.coerce.number().optional(),

  actualMemberTotal: z.coerce.number().optional(),
  reservationStatus: z.string().optional().default("-"),

  address: z.string().nonempty("Alamat tidak boleh kosong!"),
  province: z.string().optional().default("-"),
  regencyOrCity: z.string().optional().default("-"),
  district: z.string().optional().default("-"),
  village: z.string().optional().default("-"),
  country: z.string().optional().default("-"),

  paymentAmount: z.coerce.number().optional(),
  paymentMethod: z.string().nonempty("Metode pembayaran tidak boleh kosong!"),
  downPayment: z.coerce
    .number()
    .nonnegative("Uang muka tidak boleh kosong / negative!")
    .default(0),
  changeAmount: z.coerce.number().optional(),
  statusPayment: z
    .enum(["Paid", "Unpaid"], "Status pembayaran tidak boleh kosong!")
    .optional(),
});

export type TReservation = z.infer<typeof ReservationSchema>;

export const defaultReservationFormValues: TReservation = {
  visitingDate: new Date(),
  visitingHour: "",
  reservationMechanism: "",
  description: "",
  ordererNameOrTravelName: "",
  phoneNumber: "",
  groupName: "",
  studentMemberTotal: 0,
  publicMemberTotal: 0,
  foreignMemberTotal: 0,
  groupMemberTotal: 0,
  actualMemberTotal: 0,
  reservationStatus: "",
  address: "",
  province: "",
  regencyOrCity: "",
  district: "",
  village: "",
  country: "",
  paymentAmount: 0,
  paymentMethod: "",
  downPayment: 0,
  changeAmount: 0,
  statusPayment: "Unpaid",
};

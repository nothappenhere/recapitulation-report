import { z } from "zod";

export const WalkInSchema = z.object({
  visitingDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
    message: "Tanggal kunjungan tidak boleh kosong / invalid!",
  }),
  visitingHour: z.string().nonempty("Waktu Kunjungan tidak boleh kosong!"),
  description: z.string().optional(),

  ordererNameOrTravelName: z
    .string()
    .nonempty("Nama pemesan / travel tidak boleh kosong!"),
  phoneNumber: z.string().nonempty("Nomor telepon tidak boleh kosong!"),

  studentMemberTotal: z.coerce
    .number()
    .nonnegative("Total anggota pelajar tidak boleh kosong / negative!"),
  publicMemberTotal: z.coerce
    .number()
    .nonnegative("Total anggota umum tidak boleh kosong / negative!"),
  foreignMemberTotal: z.coerce
    .number()
    .nonnegative("Total anggota asing tidak boleh kosong / negative!"),
  customMemberTotal: z.coerce
    .number()
    .nonnegative("Total anggota khusus tidak boleh kosong / negative!"),
  groupMemberTotal: z.coerce.number().optional(),

  address: z.string().nonempty("Alamat tidak boleh kosong!"),
  province: z.string().optional(),
  regencyOrCity: z.string().optional(),
  district: z.string().optional(),
  village: z.string().optional(),
  country: z.string().optional(),

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

  initialStudentSerialNumber: z.coerce
    .number()
    .nonnegative("Nomor awal pelajar tidak boleh negative!")
    .default(0),
  finalStudentSerialNumber: z.coerce
    .number()
    .nonnegative("Nomor akhir pelajar tidak boleh negative!")
    .default(0),
  initialPublicSerialNumber: z.coerce
    .number()
    .nonnegative("Nomor awal umum tidak boleh negative!")
    .default(0),
  finalPublicSerialNumber: z.coerce
    .number()
    .nonnegative("Nomor akhir umum tidak boleh negative!")
    .default(0),
  initialForeignSerialNumber: z.coerce
    .number()
    .nonnegative("Nomor awal asing tidak boleh negative!")
    .default(0),
  finalForeignSerialNumber: z.coerce
    .number()
    .nonnegative("Nomor akhir asing tidak boleh negative!")
    .default(0),
  initialCustomSerialNumber: z.coerce
    .number()
    .nonnegative("Nomor awal khusus tidak boleh negative!")
    .default(0),
  finalCustomSerialNumber: z.coerce
    .number()
    .nonnegative("Nomor akhir khusus tidak boleh negative!")
    .default(0),
});

export type TWalkIn = z.infer<typeof WalkInSchema>;

export const defaultWalkInFormValues: TWalkIn = {
  visitingDate: new Date(),
  visitingHour: "",
  description: "",
  ordererNameOrTravelName: "",
  phoneNumber: "",
  studentMemberTotal: 0,
  publicMemberTotal: 0,
  foreignMemberTotal: 0,
  customMemberTotal: 0,
  groupMemberTotal: 0,
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
  initialStudentSerialNumber: 0,
  finalStudentSerialNumber: 0,
  initialPublicSerialNumber: 0,
  finalPublicSerialNumber: 0,
  initialForeignSerialNumber: 0,
  finalForeignSerialNumber: 0,
  initialCustomSerialNumber: 0,
  finalCustomSerialNumber: 0,
};

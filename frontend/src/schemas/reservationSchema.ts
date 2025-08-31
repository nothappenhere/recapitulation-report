import { z } from "zod";

export const reservationSchema = z.object({
  reservationNumber: z.coerce.number().nonnegative().default(0),
  salesNumber: z.coerce.number().nonnegative().default(0),
  reservationDate: z.date({
    error: "Reservation date cannot be empty!",
  }),
  visitingHour: z.string().nonempty("Visiting hour cannot be empty!"),
  category: z.string().nonempty("Category cannot be empty!"),
  groupName: z.string().nonempty("Group name cannot be empty!"),
  groupMemberTotal: z.coerce.number().int().nonnegative().default(0),
  ordererName: z.string().nonempty("Orderer name cannot be empty!"),
  phoneNumber: z
  .string()
  .nonempty("Phone number cannot be empty!")
  .transform((val) => {
    // Hapus semua karakter selain angka
    const digitsOnly = val.replace(/\D/g, "");

    // Jika diawali "0", ganti dengan "+62"
    if (digitsOnly.startsWith("0")) return `+62${digitsOnly.slice(1)}`;

    // Jika diawali "62", ubah ke "+62"
    if (digitsOnly.startsWith("62")) return `+${digitsOnly}`;

    // Jika sudah +62, biarkan
    if (digitsOnly.startsWith("+62")) return digitsOnly;

    return `+62${digitsOnly}`; // fallback
  })
  .superRefine((val, ctx) => {
    if (!/^\+628[1-9][0-9]{6,9}$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid Indonesian phone number!",
      });
    }
  }),
  address: z.string().nonempty("Address cannot be empty!"),
  province: z.string().nonempty("Province cannot be empty!"),
  districtOrCity: z.string().nonempty("District/City cannot be empty!"),
  subdistrict: z.string().nonempty("Subdistrict cannot be empty!"),
  village: z.string().nonempty("Village cannot be empty!"),
  paymentAmount: z.coerce.number().nonnegative().default(0),
  downPayment: z.coerce.number().nonnegative().default(0),
});

export type ReservationFormValues = z.infer<typeof reservationSchema>;

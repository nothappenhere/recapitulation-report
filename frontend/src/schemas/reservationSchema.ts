import { z } from "zod";

export const reservationSchema = z.object({
  // Ini diisi otomatis di backend, tidak usah divalidasi dari form
  reservationNumber: z.string().optional(),
  salesNumber: z.string().optional(),

  category: z.enum(["Pelajar", "Umum", "Asing", "Khusus"], {
    required_error: "Category cannot be empty!",
  }),

  reservationDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
    message: "Reservation date cannot be empty or invalid!",
  }),
  visitingHour: z.string().nonempty("Visiting hour cannot be empty!"),

  ordererName: z.string().nonempty("Orderer name cannot be empty!"),
  phoneNumber: z
    .string()
    .nonempty("Phone number cannot be empty!")
    .transform((val) => {
      const digitsOnly = val.replace(/\D/g, "");
      if (digitsOnly.startsWith("0")) return `+62${digitsOnly.slice(1)}`;
      if (digitsOnly.startsWith("62")) return `+${digitsOnly}`;
      if (digitsOnly.startsWith("+62")) return digitsOnly;
      return `+62${digitsOnly}`;
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
  groupName: z.string().nonempty("Group name cannot be empty!"),
  groupMemberTotal: z.coerce
    .number()
    .int({ message: "Group member total must be an integer!" })
    .nonnegative({ message: "Group member total cannot be negative!" }),

  province: z.string().nonempty("Province cannot be empty!"),
  regencyOrCity: z.string().nonempty("Regency/City cannot be empty!"),
  district: z.string().nonempty("District cannot be empty!"),
  village: z.string().nonempty("Village cannot be empty!"),

  paymentAmount: z.coerce
    .number()
    .nonnegative({ message: "Payment amount cannot be negative!" }),
  downPayment: z.coerce
    .number()
    .nonnegative({ message: "Down payment cannot be negative!" }),
  changeAmount: z.coerce
    .number()
    .nonnegative({ message: "Change amount cannot be negative!" }),
  statusPayment: z.enum(["Paid", "DP", "Unpaid"], {
    required_error: "Status payment cannot be empty!",
  }),
});

export type ReservationFormValues = z.infer<typeof reservationSchema>;

export const reservationFormSchema = reservationSchema.omit({
  reservationNumber: true,
  salesNumber: true,
});

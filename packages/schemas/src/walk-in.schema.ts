import { z } from "zod";

export const WalkInSchema = z.object({
  visitingDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
    message: "Visiting date cannot be empty or invalid!",
  }),
  visitingHour: z.string().nonempty("Visiting hour cannot be empty!"),
  description: z.string().optional(),

  ordererNameOrTravelName: z
    .string()
    .nonempty("Orderer or Travel name cannot be empty!"),
  phoneNumber: z.string().nonempty("Phone number cannot be empty!"),

  studentMemberTotal: z.coerce
    .number()
    .nonnegative("Student member total cannot be negative!"),
  publicMemberTotal: z.coerce
    .number()
    .nonnegative("Public member total cannot be negative!"),
  foreignMemberTotal: z.coerce
    .number()
    .nonnegative("Foreign member total cannot be negative!"),
  customMemberTotal: z.coerce
    .number()
    .nonnegative("Custom member total cannot be negative!"),
  groupMemberTotal: z.coerce
    .number()
    .nonnegative("Group member total cannot be negative!"),

  address: z.string().nonempty("Address cannot be empty!"),
  province: z.string().optional(),
  regencyOrCity: z.string().optional(),
  district: z.string().optional(),
  village: z.string().optional(),
  country: z.string().optional(),

  paymentMethod: z.string().nonempty("Payment method cannot be empty!"),
  paymentAmount: z.coerce
    .number()
    .nonnegative({ message: "Payment amount cannot be negative!" }),
  downPayment: z.coerce
    .number()
    .nonnegative({ message: "Down payment cannot be negative!" }),
  changeAmount: z.coerce
    .number()
    .nonnegative({ message: "Change amount cannot be negative!" }),
  statusPayment: z.enum(["Paid", "Unpaid"], "Status payment cannot be empty!"),

  initialStudentSerialNumber: z.coerce
    .number()
    .nonnegative("Initial Student SN cannot be negative!"),
  finalStudentSerialNumber: z.coerce
    .number()
    .nonnegative("Final Student SN cannot be negative!"),
  initialPublicSerialNumber: z.coerce
    .number()
    .nonnegative("Initial Public SN cannot be negative!"),
  finalPublicSerialNumber: z.coerce
    .number()
    .nonnegative("Final Public SN cannot be negative!"),
  initialForeignSerialNumber: z.coerce
    .number()
    .nonnegative("Initial Foreign SN cannot be negative!"),
  finalForeignSerialNumber: z.coerce
    .number()
    .nonnegative("Final Foreign SN cannot be negative!"),
  initialCustomSerialNumber: z.coerce
    .number()
    .nonnegative("Initial Custom SN cannot be negative!"),
  finalCustomSerialNumber: z.coerce
    .number()
    .nonnegative("Final Custom SN cannot be negative!"),
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
  paymentMethod: "",
  paymentAmount: 0,
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

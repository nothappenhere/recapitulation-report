import { z } from "zod";

export const BookingReservationSchema = z.object({
  visitingDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
    message: "Visiting date cannot be empty or invalid!",
  }),
  visitingHour: z.string().nonempty("Visiting hour cannot be empty!"),
  reservationMechanism: z
    .string()
    .nonempty("Reservation mechanism cannot be empty!"),
  description: z.string().optional(),

  ordererNameOrTravelName: z
    .string()
    .nonempty("Orderer or Travel name cannot be empty!"),
  phoneNumber: z.string().nonempty("Phone number cannot be empty!"),
  groupName: z.string().nonempty("Group name cannot be empty!"),

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
});

export type TBookingReservation = z.infer<typeof BookingReservationSchema>;

export const defaultBookingReservationFormValues: TBookingReservation = {
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
};

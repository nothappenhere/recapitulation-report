import { z } from "zod";

export const TicketPriceSchema = z.object({
  category: z
    .enum(["Pelajar", "Umum", "Asing", "Khusus"], {
      message: "Invalid category!",
    })
    .optional(),
  unitPrice: z.coerce
    .number()
    .nonnegative({ message: "Unit price cannot be negative!" }),
});
export type TTicketPrice = z.infer<typeof TicketPriceSchema>;

export const defaultTicketPriceFormValues: TTicketPrice = {
  category: undefined,
  unitPrice: 0,
};

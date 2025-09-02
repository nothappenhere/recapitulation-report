import { z } from "zod";

export const ticketPriceSchema = z.object({
  category: z.enum(["Pelajar", "Umum", "Asing", "Khusus"], {
    required_error: "Category cannot be empty!",
  }),
  unitPrice: z.coerce
    .number()
    .nonnegative({ message: "Change amount cannot be negative!" }),
});

export type TicketPriceFormValues = z.infer<typeof ticketPriceSchema>;

export const TicketPriceFormSchema = ticketPriceSchema.omit({
  category: true,
});

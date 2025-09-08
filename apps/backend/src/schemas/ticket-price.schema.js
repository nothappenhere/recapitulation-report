import { z } from "zod";

export const ticketPriceSchema = z.object({
  category: z.enum(["Pelajar", "Umum", "Asing", "Khusus"], "Invalid role!"),
  unitPrice: z.coerce.number().nonnegative("Unit price cannot be negative!"),
});

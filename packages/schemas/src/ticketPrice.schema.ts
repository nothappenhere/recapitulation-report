import { z } from "zod";

export const TicketPriceSchema = z.object({
  category: z.enum(
    ["Pelajar", "Umum", "Asing", "Khusus", ""],
    "Kategori tidak boleh kosong!"
  ),
  unitPrice: z.coerce
    .number()
    .nonnegative("Harga satuan tidak boleh kosong / negative!"),
});

export type TTicketPrice = z.infer<typeof TicketPriceSchema>;

export const defaultTicketPriceFormValues: TTicketPrice = {
  category: "",
  unitPrice: 0,
};

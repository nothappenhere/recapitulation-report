import mongoose from "mongoose";

const ticketPriceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Pelajar", "Umum", "Asing", "Khusus"],
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const TicketPrice = mongoose.model("TicketPrice", ticketPriceSchema);

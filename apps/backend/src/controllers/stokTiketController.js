import { KodeTiket } from "../models/KodeTiket.js";
import { StokTiket } from "../models/StokTiket.js";
import { sendResponse } from "../utils/response.js";

export const getAllStockTicket = async (req, res) => {
  try {
    const stockTicket = await StokTiket.find();
    return sendResponse(res, 200, true, `Successful get all Stock Ticket`, {
      stockTicket,
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

export const createStockTicket = async (req, res) => {
  const { group, totalTicket } = req.body;

  try {
    if (!group || !totalTicket) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    // Simpan stok tiket
    const stockTicket = new StokTiket({ group, totalTicket });
    await stockTicket.save();

    // Tentukan prefix golongan
    const prefixMap = {
      Pelajar: "P",
      Umum: "U",
      Asing: "A",
      Khusus: "K",
    };
    const prefix = prefixMap[group];

    // Generate kode tiket
    const kodeTiketDocs = [];
    for (let i = 1; i <= totalTicket; i++) {
      kodeTiketDocs.push({
        kode: `${i}${prefix}`,
        group,
        stokTiket: stockTicket._id,
        status: "available",
      });
    }
    await KodeTiket.insertMany(kodeTiketDocs);

    return sendResponse(
      res,
      201,
      true,
      `Successfully created Stock Ticket for golongan ${group}`,
      {
        stockTicket,
        totalGenerated: totalTicket,
      }
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

export const updateStockTicket = async (req, res) => {
  const { id } = req.params;
  const { totalTicket } = req.body;

  try {
    const stockTicket = await StokTiket.findById(id);
    if (!stockTicket) {
      return sendResponse(res, 404, false, "Stock Ticket not found");
    }

    if (totalTicket) {
      // Hapus semua kode tiket lama
      await KodeTiket.deleteMany({ stokTiket: stockTicket._id });

      // Generate ulang kode tiket baru
      const prefixMap = {
        Pelajar: "P",
        Umum: "U",
        Asing: "A",
        Khusus: "K",
      };
      const prefix = prefixMap[stockTicket.group];

      const kodeTiketDocs = [];
      for (let i = 1; i <= totalTicket; i++) {
        kodeTiketDocs.push({
          kode: `${i}${prefix}`,
          group: stockTicket.group,
          stokTiket: stockTicket._id,
          status: "available",
        });
      }
      await KodeTiket.insertMany(kodeTiketDocs);

      stockTicket.totalTicket = totalTicket;
    }

    await stockTicket.save();

    return sendResponse(
      res,
      200,
      true,
      `Successfully updated Stock Ticket for golongan ${stockTicket.group}`,
      { stockTicket }
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

export const deleteStockTicket = async (req, res) => {
  const { id } = req.params;

  try {
    // Cari stok berdasarkan ID
    const stockTicket = await StokTiket.findById(id);
    if (!stockTicket) {
      return sendResponse(res, 404, false, "Stock Ticket not found");
    }

    // Hapus semua tiket terkait
    const deletedTickets = await KodeTiket.deleteMany({
      stokTiket: stockTicket._id,
    });

    // Hapus stok tiket
    await StokTiket.findByIdAndDelete(id);

    return sendResponse(
      res,
      200,
      true,
      `Successfully deleted Stock Ticket for golongan ${stockTicket.group}`,
      {
        deletedStock: stockTicket,
        deletedTicketCount: deletedTickets.deletedCount, // jumlah tiket yang ikut terhapus
      }
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

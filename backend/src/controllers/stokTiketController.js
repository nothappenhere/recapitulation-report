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
  const { golongan, jumlah_tiket } = req.body;

  try {
    if (!golongan || !jumlah_tiket) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    // Simpan stok tiket
    const stockTicket = new StokTiket({ golongan, jumlah_tiket });
    await stockTicket.save();

    // Tentukan prefix golongan
    const prefixMap = {
      Pelajar: "P",
      Umum: "U",
      Asing: "A",
      Khusus: "K",
    };
    const prefix = prefixMap[golongan];

    // Generate kode tiket
    const kodeTiketDocs = [];
    for (let i = 1; i <= jumlah_tiket; i++) {
      kodeTiketDocs.push({
        kode: `${i}${prefix}`,
        golongan,
        stokTiket: stockTicket._id,
        status: "available",
      });
    }
    await KodeTiket.insertMany(kodeTiketDocs);

    return sendResponse(
      res,
      201,
      true,
      `Successfully created Stock Ticket for golongan ${golongan}`,
      {
        stockTicket,
        totalGenerated: jumlah_tiket,
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
  const { jumlah_tiket } = req.body;

  try {
    const stockTicket = await StokTiket.findById(id);
    if (!stockTicket) {
      return sendResponse(res, 404, false, "Stock Ticket not found");
    }

    if (jumlah_tiket) {
      // Hapus semua kode tiket lama
      await KodeTiket.deleteMany({ stokTiket: stockTicket._id });

      // Generate ulang kode tiket baru
      const prefixMap = {
        Pelajar: "P",
        Umum: "U",
        Asing: "A",
        Khusus: "K",
      };
      const prefix = prefixMap[stockTicket.golongan];

      const kodeTiketDocs = [];
      for (let i = 1; i <= jumlah_tiket; i++) {
        kodeTiketDocs.push({
          kode: `${i}${prefix}`,
          golongan: stockTicket.golongan,
          stokTiket: stockTicket._id,
          status: "available",
        });
      }
      await KodeTiket.insertMany(kodeTiketDocs);

      stockTicket.jumlah_tiket = jumlah_tiket;
    }

    await stockTicket.save();

    return sendResponse(
      res,
      200,
      true,
      `Successfully updated Stock Ticket for golongan ${stockTicket.golongan}`,
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
      `Successfully deleted Stock Ticket for golongan ${stockTicket.golongan}`,
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

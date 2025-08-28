import { KodeTiket } from "../models/KodeTiket.js";
import { StokTiket } from "../models/StokTiket.js";
import { sendResponse } from "../utils/response.js";

/**
 * GET semua kode tiket (bisa filter pakai query: ?golongan=Pelajar&status=available)
 */
export const getAllKodeTiket = async (req, res) => {
  try {
    const { golongan, status } = req.query;

    const filter = {};
    if (golongan) filter.golongan = golongan;
    if (status) filter.status = status;

    const kodeTiket = await KodeTiket.find(filter);

    return sendResponse(res, 200, true, "Successful get all Kode Tiket", {
      count: kodeTiket.length,
      kodeTiket,
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * PATCH ubah status tiket (misal sold/expired)
 */
export const updateKodeTiketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!["available", "sold", "expired"].includes(status)) {
      return sendResponse(res, 400, false, "Invalid status");
    }

    const kodeTiket = await KodeTiket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!kodeTiket) {
      return sendResponse(res, 404, false, "Kode Tiket not found");
    }

    return sendResponse(res, 200, true, "Successfully updated status", {
      kodeTiket,
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

export const buyTicket = async (req, res) => {
  const { golongan, jumlah } = req.body;

  try {
    if (!golongan || !jumlah || jumlah <= 0) {
      return sendResponse(res, 400, false, "Golongan dan jumlah harus valid");
    }

    // cek stok
    const stok = await StokTiket.findOne({ golongan });
    if (!stok || stok.jumlah_tiket < jumlah) {
      return sendResponse(res, 400, false, "Stok tiket tidak mencukupi");
    }

    // ambil tiket yang available sesuai jumlah
    const tickets = await KodeTiket.find({ golongan, status: "available" })
      .limit(jumlah);

    if (tickets.length < jumlah) {
      return sendResponse(res, 400, false, "Jumlah tiket available kurang");
    }

    // update status tiket menjadi sold
    const ids = tickets.map((t) => t._id);
    await KodeTiket.updateMany(
      { _id: { $in: ids } },
      { $set: { status: "sold" } }
    );

    // update stok tiket
    stok.jumlah_tiket -= jumlah;
    await stok.save();

    return sendResponse(res, 200, true, "Pembelian berhasil", {
      purchased: jumlah,
      tickets: tickets.map((t) => t.kode), // balikin kode tiketnya
      sisa_stok: stok.jumlah_tiket,
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};
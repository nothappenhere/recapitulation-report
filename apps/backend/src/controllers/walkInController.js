import { WalkIn } from "../models/Walkin.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data walk-in
 * @route GET /api/walk-in
 */
export const getWalkIns = async (_, res) => {
  try {
    const allWalkIns = await WalkIn.find()
      .populate("agent", "fullName username")
      .sort({ createdAt: -1 });

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan semua data walk-in",
      allWalkIns
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan satu data walk-in berdasarkan Kode Unik
 * @route GET /api/walk-in/:uniqueCode
 * @param uniqueCode - Kode unik dari walk-in yang dicari
 */
export const getWalkInByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    // Cari satu data dengan walkInNumber
    const walkIns = await WalkIn.find({ walkInNumber: uniqueCode }).populate(
      "agent",
      "fullName username"
    );

    // Karena response API `data` adalah array, pastikan ada data dan ambil objek pertama
    if (!walkIns || walkIns.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data walk-in dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data walk-in dengan kode ${uniqueCode}`,
      walkIns[0]
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Membuat data walk-in baru
 * @route POST /api/walk-in
 */
export const createWalkIn = async (req, res) => {
  try {
    const newWalkIn = new WalkIn({ ...req.validatedData });
    await newWalkIn.save();

    sendResponse(
      res,
      201,
      true,
      "Berhasil membuat data walk-in baru",
      newWalkIn
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Memperbarui data walk-in berdasarkan Kode Unik
 * @route PUT /api/walk-in/:uniqueCode
 * @param uniqueCode - Kode unik dari walk-in yang akan diperbarui
 */
export const updateWalkInByCode = async (req, res) => {
  const { uniqueCode } = req.params;
  const { agent } = req.body;
  console.log(req.body);

  try {
    // Pakai findOneAndUpdate agar update satu dokumen dan return data terbaru
    const updated = await WalkIn.findOneAndUpdate(
      { walkInNumber: uniqueCode },
      { ...req.validatedData, agent },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return sendResponse(
        res,
        404,
        false,
        `Data walk-in dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data walk-in dengan kode ${uniqueCode}`,
      updated
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Menghapus data walk-in berdasarkan Kode Unik
 * @route DELETE /api/walk-in/:uniqueCode
 * @param uniqueCode - Kode unik dari walk-in yang akan dihapus
 */
export const deleteWalkInByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    // Pakai findOneAndDelete untuk hapus satu dokumen
    const deleted = await WalkIn.findOneAndDelete({ walkInNumber: uniqueCode });

    if (!deleted) {
      return sendResponse(
        res,
        404,
        false,
        `Data walk-in dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data walk-in dengan kode ${uniqueCode}`
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

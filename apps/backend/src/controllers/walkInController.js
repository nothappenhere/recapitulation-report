import { Walkin } from "../models/Walkin.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data kunjungan walk-in
 * @route GET /api/walk-in
 */
export const getWalkIns = async (_, res) => {
  try {
    const allWalkIns = await Walkin.find()
      .populate("agent", "fullName username")
      .sort({ createdAt: -1 });

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan seluruh data kunjungan",
      allWalkIns
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan satu data kunjungan walk-in berdasarkan Kode Unik
 * @route GET /api/walk-in/:uniqueCode
 * @param uniqueCode - Kode unik dari kunjungan walk-in yang dicari
 */
export const getWalkInByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    // Cari satu data dengan walkinNumber
    const walkIn = await Walkin.find({ walkinNumber: uniqueCode }).populate(
      "agent",
      "fullName username"
    );

    // Karena response API `data` adalah array, pastikan ada data dan ambil objek pertama
    if (!walkIn || walkIn.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data kunjungan dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data kunjungan dengan kode ${uniqueCode}`,
      walkIn[0]
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Membuat data kunjungan walk-in baru
 * @route POST /api/walk-in
 */
export const createWalkIn = async (req, res) => {
  const { agent } = req.body;

  try {
    const newWalkIn = new Walkin({ ...req.validatedData, agent });
    await newWalkIn.save();

    sendResponse(
      res,
      201,
      true,
      "Berhasil membuat data kunjungan baru",
      newWalkIn
    );
  } catch (err) {
    console.log(err);
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Memperbarui data kunjungan walk-in berdasarkan Kode Unik
 * @route PUT /api/walk-in/:uniqueCode
 * @param uniqueCode - Kode unik dari kunjungan walk-in yang akan diperbarui
 */
export const updateWalkInByCode = async (req, res) => {
  const { uniqueCode } = req.params;
  const { agent } = req.body;

  try {
    // Pakai findOneAndUpdate agar update satu dokumen dan return data terbaru
    const updated = await Walkin.findOneAndUpdate(
      { walkinNumber: uniqueCode },
      { ...req.validatedData, agent },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated || updated.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data kunjungan dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data kunjungan dengan kode ${uniqueCode}`,
      updated
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Menghapus data kunjungan walk-in berdasarkan Kode Unik
 * @route DELETE /api/walk-in/:uniqueCode
 * @param uniqueCode - Kode unik dari kunjungan walk-in yang akan dihapus
 */
export const deleteWalkInByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    // Pakai findOneAndDelete untuk hapus satu dokumen
    const deleted = await Walkin.findOneAndDelete({ walkinNumber: uniqueCode });

    if (!deleted || deleted.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data kunjungan dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data kunjungan dengan kode ${uniqueCode}`
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

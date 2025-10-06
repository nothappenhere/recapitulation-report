import { DailyRecap } from "../models/DailyRecap.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data rekapitulasi
 * @route GET /api/daily-recap
 */
export const getRecaps = async (_, res) => {
  try {
    const allRecaps = await DailyRecap.find()
      .populate("agent", "fullName username")
      .sort({ createdAt: -1 });

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan seluruh data rekapitulasi",
      allRecaps
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan 1 data rekapitulasi terakhir
 * @route GET /api/daily-recap/last
 */
export const getLastRecap = async (_, res) => {
  try {
    const lastRecap = await DailyRecap.findOne()
      .populate("agent", "fullName username")
      .sort({ createdAt: -1 }); // ambil 1 data terbaru

    if (!lastRecap || lastRecap.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        "Belum ada data rekapitulasi yang tersimpan"
      );
    }

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan data rekapitulasi terakhir",
      lastRecap
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan satu data rekapitulasi berdasarkan Kode Unik
 * @route GET /api/daily-recap/:uniqueCode
 * @param uniqueCode - Kode Unik dari rekapitulasi yang dicari
 */
export const getRecapByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    const recap = await DailyRecap.findOne({
      recapNumber: uniqueCode,
    }).populate("agent", "fullName username");

    if (!recap || recap.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data rekapitulasi dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data rekapitulasi dengan kode ${uniqueCode}`,
      recap
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Membuat data rekapitulasi baru
 * @route POST /api/daily-recap
 */
export const createRecap = async (req, res) => {
  const { agent } = req.body;

  try {
    const newRecap = new DailyRecap({
      ...req.validatedData,
      agent,
    });
    await newRecap.save();

    sendResponse(
      res,
      201,
      true,
      "Berhasil membuat data rekapitulasi baru",
      newRecap
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Memperbarui data rekapitulasi berdasarkan Kode Unik
 * @route PUT /api/daily-recap/:uniqueCode
 * @param uniqueCode - Kode Unik dari rekapitulasi yang akan diperbarui
 */
export const updateRecapByCode = async (req, res) => {
  const { uniqueCode } = req.params;
  const { agent } = req.body;

  try {
    // Pakai findOneAndUpdate agar update satu dokumen dan return data terbaru
    const updated = await DailyRecap.findOneAndUpdate(
      { recapNumber: uniqueCode },
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
        `Data rekapitulasi dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data rekapitulasi dengan kode ${uniqueCode}`,
      updated
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Menghapus data rekapitulasi berdasarkan Kode Unik
 * @route DELETE /api/daily-recap/:uniqueCode
 * @param uniqueCode - Kode Unik dari rekapitulasi yang akan dihapus
 */
export const deleteRecapByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    // Pakai findOneAndDelete untuk hapus satu dokumen
    const deleted = await DailyRecap.findOneAndDelete({
      recapNumber: uniqueCode,
    });

    if (!deleted || deleted.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data rekapitulasi dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data rekapitulasi dengan kode ${uniqueCode}`
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

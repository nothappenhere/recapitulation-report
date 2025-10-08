import { Walkin } from "../models/Walkin.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data kunjungan walk-in
 * @route GET /api/direct-reservation
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
 * @route GET /api/direct-reservation/:uniqueCode
 * @param uniqueCode - Kode unik dari kunjungan walk-in yang dicari
 */
export const getWalkInByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    const walkIn = await Walkin.findOne({
      reservationNumber: uniqueCode,
    }).populate("agent", "fullName username");

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
      walkIn
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Membuat data kunjungan walk-in baru
 * @route POST /api/direct-reservation
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
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Memperbarui data kunjungan walk-in berdasarkan Kode Unik
 * @route PUT /api/direct-reservation/:uniqueCode
 * @param uniqueCode - Kode unik dari kunjungan walk-in yang akan diperbarui
 */
export const updateWalkInByCode = async (req, res) => {
  const { uniqueCode } = req.params;
  const { agent } = req.body;

  try {
    const updated = await Walkin.findOneAndUpdate(
      { reservationNumber: uniqueCode },
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
 * @route DELETE /api/direct-reservation/:uniqueCode
 * @param uniqueCode - Kode unik dari kunjungan walk-in yang akan dihapus
 */
export const deleteWalkInByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    const deleted = await Walkin.findOneAndDelete({
      reservationNumber: uniqueCode,
    });

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

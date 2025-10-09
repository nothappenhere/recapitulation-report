import { DirectReservation } from "../models/DirectReservation.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data reservasi langsung
 * @route GET /api/direct-reservation
 */
export const getDirectReservations = async (_, res) => {
  try {
    const allReservations = await DirectReservation.find()
      .populate("agent", "fullName username")
      .sort({ createdAt: -1 });

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan seluruh data reservasi langsung",
      allReservations
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan satu data reservasi langsung berdasarkan Kode Unik
 * @route GET /api/direct-reservation/:uniqueCode
 * @param uniqueCode - Kode unik dari reservasi langsung yang dicari
 */
export const getDirectReservationByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    const reservation = await DirectReservation.findOne({
      reservationNumber: uniqueCode,
    }).populate("agent", "fullName username");

    if (!reservation || reservation.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data reservasi langsung dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data reservasi langsung dengan kode ${uniqueCode}`,
      reservation
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Membuat data reservasi langsung baru
 * @route POST /api/direct-reservation
 */
export const createDirectReservation = async (req, res) => {
  const { agent } = req.body;

  try {
    const newReservation = new DirectReservation({
      ...req.validatedData,
      agent,
    });
    await newReservation.save();

    sendResponse(
      res,
      201,
      true,
      "Berhasil membuat data reservasi langsung baru",
      newReservation
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Memperbarui data reservasi langsung berdasarkan Kode Unik
 * @route PUT /api/direct-reservation/:uniqueCode
 * @param uniqueCode - Kode unik dari reservasi langsung yang akan diperbarui
 */
export const updateDirectReservationByCode = async (req, res) => {
  const { uniqueCode } = req.params;
  const { agent } = req.body;

  try {
    const updated = await DirectReservation.findOneAndUpdate(
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
        `Data reservasi langsung dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data reservasi langsung dengan kode ${uniqueCode}`,
      updated
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Menghapus data reservasi langsung berdasarkan Kode Unik
 * @route DELETE /api/direct-reservation/:uniqueCode
 * @param uniqueCode - Kode unik dari reservasi langsung yang akan dihapus
 */
export const deleteDirectReservationByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    const deleted = await DirectReservation.findOneAndDelete({
      reservationNumber: uniqueCode,
    });

    if (!deleted || deleted.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data reservasi langsung dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data reservasi langsung dengan kode ${uniqueCode}`
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

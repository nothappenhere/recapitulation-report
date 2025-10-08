import { GroupReservation } from "../models/GroupReservation.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data reservasi rombongan
 * @route GET /api/group-reservation
 */
export const getGroupReservations = async (_, res) => {
  try {
    const allReservations = await GroupReservation.find()
      .populate("agent", "fullName username")
      .populate("visitingHour", "timeRange")
      .sort({ createdAt: -1 });

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan seluruh data reservasi rombongan",
      allReservations
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan satu data reservasi rombongan berdasarkan Kode Unik
 * @route GET /api/group-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi rombongan yang dicari
 */
export const getGroupReservationByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    const reservation = await GroupReservation.findOne({
      reservationNumber: uniqueCode,
    })
      .populate("agent", "fullName username")
      .populate("visitingHour", "timeRange");

    if (!reservation || reservation.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data reservasi rombongan dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data reservasi rombongan dengan kode ${uniqueCode}`,
      reservation
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Membuat data reservasi rombongan baru
 * @route POST /api/group-reservation
 */
export const createGroupReservation = async (req, res) => {
  const { agent } = req.body;

  try {
    const newReservation = new GroupReservation({
      ...req.validatedData,
      agent,
    });
    await newReservation.save();

    sendResponse(
      res,
      201,
      true,
      "Berhasil membuat data reservasi rombongan baru",
      newReservation
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Memperbarui data reservasi rombongan berdasarkan Kode Unik
 * @route PUT /api/group-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi rombongan yang akan diperbarui
 */
export const updateGroupReservationByCode = async (req, res) => {
  const { uniqueCode } = req.params;
  const { agent } = req.body;

  try {
    const updated = await GroupReservation.findOneAndUpdate(
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
        `Data reservasi rombongan dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data reservasi rombongan dengan kode ${uniqueCode}`,
      updated
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Menghapus data reservasi rombongan berdasarkan Kode Unik
 * @route DELETE /api/group-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi rombongan yang akan dihapus
 */
export const deleteGroupReservationByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    const deleted = await GroupReservation.findOneAndDelete({
      reservationNumber: uniqueCode,
    });

    if (!deleted || deleted.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data reservasi rombongan dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data reservasi rombongan dengan kode ${uniqueCode}`
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

import { Reservation } from "../models/Reservation.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data reservasi
 * @route GET /api/reservation
 */
export const getReservations = async (req, res) => {
  try {
    const allReservations = await Reservation.find()
      .populate("reservationAgent", "fullName username")
      .populate("visitingHour", "timeRange")
      .sort({ createdAt: -1 });

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan semua data reservasi",
      allReservations
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan satu data reservasi berdasarkan ID
 * @route GET /api/reservation/:id
 * @param id - ID dari reservasi yang dicari
 */
export const getReservationById = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findById(id)
      .populate("reservationAgent", "fullName username")
      .populate("visitingHour", "timeRange");

    if (!reservation) {
      return sendResponse(
        res,
        404,
        false,
        `Data reservasi dengan ID ${id} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data reservasi dengan ID ${id}`,
      reservation
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Membuat data reservasi baru
 * @route POST /api/reservation
 */
export const createReservation = async (req, res) => {
  try {
    const { visitingDate, visitingHour } = req.validatedData;

    // Cek apakah slot waktu sudah dipakai di tanggal itu
    const slotTaken = await Reservation.findOne({
      visitingDate,
      visitingHour,
    });

    if (slotTaken) {
      return sendResponse(
        res,
        400,
        false,
        `Slot waktu ini (${visitingHour}) sudah dipesan di tanggal tersebut (${visitingDate})`
      );
    }

    // Buat reservasi baru
    const newReservation = new Reservation({ ...req.validatedData });
    await newReservation.save();

    sendResponse(
      res,
      201,
      true,
      "Berhasil membuat data reservasi baru",
      newReservation
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Memperbarui data reservasi berdasarkan ID
 * @route PUT /api/reservation/:id
 * @param id - ID dari reservasi yang akan diperbarui
 */
export const updateReservationById = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await Reservation.findByIdAndUpdate(id, req.validatedData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return sendResponse(
        res,
        404,
        false,
        `Data reservasi dengan ID ${id} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data reservasi dengan ID ${id}`,
      updated
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Menghapus data reservasi berdasarkan ID
 * @route DELETE /api/reservation/:
 * @param id - ID dari reservasi yang akan dihapus
 */
export const deleteReservationById = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Reservation.findByIdAndDelete(id);

    if (!deleted) {
      return sendResponse(
        res,
        404,
        false,
        `Data reservasi dengan ID ${id} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data reservasi dengan ID${id}`
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

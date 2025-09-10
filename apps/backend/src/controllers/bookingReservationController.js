import { BookingReservation } from "../models/BookingReservation.js";
import { VisitingHour } from "../models/VisitingHour.js";
import { Counter } from "../models/Counter.js";
import { sendError, sendResponse } from "../utils/response.js";

/**
 * * Mendapatkan semua reservasi
 */
export const getReservations = async (req, res) => {
  try {
    const allReservations = await BookingReservation.find()
      .populate("reservationAgent", "fullName username")
      .populate("visitingHour", "timeRange")
      .sort({ createdAt: -1 });

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan semua reservasi",
      allReservations
    );
  } catch (err) {
    return sendError(res, err);
  }
};

/**
 * * Mendapatkan reservasi berdasarkan ID
 */
export const getReservationById = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await BookingReservation.findById(id)
      .populate("reservationAgent", "fullName username")
      .populate("visitingHour", "timeRange");

    if (!reservation) {
      return sendResponse(res, 404, false, "Data reservasi tidak ditemukan");
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan reservasi dengan ID ${id}`,
      reservation
    );
  } catch (err) {
    return sendError(res, err);
  }
};

export const createReservation = async (req, res) => {
  try {
    const { visitingDate, visitingHour } = req.body;

    // 🔎 Cek apakah slot waktu sudah dipakai di tanggal itu
    const slotTaken = await BookingReservation.findOne({
      visitingDate,
      visitingHour,
    });
    if (slotTaken) {
      return sendResponse(
        res,
        400,
        false,
        "Slot waktu ini sudah dipesan di tanggal tersebut"
      );
    }

    // 🚀 Buat reservasi baru
    const newReservation = new BookingReservation({ ...req.body });
    await newReservation.save();

    sendResponse(
      res,
      201,
      true,
      "Berhasil membuat reservasi baru",
      newReservation
    );
  } catch (err) {
    return sendError(res, err);
  }
};

/**
 * * Update reservasi
 */
export const updateReservationById = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await BookingReservation.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return sendResponse(res, 404, false, "Data reservasi tidak ditemukan");
    }

    sendResponse(res, 200, true, `Berhasil update reservasi ${id}`, updated);
  } catch (err) {
    return sendError(res, err);
  }
};

/**
 * * Hapus reservasi
 */
export const deleteReservationById = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await BookingReservation.findByIdAndDelete(id);

    if (!deleted) {
      return sendResponse(res, 404, false, "Data reservasi tidak ditemukan");
    }

    sendResponse(res, 200, true, `Berhasil menghapus reservasi ${id}`);
  } catch (err) {
    return sendError(res, err);
  }
};

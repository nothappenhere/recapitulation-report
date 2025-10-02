import { GroupReservation } from "../models/GroupReservation.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data reservasi
 * @route GET /api/group-reservation
 */
export const getReservations = async (_, res) => {
  try {
    const allReservations = await GroupReservation.find()
      .populate("agent", "fullName username")
      .populate("visitingHour", "timeRange")
      .sort({ createdAt: -1 });

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan seluruh data reservasi",
      allReservations
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan satu data reservasi berdasarkan Kode Unik
 * @route GET /api/group-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi yang dicari
 */
export const getReservationByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    // Cari satu data dengan ReservationNumber
    const reservation = await GroupReservation.find({
      groupReservationNumber: uniqueCode,
    })
      .populate("agent", "fullName username")
      .populate("visitingHour", "timeRange");

    // Karena response API `data` adalah array, pastikan ada data dan ambil objek pertama
    if (!reservation || reservation.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data reservasi dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data reservasi dengan kode ${uniqueCode}`,
      reservation[0]
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Membuat data reservasi baru
 * @route POST /api/group-reservation
 */
export const createReservation = async (req, res) => {
  const { agent } = req.body;

  try {
    // const { visitingDate, visitingHour } = req.validatedData;

    // Cek apakah slot waktu sudah dipakai di tanggal itu
    // const slotTaken = await GroupReservation.findOne({
    //   visitingDate,
    //   visitingHour,
    // });

    // if (slotTaken) {
    //   return sendResponse(
    //     res,
    //     400,
    //     false,
    //     `Slot waktu kunjungan saat ini sudah dipesan di tanggal tersebut`
    //   );
    // }

    const newReservation = new GroupReservation({
      ...req.validatedData,
      agent,
    });
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
 * * @desc Memperbarui data reservasi berdasarkan Kode Unik
 * @route PUT /api/group-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi yang akan diperbarui
 */
export const updateReservationByCode = async (req, res) => {
  const { uniqueCode } = req.params;
  const { agent } = req.body;

  try {
    // Pakai findOneAndUpdate agar update satu dokumen dan return data terbaru
    const updated = await GroupReservation.findOneAndUpdate(
      { groupReservationNumber: uniqueCode },
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
        `Data reservasi dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data reservasi dengan kode ${uniqueCode}`,
      updated
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Menghapus data reservasi berdasarkan Kode Unik
 * @route DELETE /api/group-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi yang akan dihapus
 */
export const deleteReservationByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    // Pakai findOneAndDelete untuk hapus satu dokumen
    const deleted = await GroupReservation.findOneAndDelete({
      groupReservationNumber: uniqueCode,
    });

    if (!deleted || deleted.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data reservasi dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data reservasi dengan kode ${uniqueCode}`
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

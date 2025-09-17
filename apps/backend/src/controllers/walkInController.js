import { WalkIn } from "../models/walkIn.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data walk-in
 * @route GET /api/walk-in
 */
export const getWalkIns = async (req, res) => {
  try {
    const allWalkIns = await WalkIn.find()
      .populate("reservationAgent", "fullName username")
      .populate("visitingHour", "timeRange")
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
 * * @desc Mendapatkan satu data walk-in berdasarkan ID
 * @route GET /api/walk-in/:id
 * @param id - ID dari walk-in yang dicari
 */
export const getWalkInById = async (req, res) => {
  const { id } = req.params;

  try {
    const walkIn = await WalkIn.findById(id)
      .populate("reservationAgent", "fullName username")
      .populate("visitingHour", "timeRange");

    if (!walkIn) {
      return sendResponse(
        res,
        404,
        false,
        `Data walk-in dengan ID ${id} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data walk-in dengan ID ${id}`,
      walkIn
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
  const { reservationAgent } = req.body;

  try {
    const newWalkIn = new WalkIn({ ...req.validatedData, reservationAgent });
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
 * * @desc Memperbarui data walk-in berdasarkan ID
 * @route PUT /api/walk-in/:id
 * @param id - ID dari walk-in yang akan diperbarui
 */
export const updateWalkInById = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await WalkIn.findByIdAndUpdate(id, req.validatedData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return sendResponse(
        res,
        404,
        false,
        `Data walk-in dengan ID ${id} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data walk-in dengan ID ${id}`,
      updated
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Menghapus data walk-in berdasarkan ID
 * @route DELETE /api/walk-in/:id
 * @param id - ID dari walk-in yang akan dihapus
 */
export const deleteWalkInById = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await WalkIn.findByIdAndDelete(id);

    if (!deleted) {
      return sendResponse(
        res,
        404,
        false,
        `Data walk-in dengan ID ${id} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data walk-in dengan ID ${id}`
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

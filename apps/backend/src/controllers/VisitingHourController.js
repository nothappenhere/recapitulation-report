import { VisitingHour } from "../models/VisitingHour.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data waktu kunjungan museum
 * @route GET /api/visit-hour
 */
export const getVisitHours = async (_, res) => {
  try {
    const visitHour = await VisitingHour.find().sort({
      timeRange: 1,
    });

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan semua data waktu kunjungan",
      visitHour
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

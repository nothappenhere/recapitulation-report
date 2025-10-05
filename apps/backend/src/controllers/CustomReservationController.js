import { CustomReservation } from "../models/CustomReservation.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data reservasi khusus
 * @route GET /api/custom-reservation
 */
export const getCustomReservations = async (_, res) => {
  try {
    const allCustomReservations = await CustomReservation.find()
      .populate("agent", "fullName username")
      .populate("visitingHour", "timeRange")
      .sort({ createdAt: -1 });

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan seluruh data reservasi khusus",
      allCustomReservations
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan data file hasil upload
 * @route GET /api/custom-reservation/file/:fileName
 * @param fileName - Nama file hasil upload yang dicari
 */
export const getFileUpload = async (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.fileName);
  if (await fs.pathExists(filePath)) {
    return res.download(filePath);
  } else {
    return res.status(404).send("File tidak ditemukan");
  }
};

/**
 * * @desc Mendapatkan satu data reservasi khusus berdasarkan Kode Unik
 * @route GET /api/custom-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi khusus yang dicari
 */
export const getCustomReservationByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    // Cari satu data dengan CustomReservationNumber
    const reservation = await CustomReservation.find({
      groupCustomReservationNumber: uniqueCode,
    })
      .populate("agent", "fullName username")
      .populate("visitingHour", "timeRange");

    // Karena response API `data` adalah array, pastikan ada data dan ambil objek pertama
    if (!reservation || reservation.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data reservasi khusus dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data reservasi khusus dengan kode ${uniqueCode}`,
      reservation[0]
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Membuat data reservasi khusus baru
 * @route POST /api/custom-reservation
 */
export const createCustomReservation = async (req, res) => {
  const { agent } = req.body;

  try {
    const file = req.file;

    const newCustomReservation = new CustomReservation({
      ...req.validatedData,
      agent,
      attachment: file
        ? {
            originalName: file.originalname,
            fileName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
          }
        : null,
    });
    await newCustomReservation.save();

    sendResponse(
      res,
      201,
      true,
      "Berhasil membuat data reservasi khusus baru",
      newCustomReservation
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Memperbarui data reservasi khusus berdasarkan Kode Unik
 * @route PUT /api/custom-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi khusus yang akan diperbarui
 */
export const updateCustomReservationByCode = async (req, res) => {
  const { uniqueCode } = req.params;
  const { agent } = req.body;

  try {
    // Pakai findOneAndUpdate agar update satu dokumen dan return data terbaru
    const updated = await CustomReservation.findOneAndUpdate(
      { groupCustomReservationNumber: uniqueCode },
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
        `Data reservasi khusus dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data reservasi khusus dengan kode ${uniqueCode}`,
      updated
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Menghapus data reservasi khusus berdasarkan Kode Unik
 * @route DELETE /api/custom-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi khusus yang akan dihapus
 */
export const deleteCustomReservationByCode = async (req, res) => {
  const { uniqueCode } = req.params;

  try {
    // Pakai findOneAndDelete untuk hapus satu dokumen
    const deleted = await CustomReservation.findOneAndDelete({
      groupCustomReservationNumber: uniqueCode,
    });

    if (!deleted || deleted.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data reservasi khusus dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data reservasi khusus dengan kode ${uniqueCode}`
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

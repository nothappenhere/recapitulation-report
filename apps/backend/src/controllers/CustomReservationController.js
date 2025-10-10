import path from "path";
import fs from "fs-extra";
import { CustomReservation } from "../models/CustomReservation.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data reservasi khusus
 * @route GET /api/custom-reservation
 */
export const getCustomReservations = async (_, res) => {
  try {
    const allReservations = await CustomReservation.find()
      .populate("agent", "fullName username")
      .populate("visitingHour", "timeRange")
      .sort({ createdAt: -1 });

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan seluruh data reservasi khusus",
      allReservations
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
  try {
    const fileName = req.params.fileName;
    const imageDir = path.join(process.cwd(), "uploads", "images", fileName);
    const docsDir = path.join(process.cwd(), "uploads", "docs", fileName);

    // cek di folder images dulu, lalu docs
    const filePath = (await fs.pathExists(imageDir)) ? imageDir : docsDir;

    if (await fs.pathExists(filePath)) {
      res.sendFile(filePath);
    } else {
      return sendResponse(
        res,
        404,
        false,
        `File dengan nama ${fileName} tidak ditemukan`
      );
    }
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
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
    const reservation = await CustomReservation.findOne({
      reservationNumber: uniqueCode,
    })
      .populate("agent", "fullName username")
      .populate("visitingHour", "timeRange");

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
      reservation
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
    const files = req.files;

    const newReservation = new CustomReservation({
      ...req.validatedData,
      agent,
      attachments: files
        ? files.map((file) => ({
            originalName: file.originalname,
            encoding: file.encoding,
            mimeType: file.mimetype,
            fileName: file.filename,
            size: file.size,
            path: file.path,
          }))
        : [],
    });
    await newReservation.save();

    sendResponse(
      res,
      201,
      true,
      "Berhasil membuat data reservasi khusus baru",
      newReservation
    );
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return sendResponse(res, statusCode, false, "Internal server error", null, {
      detail: err.detail,
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
  const { agent, existingAttachments } = req.body;
  const files = req.files || [];

  try {
    // Ambil data lama
    const existing = await CustomReservation.findOne({
      reservationNumber: uniqueCode,
    });

    if (!existing || existing.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data reservasi khusus dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    // Pertahankan file lama yang masih ingin disimpan (jika ada)
    let attachments = [];
    let keepIds = [];
    if (existingAttachments) {
      keepIds = JSON.parse(existingAttachments);
      attachments = existing.attachments.filter((a) =>
        keepIds.includes(a._id.toString())
      );
    }

    // Cari file lama yang dihapus oleh user
    const deletedFiles = existing.attachments.filter(
      (a) => !keepIds.includes(a._id.toString())
    );

    // Hapus file fisik dari disk (jika ada)
    for (const file of deletedFiles) {
      if (file.path && (await fs.pathExists(file.path))) {
        try {
          await fs.remove(file.path);
          console.log(`🗑️ Berhasil hapus file: ${file.path}`);
        } catch (err) {
          console.error(`Gagal hapus file ${file.path}:`, err.message);
        }
      }
    }

    // Tambahkan file baru (jika ada)
    if (files.length > 0) {
      const newFiles = files.map((file) => ({
        originalName: file.originalname,
        encoding: file.encoding,
        mimeType: file.mimetype,
        fileName: file.filename,
        size: file.size,
        path: file.path,
      }));
      attachments = attachments.concat(newFiles);
    }

    // Update data di database
    const updated = await CustomReservation.findOneAndUpdate(
      { reservationNumber: uniqueCode },
      { ...req.validatedData, agent, attachments },
      { new: true, runValidators: true }
    );

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
    // Cari data reservasi yang akan dihapus
    const deleted = await CustomReservation.findOne({
      reservationNumber: uniqueCode,
    });

    if (!deleted || deleted.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data reservasi khusus dengan kode ${uniqueCode} tidak ditemukan`
      );
    }

    // Hapus semua file attachment fisik (jika ada)
    if (deleted.attachments && deleted.attachments.length > 0) {
      for (const file of deleted.attachments) {
        if (file.path && (await fs.pathExists(file.path))) {
          try {
            await fs.remove(file.path);
            console.log(`🗑️ File terhapus: ${file.path}`);
          } catch (err) {
            console.error(`Gagal hapus file ${file.path}:`, err.message);
          }
        }
      }
    }

    // Hapus data reservasi dari database
    await CustomReservation.deleteOne({ reservationNumber: uniqueCode });

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

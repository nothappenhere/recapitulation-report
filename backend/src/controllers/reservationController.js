import { Reservation } from "../Model/Reservation.js";
import { sendError, sendResponse } from "../utils/response.js";

/**
 * * @desc Mengambil semua data reservasi
 * ? Mengembalikan seluruh data reservasi yang ada di database, diurutkan berdasarkan waktu pembuatan terbaru
 * @route GET /api/reservations
 */
export const getReservations = async (req, res) => {
  try {
    const allReservations = await Reservation.find().sort({ createdAt: -1 });

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan data semua reservasi",
      allReservations
    );
  } catch (err) {
    return sendError(res, err);
  }
};

/**
 * * @desc Mengambil satu data reservasi berdasarkan ID
 * ? ID diambil dari parameter URL dan digunakan untuk pencarian menggunakan method findById()
 * ! Jika data tidak ditemukan, akan mengembalikan status 404
 * @route GET /api/reservations/:id
 * @param id - ID unik dari reservasi yang ingin diambil
 */
export const getReservationById = async (req, res) => {
  const { id } = req.params;

  try {
    const reservationById = await Reservation.findById(id);
    if (!reservationById)
      return sendResponse(res, 404, false, "Data reservasi tidak ditemukan");

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data reservasi untuk ID ${id}`,
      reservationById
    );
  } catch (err) {
    return sendError(res, err); // ! Error karena format ID tidak valid (e.g., bukan ObjectId)
  }
};

/**
 * * @desc Membuat reservasi baru
 * ? Menyimpan data reservasi dari request body ke database MongoDB
 * ! Pastikan struktur data sesuai dengan schema Reservation agar tidak terjadi validasi error
 * @route POST /api/reservations
 */
export const createReservation = async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    await newReservation.save();

    sendResponse(
      res,
      201,
      true,
      "Berhasil membuat data reservasi baru",
      newReservation
    );
  } catch (err) {
    return sendError(res, err); // ! Tangani error validasi atau kesalahan penyimpanan
  }
};

/**
 * * @desc Memperbarui data reservasi berdasarkan ID
 * ? Mengupdate dokumen reservasi menggunakan data dari request body
 * ! Jalankan validasi schema dengan opsi runValidators: true
 * @route PUT /api/reservations/:id
 * @param id - ID unik dari reservasi yang ingin diperbarui
 */
export const updateReservationById = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedReservation)
      return sendResponse(res, 404, false, "Data reservasi tidak ditemukan");

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data reservasi untuk ID ${id}`,
      updatedReservation
    );
  } catch (err) {
    return sendError(res, err); // ! Tangani error validasi atau ID tidak valid
  }
};

/**
 * * @desc Menghapus data reservasi berdasarkan ID
 * ? Menghapus dokumen reservasi dari database jika ditemukan
 * ! Jika ID tidak ditemukan, akan mengembalikan response 404
 * @route DELETE /api/reservations/:id
 * @param id - ID unik dari reservasi yang ingin dihapus
 */
export const deleteReservationById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReservation = await Reservation.findByIdAndDelete(id);
    if (!deletedReservation)
      return sendResponse(res, 404, false, "Data reservasi tidak ditemukan");

    sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data reservasi untuk ID ${id}`
    );
  } catch (err) {
    return sendError(res, err); // ! Error umum saat delete, seperti ID salah format
  }
};

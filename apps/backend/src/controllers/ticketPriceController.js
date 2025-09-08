import { TicketPrice } from "../models/ticket-price.model.js";
import { sendError, sendResponse } from "../utils/response.js";

/**
 * * @desc Mengambil semua data harga tiket
 * ? Mengembalikan seluruh data harga tiket yang ada di database
 * @route GET /api/ticket-price
 */
export const getTicketPrices = async (req, res) => {
  try {
    const allTicketPrices = await TicketPrice.find();

    return sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatakan data semua harga tiket`,
      allTicketPrices
    );
  } catch (err) {
    return sendError(res, err);
  }
};

/**
 * * @desc Mengambil satu data harga tiket berdasarkan ID
 * ? ID diambil dari parameter URL dan digunakan untuk pencarian menggunakan method findById()
 * ! Jika data tidak ditemukan, akan mengembalikan status 404
 * @route GET /api/ticket-price/:id
 * @param id - ID unik dari harga tiket yang ingin diambil
 */
export const getTicketPriceById = async (req, res) => {
  const { id } = req.params;

  try {
    const ticketPriceById = await TicketPrice.findById(id);
    if (!ticketPriceById) {
      return sendResponse(res, 404, false, "Data harga tiket tidak ditemukan");
    }

    return sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data harga tiket untuk ID ${id}`,
      ticketPriceById
    );
  } catch (err) {
    return sendError(res, err);
  }
};

/**
 * * @desc Membuat harga tiket baru
 * ? Menyimpan data harga tiket dari request body ke database MongoDB
 * ! Pastikan struktur data sesuai dengan schema TicketPrice agar tidak terjadi validasi error
 * @route POST /api/ticket-price
 */
export const createTicketPrice = async (req, res) => {
  const { category, unitPrice } = req.body;

  try {
    const newTicketPrice = new TicketPrice({ category, unitPrice });
    await newTicketPrice.save();

    return sendResponse(
      res,
      201,
      true,
      `Berhasil membuat data harga tiket baru untuk kategori ${category}`,
      newTicketPrice
    );
  } catch (err) {
    return sendError(res, err);
  }
};

/**
 * * @desc Memperbarui data harga tiket berdasarkan ID
 * ? Mengupdate dokumen harga tiket menggunakan data dari request body
 * ! Jalankan validasi schema dengan opsi runValidators: true
 * @route PUT /api/ticket-price/:id
 * @param id - ID unik dari harga tiket yang ingin diperbarui
 */
export const updateTicketPriceById = async (req, res) => {
  const { id } = req.params;
  const { category, unitPrice } = req.body;

  try {
    const updatedTicketPrice = await TicketPrice.findByIdAndUpdate(
      id,
      {
        category,
        unitPrice,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedTicketPrice)
      return sendResponse(res, 404, false, "Data harga tiket tidak ditemukan");

    if (category !== undefined) updatedTicketPrice.category = category;
    if (unitPrice !== undefined) updatedTicketPrice.unitPrice = unitPrice;
    await updatedTicketPrice.save();

    return sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data harga tiket untuk ID ${id}`,
      updatedTicketPrice
    );
  } catch (err) {
    return sendError(res, err);
  }
};

/**
 * * @desc Menghapus data harga tiket berdasarkan ID
 * ? Menghapus dokumen harga tiket dari database jika ditemukan
 * ! Jika ID tidak ditemukan, akan mengembalikan response 404
 * @route DELETE /api/ticket-price/:id
 * @param id - ID unik dari harga tiket yang ingin dihapus
 */
export const deleteTicketPriceById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTicketPrice = await TicketPrice.findByIdAndDelete(id);
    if (!deletedTicketPrice)
      return sendResponse(res, 404, false, "Data harga tiket tidak ditemukan");

    return sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data harga tiket untuk ID ${id}`
    );
  } catch (err) {
    return sendError(res, err);
  }
};

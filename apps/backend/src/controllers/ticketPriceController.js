import { TicketPrice } from "../models/TicketPrice.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data harga tiket
 * @route GET /api/ticket-price
 */
export const getTicketPrices = async (_, res) => {
  try {
    const allTicketPrices = await TicketPrice.find();

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatakan data semua harga tiket`,
      allTicketPrices
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan satu data harga tiket berdasarkan Kategori
 * @route GET /api/ticket-price/:category
 * @param category - Kategori dari harga tiket yang dicari
 */
export const getTicketPriceByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const ticketPrice = await TicketPrice.findOne({ category });

    if (!ticketPrice || ticketPrice.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data harga tiket dengan kategori ${category} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data harga tiket dengan kategori ${category}`,
      ticketPrice
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Membuat data harga tiket baru
 * @route POST /api/ticket-price
 */
export const createTicketPrice = async (req, res) => {
  try {
    const newTicketPrice = new TicketPrice({ ...req.validatedData });
    await newTicketPrice.save();

    sendResponse(
      res,
      201,
      true,
      `Berhasil membuat data harga tiket baru`,
      newTicketPrice
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Memperbarui data harga tiket berdasarkan Kategori
 * @route PUT /api/ticket-price/:category
 * @param category - Kategori dari harga tiket yang akan diperbarui
 */
export const updateTicketPriceByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const updated = await TicketPrice.findOneAndUpdate(
      { category },
      { ...req.validatedData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated || updated.length === 0)
      return sendResponse(
        res,
        404,
        false,
        `Data harga tiket dengan kategori ${category} tiket tidak ditemukan`
      );

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data harga tiket dengan kategori ${category}`,
      updated
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Menghapus data harga tiket berdasarkan Kategori
 * @route DELETE /api/ticket-price/:category
 * @param category - Kategori dari harga tiket yang akan dihapus
 */
export const deleteTicketPriceByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const deleted = await TicketPrice.findOneAndDelete({ category });

    if (!deleted || deleted.length === 0)
      return sendResponse(
        res,
        404,
        false,
        `Data harga tiket dengan kategori ${category} tidak ditemukan`
      );

    sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data harga tiket dengan kategori ${category}`
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

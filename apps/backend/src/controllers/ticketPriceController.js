import { TicketPrice } from "../models/TicketPrice.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data harga tiket
 * @route GET /api/ticket-price
 */
export const getTicketPrices = async (req, res) => {
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
 * * @desc Mendapatkan satu data harga tiket berdasarkan ID
 * @route GET /api/ticket-price/:id
 * @param id - ID dari harga tiket yang dicari
 */
export const getTicketPriceById = async (req, res) => {
  const { id } = req.params;

  try {
    const ticketPrice = await TicketPrice.findById(id);
    if (!ticketPrice) {
      return sendResponse(
        res,
        404,
        false,
        `Data harga tiket dengan ID ${id} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data harga tiket dengan ID ${id}`,
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
 * * @desc Memperbarui data harga tiket berdasarkan ID
 * @route PUT /api/ticket-price/:id
 * @param id - ID dari harga tiket yang akan diperbarui
 */
export const updateTicketPriceById = async (req, res) => {
  const { id } = req.params;
  const { category, unitPrice } = req.validatedData;

  try {
    const updated = await TicketPrice.findByIdAndUpdate(id, req.validatedData, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return sendResponse(
        res,
        404,
        false,
        `Data harga tiket dengan ID ${id} tiket tidak ditemukan`
      );

    if (category !== undefined) updated.category = category;
    if (unitPrice !== undefined) updated.unitPrice = unitPrice;
    await updated.save();

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data harga tiket dengan ID ${id}`,
      updated
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Menghapus data harga tiket berdasarkan ID
 * @route DELETE /api/ticket-price/:id
 * @param id - ID dari harga tiket yang akan dihapus
 */
export const deleteTicketPriceById = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await TicketPrice.findByIdAndDelete(id);
    if (!deleted)
      return sendResponse(
        res,
        404,
        false,
        `Data harga tiket dengan ID ${id} tidak ditemukan`
      );

    sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data harga tiket dengan ID ${id}`
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

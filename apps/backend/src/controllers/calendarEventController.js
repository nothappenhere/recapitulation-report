import { CalendarEvent } from "../models/CalendarEvent.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data acara
 * @route GET /api/calendar-event
 */
export const getEvents = async (req, res) => {
  try {
    const allEvents = await CalendarEvent.find();

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan semua data acara",
      allEvents
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan satu data acara berdasarkan ID
 * @route GET /api/calendar-event/:id
 * @param id - ID dari acara yang dicari
 */
export const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await CalendarEvent.findById(id);

    if (!event) {
      return sendResponse(
        res,
        404,
        false,
        `Data acara dengan ID ${id} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data acara dengan ID ${id}`,
      event
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Membuat data acara baru
 * @route POST /api/calendar-event
 */
export const createEvent = async (req, res) => {
  try {
    // Buat acara baru
    const newEvent = new CalendarEvent({
      ...req.validatedData,
    });
    await newEvent.save();

    sendResponse(res, 201, true, "Berhasil membuat data acara baru", newEvent);
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Memperbarui data acara berdasarkan ID
 * @route PUT /api/calendar-event/:id
 * @param id - ID dari acara yang akan diperbarui
 */
export const updateEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await CalendarEvent.findByIdAndUpdate(
      id,
      req.validatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return sendResponse(
        res,
        404,
        false,
        `Data acara dengan ID ${id} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data acara dengan ID ${id}`,
      updated
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Menghapus data acara berdasarkan ID
 * @route DELETE /api/calendar-event/:
 * @param id - ID dari acara yang akan dihapus
 */
export const deleteEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await CalendarEvent.findByIdAndDelete(id);

    if (!deleted) {
      return sendResponse(
        res,
        404,
        false,
        `Data acara dengan ID ${id} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data acara dengan ID ${id}`
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

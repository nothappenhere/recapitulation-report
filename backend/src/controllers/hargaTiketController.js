import { HargaTiket } from "../models/HargaTiket.js";
import { sendResponse } from "../utils/response.js";

export const getAllTicketPrice = async (req, res) => {
  try {
    const ticketPrice = await HargaTiket.find();
    return sendResponse(res, 200, true, `Successful get all Ticket Price`, {
      ticketPrice,
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

export const createTicketPrice = async (req, res) => {
  const { golongan, harga_satuan } = req.body;

  try {
    if (!golongan || !harga_satuan) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    const ticketPrice = new HargaTiket({ golongan, harga_satuan });
    await ticketPrice.save();

    return sendResponse(
      res,
      201,
      true,
      `Successfully create Ticket Price for golongan ${golongan}`,
      {
        ticketPrice,
      }
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

export const updateTicketPrice = async (req, res) => {
  const { id } = req.params;
  const { golongan, harga_satuan } = req.body;

  try {
    const ticketPrice = await HargaTiket.findById(id);
    if (!ticketPrice) {
      return sendResponse(res, 404, false, "Ticket price not found");
    }

    // update only if provided
    if (golongan !== undefined) ticketPrice.golongan = golongan;
    if (harga_satuan !== undefined) ticketPrice.harga_satuan = harga_satuan;
    await ticketPrice.save();

    return sendResponse(
      res,
      200,
      true,
      `Successfully updated Ticket Price with ID ${id}`,
      { ticketPrice }
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

export const deleteTicketPrice = async (req, res) => {
  const { id } = req.params;

  try {
    const ticketPrice = await HargaTiket.findById(id);
    if (!ticketPrice) {
      return sendResponse(res, 404, false, "Ticket price not found");
    }

    await ticketPrice.deleteOne();

    return sendResponse(
      res,
      200,
      true,
      `Successfully deleted Ticket Price with ID ${id}`,
      null
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

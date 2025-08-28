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

export const getTicketPriceById = async (req, res) => {
  const { id } = req.params;

  try {
    const ticketPrice = await HargaTiket.findById(id);
    if (!ticketPrice) {
      return sendResponse(res, 404, false, "Ticket price not found");
    }

    return sendResponse(
      res,
      200,
      true,
      `Successfully get Ticket Price with ID ${id}`,
      { ticketPrice }
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

export const createTicketPrice = async (req, res) => {
  const { group, unitPrice } = req.body;

  try {
    if (!group || !unitPrice) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    const ticketPrice = new HargaTiket({ group, unitPrice });
    await ticketPrice.save();

    return sendResponse(
      res,
      201,
      true,
      `Successfully create Ticket Price for group ${group}`,
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
  const { group, unitPrice } = req.body;

  try {
    const ticketPrice = await HargaTiket.findById(id);
    if (!ticketPrice) {
      return sendResponse(res, 404, false, "Ticket price not found");
    }

    // update only if provided
    if (group !== undefined) ticketPrice.group = group;
    if (unitPrice !== undefined) ticketPrice.unitPrice = unitPrice;
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

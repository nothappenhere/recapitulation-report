// import { WeeklyReport } from "../models/WeeklyReport.js";
// import { HargaTiket } from "../models/TicketPrice.js";
// import { sendResponse } from "../utils/response.js";

// // GET all reports
// export const getAllWeeklyReports = async (req, res) => {
//   try {
//     const reports = await WeeklyReport.find().sort({ visitDate: -1 });
//     return sendResponse(res, 200, true, "Success get all weekly reports", {
//       reports,
//     });
//   } catch (err) {
//     return sendResponse(res, 500, false, "Internal server error", null, {
//       detail: err.message,
//     });
//   }
// };

// // GET by ID
// export const getWeeklyReportById = async (req, res) => {
//   try {
//     const report = await WeeklyReport.findById(req.params.id);
//     if (!report) {
//       return sendResponse(res, 404, false, "Weekly Report not found");
//     }
//     return sendResponse(res, 200, true, "Success get report", { report });
//   } catch (err) {
//     return sendResponse(res, 500, false, "Internal server error", null, {
//       detail: err.message,
//     });
//   }
// };

// // CREATE report
// export const createWeeklyReport = async (req, res) => {
//   const { visitDate, categories } = req.body;
//   /**
//    * categories input format:
//    * [
//    *   { category: "Pelajar", ticketCount: 369 },
//    *   { category: "Umum", ticketCount: 223 },
//    *   { category: "Asing", ticketCount: 19 },
//    *   { category: "Khusus", ticketCount: 0 }
//    * ]
//    */

//   try {
//     if (!visitDate || !categories) {
//       return sendResponse(
//         res,
//         400,
//         false,
//         "visitDate & categories are required"
//       );
//     }

//     // ambil harga tiket dari DB
//     const hargaTiketList = await HargaTiket.find();
//     const hargaMap = {};
//     hargaTiketList.forEach((h) => (hargaMap[h.category] = h.unitPrice));

//     let totalRevenue = 0;
//     let totalVisitor = 0;

//     // hitung revenue per kategori
//     const categoriesWithRevenue = categories.map((cat) => {
//       const unitPrice = hargaMap[cat.category] || 0;
//       const revenue = (cat.ticketCount || 0) * unitPrice;

//       totalRevenue += revenue;
//       totalVisitor += cat.ticketCount || 0;

//       return {
//         category: cat.category,
//         ticketCount: cat.ticketCount || 0,
//         revenue,
//       };
//     });

//     const report = new WeeklyReport({
//       visitDate,
//       categories: categoriesWithRevenue,
//       totalRevenue,
//       totalVisitor,
//     });

//     await report.save();

//     return sendResponse(res, 201, true, "Successfully created Weekly Report", {
//       report,
//     });
//   } catch (err) {
//     return sendResponse(res, 500, false, "Internal server error", null, {
//       detail: err.message,
//     });
//   }
// };

// // DELETE report
// export const deleteWeeklyReport = async (req, res) => {
//   try {
//     const report = await WeeklyReport.findById(req.params.id);
//     if (!report) {
//       return sendResponse(res, 404, false, "Weekly Report not found");
//     }

//     await report.deleteOne();
//     return sendResponse(res, 200, true, "Successfully deleted Weekly Report");
//   } catch (err) {
//     return sendResponse(res, 500, false, "Internal server error", null, {
//       detail: err.message,
//     });
//   }
// };

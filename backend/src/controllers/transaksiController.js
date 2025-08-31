import { TransaksiTiket } from "../models/TransaksiTiket.js";
import { sendResponse } from "../utils/response.js";

// GET semua transaksi + filter bulan/golongan/wilayah
export const getAllTransactions = async (req, res) => {
  try {
    const { bulan, tahun, golongan, provinsi, kabupaten_kota, kecamatan } =
      req.query;

    let filter = {};

    // Filter golongan
    if (golongan) filter.golongan = golongan;

    // Filter wilayah
    if (provinsi) filter.provinsi = provinsi;
    if (kabupaten_kota) filter.kabupaten_kota = kabupaten_kota;
    if (kecamatan) filter.kecamatan = kecamatan;

    // Filter bulan & tahun (pakai createdAt)
    if (bulan && tahun) {
      const startDate = new Date(`${tahun}-${bulan}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    const transaksi = await TransaksiTiket.find(filter).sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Berhasil mendapatkan transaksi", {
      total: transaksi.length,
      transaksi,
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

// GET Rekap Penjualan per Provinsi
export const getRekapPerProvinsi = async (req, res) => {
  try {
    const { tahun } = req.query;
    const tahunSekarang = tahun || new Date().getFullYear();

    const rekap = await TransaksiTiket.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${tahunSekarang}-01-01`),
            $lt: new Date(`${parseInt(tahunSekarang) + 1}-01-01`),
          },
          status_transaksi: "success",
        },
      },
      {
        $group: {
          _id: "$provinsi",
          totalTiket: { $sum: "$jumlah_personil" },
          totalPendapatan: { $sum: "$total_harga" },
        },
      },
      { $sort: { totalPendapatan: -1 } },
    ]);

    return sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan rekap per provinsi",
      {
        tahun: tahunSekarang,
        rekap,
      }
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

// GET transaksi by ID
export const getTransactionById = async (req, res) => {
  try {
    const transaksi = await TransaksiTiket.findById(req.params.id);

    if (!transaksi) {
      return sendResponse(res, 404, false, "Transaksi tidak ditemukan");
    }

    return sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan detail transaksi",
      {
        transaksi,
      }
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

// GET Rekap Penjualan per Bulan
export const getRekapPenjualan = async (req, res) => {
  try {
    const { tahun } = req.query;
    const tahunSekarang = tahun || new Date().getFullYear();

    // Aggregation MongoDB
    const rekap = await TransaksiTiket.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${tahunSekarang}-01-01`),
            $lt: new Date(`${parseInt(tahunSekarang) + 1}-01-01`),
          },
          status_transaksi: "success",
        },
      },
      {
        $group: {
          _id: { bulan: { $month: "$createdAt" }, golongan: "$golongan" },
          totalTiket: { $sum: "$jumlah" },
          totalPendapatan: { $sum: "$total_harga" },
        },
      },
      {
        $group: {
          _id: "$_id.bulan",
          golongan: {
            $push: {
              golongan: "$_id.golongan",
              totalTiket: "$totalTiket",
              totalPendapatan: "$totalPendapatan",
            },
          },
          totalTiketBulan: { $sum: "$totalTiket" },
          totalPendapatanBulan: { $sum: "$totalPendapatan" },
        },
      },
      { $sort: { _id: 1 } }, // urut berdasarkan bulan
    ]);

    return sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan rekap penjualan",
      {
        tahun: tahunSekarang,
        rekap,
      }
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

// GET Rekap Penjualan per Tahun
export const getRekapTahunan = async (req, res) => {
  try {
    const { tahun } = req.query;
    const tahunSekarang = tahun || new Date().getFullYear();

    const rekap = await TransaksiTiket.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${tahunSekarang}-01-01`),
            $lt: new Date(`${parseInt(tahunSekarang) + 1}-01-01`),
          },
          status_transaksi: "success",
        },
      },
      {
        $group: {
          _id: "$golongan",
          totalTiket: { $sum: "$jumlah" },
          totalPendapatan: { $sum: "$total_harga" },
        },
      },
      {
        $group: {
          _id: null,
          golongan: {
            $push: {
              golongan: "$_id",
              totalTiket: "$totalTiket",
              totalPendapatan: "$totalPendapatan",
            },
          },
          totalTiketTahun: { $sum: "$totalTiket" },
          totalPendapatanTahun: { $sum: "$totalPendapatan" },
        },
      },
    ]);

    return sendResponse(res, 200, true, "Berhasil mendapatkan rekap tahunan", {
      tahun: tahunSekarang,
      rekap:
        rekap.length > 0
          ? rekap[0]
          : {
              golongan: [],
              totalTiketTahun: 0,
              totalPendapatanTahun: 0,
            },
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

// DELETE transaksi (opsional)
export const deleteTransaction = async (req, res) => {
  try {
    const transaksi = await TransaksiTiket.findByIdAndDelete(req.params.id);

    if (!transaksi) {
      return sendResponse(res, 404, false, "Transaksi tidak ditemukan");
    }

    return sendResponse(res, 200, true, "Transaksi berhasil dihapus", {
      transaksi,
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

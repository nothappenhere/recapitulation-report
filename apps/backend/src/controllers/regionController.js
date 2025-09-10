import { sendResponse } from "../utils/response.js";
import { Region } from "../models/Region.js";

/**
 * * @desc Mendapatkan daftar seluruh provinsi di Indonesia
 * ? Endpoint ini mengambil data dari API eksternal: https://wilayah.id/api/provinces.json
 * @route GET /api/wilayah/provinces
 */
export const getProvinces = async (req, res) => {
  try {
    const provinces = await Region.find({ level: "province" }).sort({
      name: 1,
    });
    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan data Provinsi",
      provinces
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan daftar kabupaten/kota berdasarkan kode provinsi
 * ? Endpoint ini mengambil data dari: https://wilayah.id/api/regencies/{provinceCode}.json
 * @route GET /api/wilayah/regencies/:provinceCode
 * @param provinceCode - Kode dari provinsi
 */
export const getRegenciesOrCities = async (req, res) => {
  const { provinceCode } = req.params;
  try {
    const regencies = await Region.find({
      parentCode: provinceCode,
      level: "regency",
    }).sort({ name: 1 });
    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan data Kabupaten/Kota",
      regencies
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan daftar kecamatan berdasarkan kode kabupaten/kota
 * ? Data diambil dari: https://wilayah.id/api/districts/{provinceCode}.{regencyCode}.json
 * @route GET /api/wilayah/districts/:provinceCode/:regencyCode
 * @param provinceCode - Kode dari provinsi
 * @param regencyCode - Kode dari kabupaten/kota
 */
export const getDistricts = async (req, res) => {
  const { provinceCode, regencyCode } = req.params;
  const fullCode = `${provinceCode}.${regencyCode}`;
  try {
    const districts = await Region.find({
      parentCode: fullCode,
      level: "district",
    }).sort({ name: 1 });
    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan data Kecamatan",
      districts
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan daftar kelurahan/desa berdasarkan kode kecamatan
 * ? Mengambil data dari: https://wilayah.id/api/villages/{provinceCode}.{regencyCode}.{districtCode}.json
 * @route GET /api/wilayah/villages/:provinceCode/:regencyCode/:districtCode
 * @param provinceCode - Kode dari provinsi
 * @param regencyCode - Kode dari kabupaten/kota
 * @param districtCode - Kode dari kecamatan
 */
export const getVillages = async (req, res) => {
  const { provinceCode, regencyCode, districtCode } = req.params;
  const fullCode = `${provinceCode}.${regencyCode}.${districtCode}`;
  try {
    const villages = await Region.find({
      parentCode: fullCode,
      level: "village",
    }).sort({ name: 1 });
    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan data Desa/Kelurahan",
      villages
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

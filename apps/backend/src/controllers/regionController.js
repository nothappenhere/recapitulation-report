import { sendResponse } from "../utils/sendResponse.js";
import { Region } from "../models/Region.js";
import { Country } from "../models/Country.js";

/**
 * * @desc Mendapatkan seluruh data provinsi yang ada di Indonesia
 * @route GET /api/region/provinces
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
      "Berhasil mendapatkan semua data provinsi",
      provinces
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan data kabupaten atau kota dari provinsi
 * @route GET /api/region/regencies/:provinceCode
 * @param provinceCode - Kode Provinsi yang dicari
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
      "Berhasil mendapatkan semua data Kabupaten/Kota",
      regencies
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan data kecamatan dari kabupaten atau kota
 * @route GET /api/region/districts/:provinceCode/:regencyCode
 * @param provinceCode - Kode Provinsi yang dicari
 * @param regencyCode - Kode Kabupaten/kota yang dicari
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
      "Berhasil mendapatkan semua data Kecamatan",
      districts
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan data kelurahan atau desa dari kecamatan
 * @route GET /api/region/villages/:provinceCode/:regencyCode/:districtCode
 * @param provinceCode - Kode Provinsi yang dicari
 * @param regencyCode - Kode Kabupaten/kota yang dicari
 * @param districtCode - Kode Kecamatan yang dicari
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
      "Berhasil mendapatkan semua data Desa/Kelurahan",
      villages
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan seluruh data negara yang ada di dunia
 * @route GET /api/region/countries
 */
export const getCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({
      code: 1,
    });

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan semua data negara dunia",
      countries
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

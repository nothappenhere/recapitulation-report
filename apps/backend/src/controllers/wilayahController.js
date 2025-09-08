import axios from "axios";
import { sendError, sendResponse } from "../utils/response.js";

/**
 * * @desc Mendapatkan daftar seluruh provinsi di Indonesia
 * ? Endpoint ini mengambil data dari API eksternal: https://wilayah.id/api/provinces.json
 * @route GET /api/wilayah/provinces
 */
export const getProvinces = async (req, res) => {
  try {
    const response = await axios.get("https://wilayah.id/api/provinces.json");
    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan data Provinsi",
      response.data
    );
  } catch (err) {
    return sendError(res, err);
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
    const response = await axios.get(
      `https://wilayah.id/api/regencies/${provinceCode}.json`
    );
    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan data Kabupaten / Kota",
      response.data
    );
  } catch (err) {
    return sendError(req, err);
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
  const { provinceCode } = req.params;
  const { regencyCode } = req.params;

  try {
    const response = await axios.get(
      `https://wilayah.id/api/districts/${provinceCode}.${regencyCode}.json`
    );
    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan data Kecamatan",
      response.data
    );
  } catch (err) {
    return sendError(res, err);
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
  const { provinceCode } = req.params;
  const { regencyCode } = req.params;
  const { districtCode } = req.params;

  try {
    const response = await axios.get(
      `https://wilayah.id/api/villages/${provinceCode}.${regencyCode}.${districtCode}.json`
    );
    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan data Kelurahan / Desa",
      response.data
    );
  } catch (err) {
    return sendError(res, err);
  }
};

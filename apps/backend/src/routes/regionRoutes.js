import express from "express";
import {
  getProvinces,
  getRegenciesOrCities,
  getDistricts,
  getVillages,
  getCountries,
} from "../controllers/regionController.js";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data provinsi yang ada di Indonesia
 * @route GET /api/region/provinces
 */
router.get("/provinces", getProvinces);

/**
 * * @desc Mendapatkan data kabupaten atau kota dari provinsi
 * @route GET /api/region/regencies/:provinceCode
 * @param provinceCode - Kode Provinsi yang dicari
 */
router.get("/regencies/:provinceCode", getRegenciesOrCities);

/**
 * * @desc Mendapatkan data kecamatan dari kabupaten atau kota
 * @route GET /api/region/districts/:provinceCode/:regencyCode
 * @param provinceCode - Kode Provinsi yang dicari
 * @param regencyCode - Kode Kabupaten/kota yang dicari
 */
router.get("/districts/:provinceCode/:regencyCode", getDistricts);

/**
 * * @desc Mendapatkan data kelurahan atau desa dari kecamatan
 * @route GET /api/region/villages/:provinceCode/:regencyCode/:districtCode
 * @param provinceCode - Kode Provinsi yang dicari
 * @param regencyCode - Kode Kabupaten/kota yang dicari
 * @param districtCode - Kode Kecamatan yang dicari
 */
router.get("/villages/:provinceCode/:regencyCode/:districtCode", getVillages);

/**
 * * @desc Mendapatkan seluruh data negara yang ada di dunia
 * @route GET /api/region/countries
 */
router.get("/countries", getCountries);

export default router;

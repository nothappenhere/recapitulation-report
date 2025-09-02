import express from "express";
import {
  getProvinces,
  getRegenciesOrCities,
  getDistricts,
  getVillages,
} from "../controllers/wilayahController.js";

const router = express.Router();

// Mendapatkan data semua provinsi yang ada di Indonesia.
router.get("/provinces", getProvinces);

// Mendapatkan data kabupaten atau kota dari provinsi.
router.get("/regencies/:provinceCode", getRegenciesOrCities);

// Mendapatkan data kecamatan dari kabupaten atau kota.
router.get("/districts/:provinceCode/:regencyCode", getDistricts);

// Mendapatkan data kelurahan atau desa dari kecamatan.
router.get("/villages/:provinceCode/:regencyCode/:districtCode", getVillages);

export default router;

import express from "express";
import axios from "axios";

const router = express.Router();

// Get all provinces
router.get("/provinces", async (req, res) => {
  try {
    const response = await axios.get("https://wilayah.id/api/provinces.json");
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch provinces:", error.message);
    res.status(500).json({ error: "Failed to fetch provinces" });
  }
});

// Get regencies by province code
router.get("/regencies", async (req, res) => {
  try {
    const { provinceCode } = req.query;
    const response = await axios.get(
      `https://wilayah.id/api/regencies/${provinceCode}.json`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch regencies" });
  }
});

// Get districts by regency code
router.get("/districts", async (req, res) => {
  try {
    const { provinceCode } = req.query;
    const { regencyCode } = req.query;
    const response = await axios.get(
      `https://wilayah.id/api/districts/${provinceCode}.${regencyCode}.json`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch districts" });
  }
});

// Get villages by district code
router.get("/villages", async (req, res) => {
  try {
    const { provinceCode } = req.query;
    const { regencyCode } = req.query;
    const { districtCode } = req.query;
    const response = await axios.get(
      `https://wilayah.id/api/villages/${provinceCode}.${regencyCode}.${districtCode}.json`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch villages" });
  }
});

export default router;

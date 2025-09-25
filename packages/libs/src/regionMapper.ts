type Region = { code: string; name: string };

interface RegionData {
  provinces: Region[];
  regencies: Region[];
  districts: Region[];
  villages: Region[];
  countries: Region[];
}

interface RegionCodes {
  province?: string;
  regencyOrCity?: string;
  district?: string;
  village?: string;
  country?: string;
}

export function mapRegionNames(values: RegionCodes, data: RegionData) {
  const { provinces, regencies, districts, villages, countries } = data;

  return {
    provinceName:
      provinces.find((p) => p.code === values.province)?.name || "-",
    regencyName:
      regencies.find((r) => r.code === values.regencyOrCity)?.name || "-",
    districtName:
      districts.find((d) => d.code === values.district)?.name || "-",
    villageName: villages.find((v) => v.code === values.village)?.name || "-",
    countryName:
      countries.find((c) => c.name === values.country)?.name || "Indonesia",
  };
}

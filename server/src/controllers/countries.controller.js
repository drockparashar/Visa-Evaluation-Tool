import {
  COUNTRIES,
  getAllCountries,
  getCountryByCode,
} from "../config/countries.js";

class CountriesController {
  /**
   * Get all countries with basic info
   * GET /api/countries
   */
  async getAllCountries(req, res) {
    try {
      const countries = getAllCountries();

      res.status(200).json({
        success: true,
        count: countries.length,
        data: countries,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching countries",
        error: error.message,
      });
    }
  }

  /**
   * Get specific country with all visa types
   * GET /api/countries/:code
   */
  async getCountryByCode(req, res) {
    try {
      const { code } = req.params;
      const country = getCountryByCode(code.toUpperCase());

      if (!country) {
        return res.status(404).json({
          success: false,
          message: `Country with code ${code} not found`,
        });
      }

      res.status(200).json({
        success: true,
        data: country,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching country details",
        error: error.message,
      });
    }
  }

  /**
   * Get visa types for a specific country
   * GET /api/countries/:code/visa-types
   */
  async getVisaTypes(req, res) {
    try {
      const { code } = req.params;
      const country = getCountryByCode(code.toUpperCase());

      if (!country) {
        return res.status(404).json({
          success: false,
          message: `Country with code ${code} not found`,
        });
      }

      res.status(200).json({
        success: true,
        country: {
          code: country.code,
          name: country.name,
          flag: country.flag,
        },
        data: country.visaTypes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching visa types",
        error: error.message,
      });
    }
  }

  /**
   * Get specific visa type details
   * GET /api/countries/:code/visa-types/:visaId
   */
  async getVisaTypeById(req, res) {
    try {
      const { code, visaId } = req.params;
      const country = getCountryByCode(code.toUpperCase());

      if (!country) {
        return res.status(404).json({
          success: false,
          message: `Country with code ${code} not found`,
        });
      }

      const visaType = country.visaTypes.find((visa) => visa.id === visaId);

      if (!visaType) {
        return res.status(404).json({
          success: false,
          message: `Visa type ${visaId} not found for ${country.name}`,
        });
      }

      res.status(200).json({
        success: true,
        data: visaType,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching visa type details",
        error: error.message,
      });
    }
  }
}

export default new CountriesController();

import express from "express";
import countriesController from "../controllers/countries.controller.js";

const router = express.Router();

// Get all countries
router.get("/", countriesController.getAllCountries);

// Get specific country
router.get("/:code", countriesController.getCountryByCode);

// Get visa types for a country
router.get("/:code/visa-types", countriesController.getVisaTypes);

// Get specific visa type
router.get("/:code/visa-types/:visaId", countriesController.getVisaTypeById);

export default router;

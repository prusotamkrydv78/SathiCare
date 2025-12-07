import express from 'express';
import {
    findHospitals,
    findOrganizations,
    findPOIs,
    findHealthcare,
    getNearbyFacilities,
    getFacilityDetails
} from '../controllers/poiController.js';

const router = express.Router();

/**
 * @route   GET /api/poi/find
 * @desc    Find POIs by type (hospitals or organizations)
 * @query   type - hospitals | organizations
 * @access  Public
 */
router.get('/find', findPOIs);

/**
 * @route   GET /api/poi/hospitals
 * @desc    Get all hospitals in Janakpur
 * @access  Public
 */
router.get('/hospitals', findHospitals);

/**
 * @route   GET /api/poi/organizations
 * @desc    Get all organizations in Janakpur
 * @access  Public
 */
router.get('/organizations', findOrganizations);

/**
 * @route   GET /api/poi/healthcare
 * @desc    Get all healthcare facilities (hospitals, clinics, pharmacies, doctors)
 * @access  Public
 */
router.get('/healthcare', findHealthcare);

/**
 * @route   GET /api/poi/nearby
 * @desc    Get all nearby facilities (comprehensive endpoint for frontend)
 * @query   category - all | healthcare | organizations (default: all)
 * @query   limit - number of results to return (default: 50)
 * @access  Public
 */
router.get('/nearby', getNearbyFacilities);

/**
 * @route   GET /api/poi/details/:id
 * @desc    Get detailed information about a specific facility
 * @param   id - OSM element ID
 * @access  Public
 */
router.get('/details/:id', getFacilityDetails);

export default router;

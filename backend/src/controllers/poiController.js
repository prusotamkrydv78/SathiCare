import https from 'https';

/**
 * Query OpenStreetMap Overpass API for POIs (Points of Interest)
 * @param {string} overpassQuery - The Overpass QL query
 * @returns {Promise<Object>} - The JSON response from Overpass API
 */
const queryOverpassAPI = (overpassQuery) => {
    return new Promise((resolve, reject) => {
        const postData = `data=${encodeURIComponent(overpassQuery)}`;

        const options = {
            hostname: 'overpass-api.de',
            path: '/api/interpreter',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error('Failed to parse OSM response'));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
};

/**
 * Get nearby facilities - Comprehensive endpoint for frontend with radius search
 * GET /api/poi/nearby
 * Query params: 
 *   - category (all|healthcare|organizations)
 *   - limit (max results)
 *   - lat (latitude, default: Janakpur center)
 *   - lon (longitude, default: Janakpur center)
 *   - radius (in meters, default: 2000 = 2km)
 */
export const getNearbyFacilities = async (req, res) => {
    try {
        const {
            category = 'all',
            limit = 50,
            lat = 26.7288,  // Default to Janakpur center
            lon = 85.9244,
            radius = 2000   // Default 2km radius
        } = req.query;

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        const searchRadius = parseInt(radius);

        // Validate coordinates
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid latitude or longitude'
            });
        }

        let overpassQuery = '';

        // Use radius search around the given point
        if (category === 'healthcare' || category === 'all') {
            overpassQuery = `
                [out:json][timeout:25];
                (
                    node["amenity"="hospital"](around:${searchRadius},${latitude},${longitude});
                    way["amenity"="hospital"](around:${searchRadius},${latitude},${longitude});
                    node["amenity"="clinic"](around:${searchRadius},${latitude},${longitude});
                    way["amenity"="clinic"](around:${searchRadius},${latitude},${longitude});
                    node["amenity"="pharmacy"](around:${searchRadius},${latitude},${longitude});
                    way["amenity"="pharmacy"](around:${searchRadius},${latitude},${longitude});
                    node["amenity"="doctors"](around:${searchRadius},${latitude},${longitude});
                    way["amenity"="doctors"](around:${searchRadius},${latitude},${longitude});
                    ${category === 'all' ? `node["office"~"ngo|company|government|association|foundation"](around:${searchRadius},${latitude},${longitude});way["office"~"ngo|company|government|association|foundation"](around:${searchRadius},${latitude},${longitude});` : ''}
                );
                out center;
            `;
        } else if (category === 'organizations') {
            overpassQuery = `
                [out:json][timeout:25];
                (
                    node["office"~"ngo|company|government|association|foundation"](around:${searchRadius},${latitude},${longitude});
                    way["office"~"ngo|company|government|association|foundation"](around:${searchRadius},${latitude},${longitude});
                );
                out center;
            `;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid category. Use: all, healthcare, or organizations'
            });
        }

        const data = await queryOverpassAPI(overpassQuery);

        let facilities = data.elements.map(element => {
            const lat = element.lat || element.center?.lat;
            const lon = element.lon || element.center?.lon;
            const tags = element.tags || {};

            // Determine facility category
            let facilityCategory = 'other';
            let facilityType = 'unknown';

            if (tags.amenity) {
                facilityCategory = 'healthcare';
                facilityType = tags.amenity;
            } else if (tags.office) {
                facilityCategory = 'organization';
                facilityType = tags.office;
            }

            return {
                id: element.id,
                name: tags.name || `Unnamed ${facilityType}`,
                category: facilityCategory,
                type: facilityType,
                lat: lat,
                lon: lon,
                address: tags['addr:street'] || tags['addr:full'] || null,
                city: tags['addr:city'] || 'Janakpur',
                phone: tags.phone || tags['contact:phone'] || null,
                website: tags.website || tags['contact:website'] || null,
                email: tags.email || tags['contact:email'] || null,
                emergency: tags.emergency || null,
                beds: tags.beds || null,
                operator: tags.operator || null,
                opening_hours: tags.opening_hours || null,
                description: tags.description || null,
                hasName: !!tags.name  // Flag to identify if facility has a proper name
            };
        });

        // Calculate distance from search center using Haversine formula
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in km
        };

        // Add distance to each facility
        facilities = facilities.map(facility => ({
            ...facility,
            distance: calculateDistance(latitude, longitude, facility.lat, facility.lon)
        }));

        // Smart sorting: 
        // 1. Named facilities first (sorted by distance - nearest first)
        // 2. Unnamed facilities last (sorted by distance - nearest first)
        facilities.sort((a, b) => {
            // First priority: Named vs Unnamed
            if (a.hasName && !b.hasName) return -1;
            if (!a.hasName && b.hasName) return 1;

            // Second priority: Distance (nearest first)
            return a.distance - b.distance;
        });

        // Apply limit
        if (limit && !isNaN(limit)) {
            facilities = facilities.slice(0, parseInt(limit));
        }

        // Group by category for easier frontend consumption
        const grouped = {
            healthcare: facilities.filter(f => f.category === 'healthcare'),
            organizations: facilities.filter(f => f.category === 'organization')
        };

        res.json({
            success: true,
            location: {
                city: 'Janakpur',
                region: 'Madhesh Province',
                country: 'Nepal',
                coordinates: {
                    lat: latitude,
                    lon: longitude
                },
                searchRadius: `${searchRadius / 1000}km`
            },
            total: facilities.length,
            breakdown: {
                healthcare: grouped.healthcare.length,
                organizations: grouped.organizations.length
            },
            data: {
                all: facilities,
                healthcare: grouped.healthcare,
                organizations: grouped.organizations
            }
        });
    } catch (error) {
        console.error('Error fetching nearby facilities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching nearby facilities from OpenStreetMap',
            error: error.message
        });
    }
};

/**
 * Find hospitals - Simple endpoint
 * GET /api/poi/hospitals
 */
export const findHospitals = async (req, res) => {
    req.query.category = 'healthcare';
    return getNearbyFacilities(req, res);
};

/**
 * Find organizations - Simple endpoint
 * GET /api/poi/organizations
 */
export const findOrganizations = async (req, res) => {
    req.query.category = 'organizations';
    return getNearbyFacilities(req, res);
};

/**
 * Find healthcare facilities - Simple endpoint
 * GET /api/poi/healthcare
 */
export const findHealthcare = async (req, res) => {
    req.query.category = 'healthcare';
    return getNearbyFacilities(req, res);
};

/**
 * Find POIs by type
 * GET /api/poi/find?type=hospitals|organizations
 */
export const findPOIs = async (req, res) => {
    const { type } = req.query;

    if (!type) {
        return res.status(400).json({
            success: false,
            message: 'Please specify a type parameter (hospitals or organizations)'
        });
    }

    if (type === 'hospitals') {
        req.query.category = 'healthcare';
    } else if (type === 'organizations') {
        req.query.category = 'organizations';
    } else {
        return res.status(400).json({
            success: false,
            message: 'Invalid type. Use "hospitals" or "organizations"'
        });
    }

    return getNearbyFacilities(req, res);
};

/**
 * Get facility details by ID
 * GET /api/poi/details/:id
 */
export const getFacilityDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Facility ID is required'
            });
        }

        // Query OSM for specific element by ID
        const overpassQuery = `
            [out:json][timeout:25];
            (
                node(${id});
                way(${id});
                relation(${id});
            );
            out body;
            >;
            out skel qt;
        `;

        const data = await queryOverpassAPI(overpassQuery);

        if (!data.elements || data.elements.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Facility not found'
            });
        }

        const element = data.elements[0];
        const tags = element.tags || {};

        // Determine facility type and category
        let facilityCategory = 'other';
        let facilityType = 'unknown';

        if (tags.amenity) {
            facilityCategory = 'healthcare';
            facilityType = tags.amenity;
        } else if (tags.office) {
            facilityCategory = 'organization';
            facilityType = tags.office;
        }

        // Extract comprehensive details
        const facilityDetails = {
            id: element.id,
            name: tags.name || `Unnamed ${facilityType}`,
            category: facilityCategory,
            type: facilityType,

            // Location
            location: {
                lat: element.lat || element.center?.lat,
                lon: element.lon || element.center?.lon,
                address: {
                    street: tags['addr:street'] || null,
                    housenumber: tags['addr:housenumber'] || null,
                    postcode: tags['addr:postcode'] || null,
                    city: tags['addr:city'] || 'Janakpur',
                    district: tags['addr:district'] || 'Dhanusha',
                    province: tags['addr:province'] || 'Madhesh',
                    country: tags['addr:country'] || 'Nepal',
                    full: tags['addr:full'] || null
                }
            },

            // Contact Information
            contact: {
                phone: tags.phone || tags['contact:phone'] || null,
                mobile: tags['contact:mobile'] || null,
                email: tags.email || tags['contact:email'] || null,
                website: tags.website || tags['contact:website'] || null,
                facebook: tags['contact:facebook'] || null,
                twitter: tags['contact:twitter'] || null
            },

            // Healthcare specific
            healthcare: facilityCategory === 'healthcare' ? {
                emergency: tags.emergency || null,
                beds: tags.beds ? parseInt(tags.beds) : null,
                operator: tags.operator || null,
                operatorType: tags['operator:type'] || null,
                healthcare: tags.healthcare || null,
                speciality: tags.speciality || tags.specialty || null,
                services: []
            } : null,

            // Operating hours
            hours: {
                opening_hours: tags.opening_hours || null,
                description: tags['opening_hours:description'] || null
            },

            // Additional information
            info: {
                description: tags.description || null,
                wheelchair: tags.wheelchair || null,
                internet_access: tags.internet_access || null,
                parking: tags.parking || null,
                fee: tags.fee || null,
                payment: {
                    cash: tags['payment:cash'] || null,
                    cards: tags['payment:cards'] || null,
                    mobile: tags['payment:mobile_money'] || null
                }
            },

            // Metadata
            metadata: {
                source: 'OpenStreetMap',
                osmType: element.type,
                lastUpdated: element.timestamp || null,
                version: element.version || null
            }
        };

        res.json({
            success: true,
            data: facilityDetails
        });

    } catch (error) {
        console.error('Error fetching facility details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching facility details',
            error: error.message
        });
    }
};
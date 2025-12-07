
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

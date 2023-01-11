const Zona = require('../models/zona');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// POST create new zone
// Body: coordinates, contenitori_rifiuti
const createZone = (req, res) => {
    // Coordinates: array of coordinates
    // Contenitori_rifiuti: array of coordinates
    // Coordinate: {LAT: 0, LON: 0, ALT: 0}
    const coordinates = req.body.regione;
    const contenitori_rifiuti = req.body.contenitori_rifiuti;

    // handle bad request
    if (!coordinates || !contenitori_rifiuti) {
        res.status(400).json({success: false, message: 'Bad request, missing parameters'});
        return;
    }

    console.log("Creating new zone...");

    // Create new zone
    const newZone = new Zona({
        regione: coordinates,
        contenitori_rifiuti: contenitori_rifiuti
    });

    // Save new zone
    newZone.save((err, zone) => {
        if (err) {
            console.log(err);
            res.status(500).json({success: false, message: 'Internal server error: ' + err});
        } else {
            res.status(201).json({success: true, message: 'Zone created successfully', zone: zone});
        }
    });
};

// GET zone position
// Params: id
const getZonePosition = (req, res) => {
    const id = req.params.id;

    // handle bad request
    if (!id) {
        res.status(400).json({success: false, message: 'Bad request'});
        return;
    }

    console.log("Getting zone position...");

    // Find zone
    Zona.findOne({ ID_zona: id }, (err, zone) => {
        if (err) {
            res.status(500).json({success: false, message: 'Internal server error: ' + err});
            return;
        } else if (!zone) {
            res.status(404).json({success: false, message: 'Zone not found'});
            return;
        }

        // Get zone region
        const position = zone.regione;
        res.status(200).json({success: true, message: 'Zone position retrieved successfully', region: position});
    });
};

// GET zone contenitori_rifiuti
// Params: id
const getZoneContainers = (req, res) => {
    const id = req.params.id;

    // handle bad request
    if (!id) {
        res.status(400).json({success: false, message: 'Bad request'});
        return;
    }

    console.log("Getting zone contenitori_rifiuti...");

    // Find zone
    Zona.findOne({ ID_zona: id }, (err, zone) => {
        if (err) {
            res.status(500).json({success: false, message: 'Internal server error: ' + err});
            return;
        } else if (!zone) {
            res.status(404).json({success: false, message: 'Zone not found'});
            return;
        }

        // Get containers
        const containers = zone.contenitori_rifiuti;
        res.status(200).json({success: true, message: 'Zone containers retrieved successfully', contenitori_rifiuti: containers});
    });
};



//export controller functions
module.exports = {
    createZone: createZone,
    getZonePosition: getZonePosition,
    getZoneContainers: getZoneContainers,
};
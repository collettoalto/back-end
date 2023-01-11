const Piano_pulizia = require('../models/piano_pulizia');
const Organizzazione = require('../models/organisation');
const Robot = require('../models/robot');
// newPiano_pulizia function for post Piano_pulizia route
//POST Piano_pulizia
const createPianoPulizia = (req, res) => {
    let user = req.loggedUser;

    const { id_zona, data_inizio, data_fine, nome_organizzazione } = req.body;
    if (id_zona == null || data_inizio == null || data_fine == null || nome_organizzazione == null) {
        return res.status(400).json({ Error: "Bad request: missing parameters" });
    }

    // convert data_inizio and data_fine to Date objects from timestamp
    const data_inizio_date = new Date(data_inizio);
    const data_fine_date = new Date(data_fine);

    // check if data_inizio and data_fine are valid dates
    if (isNaN(data_inizio_date.getTime()) || isNaN(data_fine_date.getTime())) {
        return res.status(400).json({ Error: "Bad request: invalid date" });
    }

    // check if data_inizio is before data_fine
    if (data_inizio_date.getTime() >= data_fine_date.getTime()) {
        return res.status(400).json({ Error: "Bad request: start date must be before end date" });
    }

    // check if data_inizio is in the future
    if (data_inizio_date.getTime() < Date.now()) {
        return res.status(400).json({ Error: "Bad request: start date must be in the future" });
    }

    // create a new Piano_pulizia object using the Piano_pulizia model and req.body
    const newPiano_pulizia = new Piano_pulizia({
        ID_zona: id_zona,
        data_inizio: data_inizio_date,
        data_fine: data_fine_date,
        nome_organizzazione: nome_organizzazione,
        ID_robot: ""
    });

    // save this object to database
    newPiano_pulizia.save((err, data) => {
        if (err) return res.status(500).json({ Error: "Internal server error: " + err });
        return res.status(201).json(data);
    })
};

// GET list of piano_pulizia list
// Query parameters: ?nome_org=nome_org
const getPianoPuliziaList = (req, res) => {
    const nome_organizzazione = req.query.nome_org;

    if (!nome_organizzazione) {
        return res.status(400).json({ Error: "Bad request: missing parameters" });
    }

    // check if organization exists
    Organizzazione.find({ name: nome_organizzazione }, (err, data) => {
        if (err) {
            return res.status(500).json({ Error: "Internal server error: " + err });
        }

        if (data.length == 0) {
            return res.status(404).json({ Error: "Organization not found" });
        }

        Piano_pulizia.find({ nome_organizzazione: nome_organizzazione }, (err, data) => {
            if (err) {
                return res.status(500).json({ Error: "Internal server error: " + err });
            }
    
            if (data.length === 0) {
                return res.status(404).json({ Error: "Plan not found" });
            }
    
            // return the list of ids of piano_pulizia
            ids = data.map((piano_pulizia) => {
                return piano_pulizia._id;
            });
    
            return res.status(200).json(ids);
        });
    });
};

// GET piano_pulizia by id
// Params: id
const getPianoPuliziaInfoForOrg = (req, res) => {
    const id = req.params.id;

    Piano_pulizia.findById(id, (err , data) => {
        if (err) {
            return res.status(500).json({ Error: "Internal server error: " + err });
        }

        if (!data) {
            return res.status(404).json({ Error: "Not found" });
        }

        return res.status(200).json(data);
    });
};

// GET piano_pulizia (request from robot)
const getPianoPuliziaInfoForRobot = (req, res) => {
    let robot = req.loggedUser;
    let robot_id = robot.id;

    Piano_pulizia.findOne({ ID_robot: robot_id }, (err, data) => {
        if (err) {
            return res.status(500).json({ Error: "Internal server error: " + err });
        }

        if (!data) {
            return res.status(404).json({ Error: "Plan not found" });
        }
        else if (data.length === 0) {
            return res.status(404).json({ Error: "Plan not found" });
        }

        return res.status(200).json(data);
    });
};

// PATCH piano_pulizia (request from robot)
const assegnaPianoPulizia = (req, res) => {
    let robot = req.loggedUser;

    Robot.findById(robot.id, (err, robot_data) => {
        if (err) {
            return res.status(500).json({ Error: "Internal server error: " + err });
        }

        if (!robot_data) {
            return res.status(404).json({ Error: "Robot not found" });
        }

        console.log(robot_data)
        // find the piano_pulizia with the closest data_inizio
        Piano_pulizia.aggregate([
            { $match: { nome_organizzazione: robot_data.nome_organizzazione } },
            { $sort: { data_inizio: 1 } },
            { $limit: 1 }
        ], (err, pp_data) => {
            if (err) {
                return res.status(500).json({ Error: "Internal server error: " + err });
            }

            console.log(pp_data)

            plan = pp_data[0];

            if (!plan) {
                return res.status(404).json({ Error: "Plan not found" });
            }

            // check if plan is already assigned to a robot
            if (plan.ID_robot != "") {
                return res.status(409).json({ Error: "Plan already assigned to a robot" });
            }

            // update the piano_pulizia with the id_robot
            Piano_pulizia.findByIdAndUpdate(plan._id, { ID_robot: robot_data._id }, {new: true}, (err, data) => {
                if (err) {
                    return res.status(500).json({ Error: "Internal server error: " + err });
                }

                if (data.length === 0) {
                    return res.status(404).json({ Error: "Plan not found" });
                }

                return res.status(200).json(data);
            });
        });
    });
};

//export controller functions
module.exports = {
    createPianoPulizia,
    getPianoPuliziaList,
    getPianoPuliziaInfoForOrg,
    getPianoPuliziaInfoForRobot,
    assegnaPianoPulizia   
};
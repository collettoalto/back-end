const Organisation = require('../models/organisation');
const Robot = require('../models/robot');
const User = require('../models/utente');
// newOrganisation function for post organisation route
//POST organisation
const newOrganisation = (req, res) => {
    user = req.loggedUser;

	if (!user) {
		res.status(401).json({ success: false, message: 'Unauthorized.' });
		return;
	}

    // check if parameters are empty, if so return 400 error
    if (!req.body.name || !req.body.employee_num) {
        res.status(400).json({ message: "Bad request, missing parameters" });
        return;
    }

    //check if the organisation name already exists in db
    Organisation.findOne({ name: req.body.name }, (err, data) => {
        //if organisation not in db, add it
        if (!data) {
            // add organisation name to user in the db
            User.findOneAndUpdate({ username: user.username }, { $push: { nomi_organizzazioni: req.body.name } }, (err, data) => {
                if (err) {
                    res.status(500).json({ Error: err });
                    return;
                }
            });

            //create a new organisation object using the Organisation model and req.body
            const newOrganisation = new Organisation({
                name: req.body.name,
                employee_num: req.body.employee_num,
            })

            console.log("Creating new organisation: ", newOrganisation);

            // save this object to database
            newOrganisation.save((err, data) => {
                if (err) {
                    res.status(500).json({ Error: err });
                    return;
                }
                res.status(201).json({ message: "Organisation created", data: data });
            })
            //if there's an error or the organisation is in db, return a message         
        } else {
            if (err) {
                res.status(500).json({ Error: err });
                return;
            }
            
            res.status(409).json({ message: "Organisation already exists" });
        }
    })
};


//GET organisation by name
const getOrganisation = (req, res) => {
    console.log("Getting organisation: ", req.params.name);
    
    Organisation.findOne({ name: req.params.name }, (err, data) => {
        if (err) {
            res.status(500).json({ Error: err });
            return;
        }
        if (data) {
            return res.status(200).json({ message: "Organisation found", data: data });
        } else {
            // if organisation not found return 404 error
            return res.status(404).json({ message: "Organisation not found" });
        }
    })
};

//DELETE organisation by name
const deleteOrganisation = (req, res) => {
    console.log("Deleting organisation: ", req.params.name);

    Organisation.findOneAndDelete({ name: req.params.name }, (err, data) => {
        if (err) {
            res.status(500).json({ Error: err });
            return;
        }
        if (data) {
            // delete organisation name from user in the db
            User.findOneAndUpdate({ username: req.loggedUser.username }, { $pull: { nomi_organizzazioni: req.params.name } }, (err, data) => {
                if (err) {
                    res.status(500).json({ Error: err });
                    return;
                }
            });

            return res.status(204).json({ message: "Organisation deleted" });
        } else {
            // if organisation not found return 404 error
            return res.status(404).json({ message: "Organisation not found" });
        }
    })
};

//GET all robots
// Body: nome_organizzazione, filtro
// TODO: return only robots' id
const getAllRobots = (req, res) => {
    // check if parameters are missing, if so return bad request
    const nome_organizzazione = req.params.name;
    const filtro = req.body.filtro;
    // filtro esempio -> { "capienza_attuale": { ">": 0 } }
    //                   { "capienza_attuale": { ">": 0 }, "temperatura": { "<": 30 } }
    //                   { "batteria": { ">": 50 }, "temperatura": { ">": 30 } }
    //                   { "batteria": { ">": 50 }, "temperatura": { ">": 30 }, "capienza_attuale": { "=": 0 } }
    //                   { "batteria": { ">": 50 }, "temperatura": { "=!": 30 }, "capienza_attuale": { "<": 20 } }

    // check that the organisation exists
    Organisation.findOne({ name: nome_organizzazione }, (err, data) => {
        if (err) {
            res.status(500).json({ message: "Internal server error: " + err });
            return;
        }
        if (!data) {
            res.status(404).json({ message: "Organisation not found" });
            return;
        }

        Robot.find({ nome_organizzazione: nome_organizzazione }, (err, data) => {
            if (err) {
                res.status(500).json({ message: "Internal server error: " + err });
                return;
            }
            if (data.length == 0) {
                res.status(200).json([]);
                return;
            }
            // check if filter is empty
            if (!filtro) {
                // return only robots' id
                data = data.map(robot => robot["_id"]);
                res.status(200).json(data);
                return;
            }
            // filter is not empty, filter robots
            let filteredRobots = [];
            data.forEach(robot => {
                let toAdd = true;
                Object.keys(filtro).forEach(key => {
                    if (toAdd) {
                        if (filtro[key]["="] != undefined && (robot[key] != filtro[key]["="])) {
                            toAdd = false;
                        }
                        if (filtro[key]["!="] != undefined && (robot[key] == filtro[key]["!="])) {
                            toAdd = false;
                        }
                        if (filtro[key][">"] != undefined && (robot[key] <= filtro[key][">"])) {
                            toAdd = false;
                        }
                        if (filtro[key]["<"] != undefined && (robot[key] >= filtro[key]["<"])) {
                            toAdd = false;
                        }
                    }
                });
                if (toAdd) {
                    filteredRobots.push(robot["_id"]);
                }
            });
            return res.status(200).json(filteredRobots);
        });
    });
};

const addRobotToOrganisation = (req, res) => {
    // check if parameters are missing, if so return bad request
    const nome_organizzazione = req.params.name;
    const id_robot = req.query.id_robot;

    if (!id_robot) {
        res.status(400).json({ message: "Bad Request: Missing parameters" });
        return;
    }

    // check if organisation exists
    Organisation.findOne({ name: nome_organizzazione }, (err, data) => {
        if (err) {
            res.status(500).json({ message: "Internal server error: " + err });
            return;
        }
        if (!data) {
            res.status(404).json({ message: "Organisation not found" });
            return;
        }
        // check if robot exists
        Robot.findOne({ _id: id_robot }, (err, data) => {
            if (err) {
                res.status(500).json({ message: "Internal server error: " + err });
                return;
            }
            if (!data) {
                res.status(404).json({ message: "Robot not found" });
                return;
            }
            // check if robot is already in an organisation
            if (data.nome_organizzazione != "") {
                res.status(409).json({ message: "Robot already in an organisation" });
                return;
            }
            // add robot to organisation
            Robot.findOneAndUpdate({ _id: id_robot }, { nome_organizzazione: nome_organizzazione }, (err, data) => {
                if (err) {
                    res.status(500).json({ message: "Internal server error: " + err });
                    return;
                }
                return res.status(200).json({ message: "Robot added to organisation" });
            });
        });
    });
};



//export controller functions
module.exports = {
    newOrganisation,
    getOrganisation,
    deleteOrganisation,
    getAllRobots,
    addRobotToOrganisation
};
const Robot = require('../models/robot');
const User = require('../models/utente');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
//const { ObjectId } = require('mongodb');


// POST create new robot
// Body: capienza_attuale
const createRobot = (req, res) => {
    let user = req.loggedUser;
    const capienza_attuale = req.body.capienza_attuale;

    // check that all parameters are present
    if (!capienza_attuale) {
        return res.status(400).json({ Error: "Bad request, missing parameters" });
    }

    // check that the user has the role of "Admin"
    User.findOne({username: user.username}).then((data) => {
        if (!data) {
            return res.status(404).json({ Error: "User not found" });
        }
        if (data.ruolo != "admin") {
            return res.status(403).json({ Error: "Forbidden" });
        }

        const newRobot = new Robot({
            nome_organizzazione: "",
            capienza_attuale: capienza_attuale,
            temperatura: 0,
            batteria: 100,
            posizione: {
                LAT: 0,
                LON: 0,
                ALT: 0
            }
        });
    
        console.log("Creating new robot with id: " + newRobot._id)
    
        var payload = {
            id: newRobot._id,
            nome_organizzazione: newRobot.nome_organizzazione
        };
    
        var token = jwt.sign(payload, process.env.SUPER_SECRET);
    
        newRobot.save().then((data) => {
            return res.status(201).json({ id: data._id, token: token });
        }).catch((err) => {
            return res.status(500).json({ Error: "Internal server error: " + err });
        });
    }).catch((err) => {
        return res.status(500).json({ Error: "Internal server error: " + err });
    });
};
// GET robot by id
const getRobotById = (req, res) => {
    let user = req.loggedUser;
    const id = req.params.id;

    console.log("Getting robot with id: " + id)
    console.log("User: " + user.username)
    // Get the robot with the specified id and check taht the user belongs to the organization of the robot
    User.findOne({ username: user.username }).then((user_data) => {
        if (!user_data) {
            return res.status(404).json({ Error: "User not found" });
        }
    
        Robot.findById(id).then((robot_data) => {
            if (!robot_data) {
                return res.status(404).json({ Error: "Robot not found" });
            }
            // Check if the robot organization is inside the list of the user organizations
            if (!user_data.nomi_organizzazioni.includes(robot_data.nome_organizzazione)) {
                return res.status(403).json({ Error: "Forbidden" });
            }
            else {
                return res.status(200).json(robot_data);
            }
        }).catch((err) => {
            return res.status(500).json({ Error: "Internal server error: " + err });
        });
    }).catch((err) => {
        return res.status(500).json({ Error: "Internal server error: " + err });
    });
};

// PUT update robot parameters by id
const updateRobot = (req, res) => {
    let robot = req.loggedUser;
    const id = robot.id;

    // check that all parameters are present
    if (req.body.capienza_attuale == null || req.body.temperatura == null || req.body.batteria == null || !req.body.posizione) {
        return res.status(400).json({ Error: "Bad request, missing parameters" });
    }

    Robot.findByIdAndUpdate(id, {
        "capienza_attuale": req.body.capienza_attuale,
        "temperatura": req.body.temperatura,
        "batteria": req.body.batteria,
        "posizione": req.body.posizione,
    }, { new: true }
    ).then((data) => {
        if (!data) {
            return res.status(404).json({ Error: "Robot not found" });
        }
        return res.status(200).json(data);
    }
    ).catch((err) => {
        return res.status(500).json({ Error: "Internal server error: " + err });
    })
};


//export controller functions
module.exports = {
    getRobotById,
    updateRobot,
    createRobot
};
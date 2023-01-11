const Rifiuto = require('../models/rifiuto');
const Robot = require('../models/robot');
const PianoPulizia = require('../models/piano_pulizia');
const classify_API_URL = "http://chriven321.pythonanywhere.com/"
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// POST riconoscimento rifiuto
const riconoscimentoRifiuto = (req, res) => {
    let robot = req.loggedUser;

    console.log("Body")

    const url_foto = req.body.URL_foto;
    const posizione = req.body.posizione;

    if (url_foto == null || posizione == null) {
        return res.status(400).json({ message: "Bad Request: Missing parameters" });
    }
    /*
    let classification = "Non riconosciuto";
        // The output is a text like this "[...] Prediction: <prediction> [...]"
        // Extract the <prediction> substring
        //let classification = output.substring(output.indexOf("Prediction: ") + 12, output.substring(output.indexOf("Prediction: ") + 12).indexOf("\n"));
        console.log(classification);
        if (classification == "Non riconosciuto") {
            // Get the zone where the trash is located (use the robot id to get the piano_pulizia, then the zone)
            Robot.findById(robot.id, (err, robot_data) => {
                if (err) {
                    return res.status(500).json({ message: "Internal server error:" + err });
                }
                if (!robot_data) {
                    return res.status(404).json({ message: "Robot not found" });
                }
                PianoPulizia.findOne({ID_robot: robot_data._id}, (err, pp_data) => {
                    if (err) {
                        return res.status(500).json({ message: "Internal server error:" + err });
                    }
                    if (!pp_data) {
                        return res.status(404).json({ message: "Piano pulizia not found" });
                    }

                    // Create a new Rifiuto object
                    const newRifiuto = new Rifiuto({
                        URL_foto: url_foto,
                        posizione: posizione,
                        id_zona: pp_data.ID_zona,
                        classificazione: classification
                    });
                    // Save the new Rifiuto object in the database
                    newRifiuto.save((err, data) => {
                        if (err) {
                            return res.status(500).json({ message: "Internal server error:" + err });
                        }
                        return res.status(201).json(data);
                    });
                });
            });
        }*/

    fetch(classify_API_URL + '?' + new URLSearchParams({url: url_foto}), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status == 200) {
            return response.json();
        }
        else {
            return res.status(500).json({ message: "Internal server error:" + err });
        }
    }).then(data => {
        let classification = data.prediction;
        // The output is a text like this "[...] Prediction: <prediction> [...]"
        // Extract the <prediction> substring
        //let classification = output.substring(output.indexOf("Prediction: ") + 12, output.substring(output.indexOf("Prediction: ") + 12).indexOf("\n"));
        console.log(classification);
        if (classification == "Non riconosciuto") {
            // Get the zone where the trash is located (use the robot id to get the piano_pulizia, then the zone)
            Robot.findById(robot.id, (err, robot_data) => {
                if (err) {
                    return res.status(500).json({ message: "Internal server error:" + err });
                }
                if (!robot_data) {
                    return res.status(404).json({ message: "Robot not found" });
                }
                PianoPulizia.findOne({ID_robot: robot_data._id}, (err, pp_data) => {
                    if (err) {
                        return res.status(500).json({ message: "Internal server error:" + err });
                    }
                    if (!pp_data) {
                        return res.status(404).json({ message: "Piano pulizia not found" });
                    }

                    // Create a new Rifiuto object
                    const newRifiuto = new Rifiuto({
                        URL_foto: url_foto,
                        posizione: posizione,
                        id_zona: pp_data.ID_zona,
                        classificazione: classification
                    });
                    // Save the new Rifiuto object in the database
                    newRifiuto.save((err, data) => {
                        if (err) {
                            return res.status(500).json({ message: "Internal server error:" + err });
                        }
                        return res.status(201).json(data);
                    });
                });
            });
        }
        else {
            // return the classification
            return res.status(200).json(classification);
        }
        
    }).catch(err => {
        return res.status(500).json({ message: "Internal server error:" + err });
    });
};
// GET rifiuto by id
const getDettagliRifiuto = (req, res) => {
    let robot = req.loggedUser;

    Robot.findById(robot.id, (err, robot_data) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error:" + err });
        }
        if (!robot_data) {
            return res.status(404).json({ message: "Robot not found" });
        }
        PianoPulizia.findOne({ID_robot: robot_data._id}, (err, pp_data) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error:" + err });
            }
            if (!pp_data) {
                return res.status(404).json({ message: "Piano pulizia not found" });
            }

            Rifiuto.find({id_zona: pp_data.ID_zona}, (err, data) => {
                if (err) {
                    return res.status(500).json({ message: "Internal server error:" + err });
                }
                if (!data) {
                    return res.status(404).json({ message: "Rifiuto not found" });
                }
                return res.status(200).json(data);
            });
        });
    });
};

// GET trash to collect
// Query parameters: id_zona
const getTrashToCollect = (req, res) => {
    let robot = req.loggedUser;

    Robot.findById(robot.id, (err, robot_data) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error:" + err });
        }
        if (!robot_data) {
            return res.status(404).json({ message: "Robot not found" });
        }
        PianoPulizia.findOne({ID_robot: robot_data._id}, (err, pp_data) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error:" + err });
            }
            if (!pp_data) {
                return res.status(404).json({ message: "Piano pulizia not found" });
            }

            Rifiuto.find({id_zona: pp_data.ID_zona, classificazione: {$ne: "Non riconosciuto"}}, (err, data) => {
                if (err) {
                    return res.status(500).json({ message: "Internal server error:" + err });
                }
                if (!data) {
                    return res.status(404).json({ message: "Rifiuto not found" });
                }
                return res.json(data);
            });
        });
    });
};

// GET trash to classify
// Query parameters: id_zona
const getTrashToClassify = (req, res) => {
    let id_zona = req.query.id_zona;

    if (!id_zona) {
        return res.status(400).json({ message: "Missing id_zona parameter" });
    }

    Rifiuto.find({id_zona: id_zona, classificazione: "Non riconosciuto"}, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error:" + err });
        }
        if (!data) {
            return res.status(404).json({ message: "Rifiuto not found" });
        }
        // Make sure the data is returned as an array
        if (!Array.isArray(data)) {
            data = [data];
        }
        console.log(data);
        return res.status(200).json(data);
    });
};

// DELETE rifiuto by id
const deleteRifiuto = (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: "Missing id parameter" });
    }

    Rifiuto.findByIdAndDelete(id, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error:" + err });
        }
        if (!data) {
            return res.status(404).json({ message: "Rifiuto not found" });
        }
        return res.status(204).json(data);
    })
};

// PATCH classifica rifiuto by id
const classificaRifiuto = (req, res) => {
    const id = req.params.id;
    const classificazione = req.body.classificazione;

    if (!id || !classificazione) {
        return res.status(400).json({ message: "Missing id or classificazione parameter" });
    }

    Rifiuto.findByIdAndUpdate(id, { classificazione: classificazione }, {new: true}, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error:" + err });
        }
        if (!data) {
            return res.status(404).json({ message: "Rifiuto not found" });
        }
        return res.status(200).json(data);
    })
};


//export controller functions
module.exports = {
    getDettagliRifiuto,
    deleteRifiuto,
    classificaRifiuto,
    riconoscimentoRifiuto,
    getTrashToCollect,
    getTrashToClassify
};
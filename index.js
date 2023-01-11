const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const app = express();
const cors = require('cors');
const swaggerDocument = require('./swagger.json');
const path = require('path');

const utente_route = require('./routes/utente'); // import the routes
const org_route = require('./routes/organisation'); // import the routes
const piano_route = require('./routes/piano_pulizia'); // import the routes
const rifiuto_route = require('./routes/rifiuto'); // import the routes
const robot_route = require('./routes/robot'); // import the routes
const zona_route = require('./routes/zona'); // import the routes


app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', express.static('node_modules/swagger-ui-dist/', {index: false}), swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(cors())

app.use('/', utente_route); //to use the routes
app.use('/', org_route); //to use the routes
app.use('/', piano_route); //to use the routes
app.use('/', rifiuto_route); //to use the routes
app.use('/', robot_route); //to use the routes
app.use('/', zona_route); //to use the routes


/* Default 404 handler */
app.use((req, res,) => {
    res.status(404);
    res.json({ error: 'Error 404: Not Found' });
});


mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);

if (process.env.TESTING == 'true') {
    console.log("TESTING MODE");
} else {
    const listener = app.listen(process.env.PORT || 3000, () => {
        console.log('Your app is listening on port ' + listener.address().port)
    })
}

module.exports = app;


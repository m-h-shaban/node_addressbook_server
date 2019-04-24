const express = require("express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const { PORT, ENV } = require("./config/config");

const firebase = require("firebase");
const firebase_config = require("./config/firebase");

const app = express();

firebase.initializeApp(firebase_config);

// Middlewares
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());


var swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1/users", require("./routes/user.route"));
app.use("/api/v1/addressbooks", require("./routes/addressbook.route"));

app.listen(PORT, () => {
  console.log(
    `Server set up and running on port number: ${PORT}, environment: ${ENV}`
  );
});

const express = require("express");
require('dotenv').config()
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const serverless = require("serverless-http");
const path = require("path");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const SwaggerDoc = require('./swagger.json')

app.use(cors());


if(process.env.ENVIRONMENT !== "devr"){
    app.use((req, res, next) => {
    console.log('eventT', req);
    console.log('event2',  req.apiGateway.event);
    console.log('event3',JSON.stringify(req.apiGateway.event, null, 2));
    next();
    })
}

app.use(express.static("storage"));

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3001;

app.use("/api/v1", require("./routes/index.js"));
app.use("/api/v1/auth", require("./routes/auth"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(SwaggerDoc));

app.listen(port, () => {
    console.log("Server on Port " + port);
});



module.exports.handler = serverless(app);

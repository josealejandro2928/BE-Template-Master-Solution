const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(morgan('dev'));

const { sequelize } = require('./model')
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

const { errorHandler } = require('./common');
///////////////////ROUTING///////////////////////
const ContractRouting = require("./routes/contract/index");
const JobRouting = require("./routes/job/index");
const BalanceRouting = require("./routes/balances/index");
const AdminRouting = require("./routes/admin/index");

app.use("/contracts", ContractRouting);
app.use("/jobs", JobRouting);
app.use("/balances", BalanceRouting);
app.use("/admin", AdminRouting);


app.use((err, req, res, next) => {
    // console.log(err.stack)
    return errorHandler(err, req, res, next);
})

app.get('*', function (req, res) {
    res.status(404).send("This route does not exist");
});
module.exports = app;

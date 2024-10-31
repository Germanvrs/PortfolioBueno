const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

const mongoUrl = "mongodb://127.0.0.1:27017/f1";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });


const teamSchema = new mongoose.Schema({
    id: Number,
    name: String,
    nationality: String,
    url: String,
});
teamSchema.set("strictQuery", true);

const driverSchema = new mongoose.Schema({
    num: Number,
    code: String,
    forename: String,
    surname: String,
    dob: Date,
    nationality: String,
    url: String,
    team: teamSchema,
});
driverSchema.set("strictQuery", true);

const Team = mongoose.model("Team", teamSchema);
const Driver = mongoose.model("Driver", driverSchema);

let countries = [
    { code: "ENG", label: "England" },
    { code: "SPA", label: "Spain" },
    { code: "GER", label: "Germany" },
    { code: "FRA", label: "France" },
    { code: "MEX", label: "Mexico" },
    { code: "AUS", label: "Australia" },
    { code: "FIN", label: "Finland" },
    { code: "NET", label: "Netherlands" },
    { code: "CAN", label: "Canada" },
    { code: "MON", label: "Monaco" },
    { code: "THA", label: "Thailand" },
    { code: "JAP", label: "Japan" },
    { code: "CHI", label: "China" },
    { code: "USA", label: "USA" },
    { code: "DEN", label: "Denmark" },
];

app.get("/", async (req, res) => {
    try {
        const drivers = await Driver.find();
        const teams = await Team.find(); 
        res.render("index", { countries, drivers, teams });
    } catch (error) {
        res.status(500).send("Error retrieving data");
    }
});


const loadDataFromCSV = () => {
    fs.createReadStream('public/data/f1_2023.csv')
        .pipe(csv())
        .on('data', (row) => {
            const driver = new Driver(row);
            driver.save();
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
};



app.listen(3000, (err) => {
    console.log("Listening on port 3000");
});

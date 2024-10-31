const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const cityName = req.body.cityName 
  const apiKey = "f67c49a3934824ebc963b6796a1c0505"; 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  https.get(url, (response) => {
    console.log(response.statusCode);
    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      
      if (response.statusCode === 200) {
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        res.write(`<h1>The temperature in ${cityName} is ${temp}°C</h1>`);
        res.write(`<p>${description}</p>`);
        res.send();
      } else {
        res.send(`Error: ${weatherData.message}`);
      }
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

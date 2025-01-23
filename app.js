// Dependencies 
const express = require("express");
const geminiController = require('./controllers/geminiController');
const app = express();


app.use(express.json());
app.use('/gemini', geminiController);

app.get("/", (req, res) => {
    res.send("Welcome to the generator!")
});

app.get("*", (req, res) => {
    res.status(404).json({error: "Path not found"})
});

module.exports = app;
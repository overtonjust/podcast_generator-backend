// Dependencies 
const express = require("express");
const cors = require('cors');
const geminiController = require('./controllers/geminiController');
const app = express();

// middleware
app.use(express.json());
app.use(cors('*'))
app.use('/gemini', geminiController);

app.get("/", (req, res) => {
    res.send("Welcome to the generator!")
});

app.get("*", (req, res) => {
    res.status(404).json({error: "Path not found"})
});

module.exports = app;
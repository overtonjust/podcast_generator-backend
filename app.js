// Dependencies 
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to the generator!")
});

app.get("*", (req, res) => {
    res.status(404).json({error: "Path not found"})
});

module.exports = app;
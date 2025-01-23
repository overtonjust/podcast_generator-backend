// Route Dependencies
const express = require('express');
const gemini =  express.Router();
require('dotenv').config();

// AI Dependencies
const API_KEY = process.env.Gemini_API_KEY;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


gemini.get('/', async (req, res) => {
    res.send('Were working!')
});

gemini.post('/transcript', async (req, res) => {
    const transcript = req.body.transcript;
    const prompt = `Turn the following text into the format of a podcast transcript. \n ${transcript}`;
    const result = await model.generateContent(prompt);

    if(!result) {
        res.status(500).send({error: "Server error"})
    } else {
        res.status(200).send(result.response.text())
    }
});

module.exports = gemini;
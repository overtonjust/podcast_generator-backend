// Route Dependencies
const express = require('express');
const gemini =  express.Router();
require('dotenv').config();

// AI Dependencies
const API_KEY = process.env.Gemini_API_KEY;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
    systemInstruction: "You are a podcast host tasked with turning the info you receive into a podcast format"
});


gemini.get('/', async (req, res) => {
    res.send('Were working!')
});

gemini.post('/transcript', async (req, res) => {
    const prompt = req.body.transcript;
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    if(!result) {
        res.status(500).send({error: "Server error"})
    } else {
        res.status(200).json(response)
    }
});

module.exports = gemini;
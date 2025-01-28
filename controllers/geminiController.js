// Route Dependencies
const express = require('express');
const multer = require('multer');
const gemini =  express.Router();
require('dotenv').config();

// AI Dependencies
const API_KEY = process.env.Gemini_API_KEY;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
    systemInstruction: "You are a podcast host tasked with turning the info you receive into a podcast format. I want to output to only include lines the host will read and do not include ques for music or transitions"
});

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,

    fileFilter: (req, file, cb) => {
        if(file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new TypeError('Only audio files are allowed'));
        }
    }
});

/**
 *  code for eleven labs
 *   const { createAudioStreamFromText } = require('../elevenLabs');
 * 
 * const audioBuffer = await createAudioStreamFromText(response);

 * res.set({
    'Content-Type': 'audio/mpeg',
    'Transfer-Encoding': 'chunked'
 * })
 *  */ 


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

gemini.post('/audio', upload.single('audio'), async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file uploaded' });
        }

        const audioBase64 = req.file.buffer.toString('base64');

        const result = await model.generateContent([
                {
                  inlineData: {
                    mimeType: req.file.mimetype,
                    data: audioBase64
                  }
                }, { text: "Please summarize the audio like a podcast host." }
        ]);

        const response = await result.response.text();

        res.status(200).json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing audio file' });
    }
})

module.exports = gemini;
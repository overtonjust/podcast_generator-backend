const { ElevenLabsClient } = require('elevenlabs');
require('dotenv').config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if(!ELEVENLABS_API_KEY) {
    throw new Error("Missing eleven labs api key in .env file")
}

const client = new ElevenLabsClient({
    apiKey: ELEVENLABS_API_KEY,
});

const createAudioStreamFromText = async (text) => {
    const audioStream = await client.generate({
        voice: "Rachel",
        model_id: "eleven_turbo_v2_5",
        text,
    });

    const chunks = [];
    for await (const chunk of audioStream) {
        chunks.push(chunk)
    }

    return Buffer.concat(chunks);
}

module.exports =  { createAudioStreamFromText }
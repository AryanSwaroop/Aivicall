const express = require('express');
const router = express.Router();
const AIService = require('../services/AIService');

// ✅ You should store this securely (e.g., in an .env file)
const apiKey = process.env.gemini_api_key;

if (!apiKey) {
    throw new Error("Missing GOOGLE_API_KEY in environment variables.");
}

const aiService = new AIService(apiKey);

router.post("/generate", async (req, res) => {
    const message = req.body.message;

    if (!message) {
        return res.status(400).json({ error: "Missing 'message' in request body." });
    }

    try {
        const response = await aiService.getAiResponse(message);
        res.status(200).send({ response });
    } catch (err) {
        console.error("Error generating AI response:", err);
        res.status(500).json({ error: "Failed to generate response from AI." });
    }
});

module.exports = router;

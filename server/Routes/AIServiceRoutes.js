const express = require('express');
const router = express.Router();
const AIService = require('../services/AIService');
const aiService = new AIService();

router.post("/generate", async (req, res) => {
    console.log(req.body.message);
    let response = await aiService.getAiResponse(req.body.message);

    if (response) {
        res.send(response);
    }
});

module.exports = router;

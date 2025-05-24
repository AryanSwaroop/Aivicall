// aiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("Missing Google API key.");
        }

        this.genAI = new GoogleGenerativeAI(apiKey);

        // Track last request time (simple per-instance throttle)
        this.lastRequestTime = 0;
        this.cooldownMs = 1500; // 1.5 seconds between calls
    }

    async getAiResponse(message) {
        const now = Date.now();
        const timeSinceLast = now - this.lastRequestTime;

        if (timeSinceLast < this.cooldownMs) {
            throw new Error(`Rate limit: Please wait ${this.cooldownMs - timeSinceLast} ms before trying again.`);
        }

        this.lastRequestTime = now;

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(message);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Error from Gemini API:", error);

            if (error.status === 429) {
                throw new Error("Quota exceeded or too many requests. Try again later.");
            }

            throw new Error("Failed to get response from AI model.");
        }
    }
}

module.exports = AIService;

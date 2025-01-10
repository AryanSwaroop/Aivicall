const GoogleGenerativeAI = require("@google/generative-ai");

class AIService {
    constructor(genAI) {
        this.genAI = genAI;
    }

    async getAiResponse(message) {
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = message;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
}

module.exports = AIService;

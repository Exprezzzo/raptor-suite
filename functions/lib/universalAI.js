"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.universalAI = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const generative_ai_1 = require("@google/generative-ai");
const sdk_1 = require("@anthropic-ai/sdk");
const express = require("express");
const corsModule = require("cors");
const app = express();
const cors = corsModule({ origin: true });
app.use(cors);
app.use(express.json());
const anthropicKey = (0, params_1.defineSecret)('ANTHROPIC_API_KEY');
const geminiKey = (0, params_1.defineSecret)('GEMINI_API_KEY');
app.post('*', async (req, res) => {
    try {
        const { prompt, provider } = req.body;
        if (!prompt) {
            res.status(400).json({ success: false, error: 'Prompt is required' });
            return;
        }
        let resultText = '';
        const choice = provider === 'gemini' ? 'gemini' : 'anthropic';
        if (choice === 'anthropic') {
            const key = await anthropicKey.value();
            const client = new sdk_1.default({ apiKey: key });
            const message = await client.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                messages: [{ role: 'user', content: prompt }]
            });
            resultText = message.content[0].type === 'text' ? message.content[0].text : '';
        }
        else {
            const key = await geminiKey.value();
            const genAI = new generative_ai_1.GoogleGenerativeAI(key);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    maxOutputTokens: 1024
                }
            });
            resultText = result.response.text();
        }
        res.json({ success: true, provider: choice, result: resultText });
    }
    catch (err) {
        console.error('UniversalAI Error:', err);
        res.status(500).json({ success: false, error: err.message || 'Something went wrong' });
    }
});
exports.universalAI = (0, https_1.onRequest)({ secrets: ['ANTHROPIC_API_KEY', 'GEMINI_API_KEY'] }, app);
//# sourceMappingURL=universalAI.js.map
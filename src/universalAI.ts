import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import * as express from 'express';
import * as corsModule from 'cors';

const app = express();
const cors = corsModule({ origin: true });
app.use(cors);
app.use(express.json());

const anthropicKey = defineSecret('ANTHROPIC_API_KEY');
const geminiKey = defineSecret('GEMINI_API_KEY');

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
      const client = new Anthropic({ apiKey: key });
      const message = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      });
      resultText = message.content[0].type === 'text' ? message.content[0].text : '';
    } else {
      const key = await geminiKey.value();
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      resultText = result.response.text();
    }

    res.json({ success: true, provider: choice, result: resultText });
  } catch (err: any) {
    console.error('UniversalAI Error:', err);
    res.status(500).json({ success: false, error: err.message || 'Something went wrong' });
  }
});

export const universalAI = onRequest(
  { secrets: ['ANTHROPIC_API_KEY', 'GEMINI_API_KEY'] },
  app
);

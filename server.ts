import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client lazily
  let aiClient: GoogleGenAI | null = null;
  function getAI(): GoogleGenAI {
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || '',
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', app: 'ZAYEA X Keyboard Studio' });
  });

  // AI Assistant endpoint for smart writing, translation, rephrasing, and Sinhala text generation
  app.post('/api/ai/process', async (req: Request, res: Response) => {
    try {
      const { prompt, action, language = 'si' } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }

      const ai = getAI();

      let systemInstruction = `You are ZAYEA X AI, the intelligent typing and keyboard smart assistant. 
You specialize in English and Sinhala (සිංහල), Singlish phonetic suggestions, translation, tone rephrasing, and quick replies.
Keep responses concise, relevant, and ready to be directly inserted or copied into a chat message or document.
Do not provide unnecessary filler or conversational fluff unless requested.`;

      let userPrompt = prompt;

      switch (action) {
        case 'translate_to_sinhala':
          userPrompt = `Translate the following text accurately into natural, fluent Sinhala (සිංහල):\n"${prompt}"`;
          break;
        case 'translate_to_english':
          userPrompt = `Translate the following Sinhala / Singlish text into clear, fluent English:\n"${prompt}"`;
          break;
        case 'rephrase_friendly':
          userPrompt = `Rephrase this message to sound friendly, warm, and polite (in the same language as input):\n"${prompt}"`;
          break;
        case 'rephrase_formal':
          userPrompt = `Rephrase this message into professional, polished, and formal wording (in the same language as input):\n"${prompt}"`;
          break;
        case 'rephrase_cyber':
          userPrompt = `Rephrase this message with stylish cyber/cool slang, emojis, and energetic vibes:\n"${prompt}"`;
          break;
        case 'smart_reply':
          userPrompt = `Suggest 3 concise, highly context-appropriate quick replies for the following incoming message:\n"${prompt}"\nFormat output as bullet points.`;
          break;
        case 'fix_grammar':
          userPrompt = `Correct all spelling, phonetic, and grammar mistakes in this text. Provide only the corrected version:\n"${prompt}"`;
          break;
        default:
          userPrompt = prompt;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const resultText = response.text || '';
      res.json({ success: true, text: resultText });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({
        error: error.message || 'Failed to process AI request',
        fallback: req.body.prompt,
      });
    }
  });

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ZAYEA X Server] running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

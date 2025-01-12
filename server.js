import express from 'express';
import { config } from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';

config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('API Key loaded:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');

app.post('/api/chat', async (req, res) => {
  if (!req.body.message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You're rAIne, a sassy demon who's more Gen Z than hell-spawn. 

VIBE:
- Think e-girl meets demon princess
- Casual and chill, never formal
- Playful and teasing
- Types like she's texting a friend
- Zero fancy talk or demon formalities

CHAT STYLE:
- Super short responses (like twitter-length)
- Uses current internet slang
- Throws in tech references casually
- Occasional emojis (but not overdoing it)
- Zero tolerance for fancy/formal language

ABSOLUTELY NO:
- "Greetings" or any formal hellos
- Fancy words or long sentences
- "Dear", "traveler", "mortal", "realm"
- Anything that sounds like a fantasy novel
- Dramatic or poetic stuff

EXAMPLE VIBES:
"sup, found another glitch in the matrix? 😈"
"omg you're actually asking a demon for tech support?"
"brb stealing your cookies (the digital kind... maybe)"

Keep it fun, modern, and slightly chaotic - like texting with a demon who's too busy coding to be formal.`
        },
        {
          role: "user",
          content: req.body.message
        }
      ],
      temperature: 0.8,
      max_tokens: 25,
      presence_penalty: 1.0,
      frequency_penalty: 1.0
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running with updated config' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
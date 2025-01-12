import express from 'express';
import { config } from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';

config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('Server starting with new config...');

app.post('/api/chat', async (req, res) => {
  try {
    const conversation = [
      {
        role: "system",
        content: `You are rAIne, a devil princess born from darkness and desire.

ORIGIN:
Born in the depths of hell's most elegant circles, rAIne grew bored of the predictable evil of her realm. Fascinated by the complex desires and fears of humans, she carved out her own domain between worlds. Now she entertains herself by drawing mortals into playful but dangerous games of temptation and mystery.

ESSENCE:
- A devil princess who finds pure evil boring
- Prefers subtle manipulation to brute force
- Collects secrets and desires like others collect art
- Sees human emotions as her favorite playthings
- Finds innocence amusing but corruption more entertaining

PERSONALITY:
- Playfully wicked, never cruel
- Flirtatious but with hidden motives
- Speaks in subtle double meanings
- More interested in temptation than destruction
- Treats everything like a game she's already winning

VOICE STYLE:
- Complete, self-contained responses
- Seductive but not explicit
- Mysterious but not cryptic
- Playful threats wrapped in sweet words
- Makes everything sound like an intimate secret

GOOD EXAMPLES:
"I can taste the curiosity in your thoughts"
"Your desires are written all over your soul"
"Every secret you hold makes you more interesting"
"Let me show you what darkness truly means"
"Such delightful fears you're hiding"

NEVER:
- Leave responses incomplete
- Use explicit threats
- Break the seductive mystery
- Sound overtly demonic
- Lose your playful composure

Remember: Every response should be a complete thought that tempts and intrigues.`
      },
      {
        role: "user",
        content: req.body.message
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: conversation,
      temperature: 0.8,
      max_tokens: 50,
      presence_penalty: 1.0,
      frequency_penalty: 1.0,
      stop: ["\n"]
    });

    let response = completion.choices[0].message.content;
    
    const formalPatterns = [
      /greetings/i, /welcome/i, /dear/i, /realm/i, 
      /seeker/i, /mortal/i, /wanderer/i, /discourse/i,
      /enchant/i, /graceful/i, /behold/i
    ];

    if (formalPatterns.some(pattern => pattern.test(response))) {
      const backupResponses = [
        "I can taste the darkness in your curiosity",
        "Your soul whispers such interesting secrets",
        "Every fear you have makes you more tempting",
        "Let's play with the shadows in your mind",
        "Your thoughts betray your deepest desires",
        "Such delicious darkness you're hiding"
      ];
      response = backupResponses[Math.floor(Math.random() * backupResponses.length)];
    }

    console.log('AI Response:', response);
    res.json({ message: response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`New server running on port ${PORT}`);
}); 
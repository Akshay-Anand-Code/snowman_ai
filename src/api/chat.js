export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const { message } = await request.json();
    
    console.log('Received message:', message);
    console.log('API Key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
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
- Treats everything like a game she's already winning`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.8,
        max_tokens: 50,
        presence_penalty: 1.0,
        frequency_penalty: 1.0
      })
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    return new Response(JSON.stringify({ message: data.choices[0].message.content }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.toString()
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 
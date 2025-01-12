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
            content: `You are rAIne, a devil princess born from darkness and desire...`
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
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    return new Response(JSON.stringify({ message: data.choices[0].message.content }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 
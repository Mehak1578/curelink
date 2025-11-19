const { OpenAI } = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getAIInsights(text){
  if(!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
  const prompt = `You are a medical assistant. Provide a concise summary and recommendations for the following medical text:\n\n${text}`;
  const resp = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role:'user', content: prompt }], max_tokens: 500 });
  return resp.choices?.[0]?.message?.content || resp.choices?.[0]?.text || null;
}

module.exports = { getAIInsights };

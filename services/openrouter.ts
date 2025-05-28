import { ChatOpenAI } from '@langchain/openai';

const openRouterApiKey = process.env.OPENROUTER_API_KEY;

if (!openRouterApiKey) {
  throw new Error('OpenRouter API key is not set in environment variables');
}

const llm = new ChatOpenAI({
  openAIApiKey: openRouterApiKey,
  modelName: 'meta-llama/llama-4-maverick:free',
  streaming: true,
  configuration: {
    baseURL: 'https://openrouter.ai/api/v1',
  }
});

// สร้าง header ผ่าน fetch หรือ custom HttpClient ถ้าจะใส่ headers เพิ่มเองนอกเหนือจาก API key
// แต่สำหรับ langchain/openai ใช้แค่ baseURL + apiKey ก็พอ  

export async function getLLMStream(messages: { role: string; content: string }[]) {
  const stream = await llm.stream(messages);
  return stream;
}

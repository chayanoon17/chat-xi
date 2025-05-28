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


// import { ChatBedrockConverse } from '@langchain/aws';

// const region = process.env.BEDROCK_AWS_REGION;
// const accessKeyId = process.env.BEDROCK_AWS_ACCESS_KEY_ID;
// const secretAccessKey = process.env.BEDROCK_AWS_SECRET_ACCESS_KEY;

// if (!region || !accessKeyId || !secretAccessKey) {
//   throw new Error('AWS credentials are not set in the environment variables');
// }

// // ตั้งค่า AWS Bedrock
// const llm = new ChatBedrockConverse({
//   model: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
//   region: region,
//   streaming: true,
//   credentials: {
//     accessKeyId: accessKeyId,
//     secretAccessKey: secretAccessKey,
//   },
// });

// // ฟังก์ชันเรียกใช้งาน Bedrock LLM
// export async function getLLMStream(messages: { role: string; content: string }[]) {
//   const stream = await llm.stream(messages);
//   return stream; // คืนค่า ReadableStream ให้ API ใช้
// }



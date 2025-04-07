import { ChatBedrockConverse } from '@langchain/aws';

const region = process.env.BEDROCK_AWS_REGION;
const accessKeyId = process.env.BEDROCK_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.BEDROCK_AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error('AWS credentials are not set in the environment variables');
}


// ตั้งค่า AWS Bedrock
const llm = new ChatBedrockConverse({
  model: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
  region: region,
  streaming: true,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

// ฟังก์ชันเรียกใช้งาน Bedrock LLM
// export async function getLLMStream(messages: { role: string; content: string }[]) {
//   const stream = await llm.stream(messages);
//   return stream; // คืนค่า ReadableStream ให้ API ใช้
// }

export async function getLLMStream(messages: { role: string; content: string }[]) {
  let retries = 3;
  let delay = 1000; // เริ่มรอ 1 วิ

  for (let i = 0; i < retries; i++) {
    try {
      const stream = await llm.stream(messages);
      return stream;
    } catch (err: any) {
      if (
        err.name === 'ThrottlingException' ||
        err.message?.includes('Too many requests')
      ) {
        console.warn(`Retrying Claude (attempt ${i + 1}/${retries})...`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw err; // ถ้า error อื่นก็ให้ throw ตามปกติ
      }
    }
  }

  throw new Error("Claude throttling: retry failed");
}



// next.config.ts
import { NextConfig } from 'next';
import dotenv from 'dotenv';

dotenv.config();

const nextConfig: NextConfig = {
  env: {
    BEDROCK_AWS_ACCESS_KEY_ID: process.env.BEDROCK_AWS_ACCESS_KEY_ID,
    BEDROCK_AWS_SECRET_ACCESS_KEY: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY,
    BEDROCK_AWS_REGION: process.env.BEDROCK_AWS_REGION,
  },
};

export default nextConfig;

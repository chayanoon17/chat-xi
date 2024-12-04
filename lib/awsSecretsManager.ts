// lib/awsSecretsManager.ts
import AWS from 'aws-sdk';

// กำหนดค่า AWS SDK
AWS.config.update({ region: 'us-east-1' }); // เปลี่ยนเป็น region ของคุณ
const secretsManager = new AWS.SecretsManager();

// กำหนด interface สำหรับข้อมูลที่ดึงจาก AWS Secrets Manager
interface AWSCredentials {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
}

export const getAWSCredentials = async (): Promise<AWSCredentials> => {
  try {
    const secretName = 'your-secret-name'; // ชื่อของ Secret ใน AWS Secrets Manager
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    const secret = JSON.parse(data.SecretString as string); // แปลง Secret String เป็น JSON
    return {
      AWS_ACCESS_KEY_ID: secret.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: secret.AWS_SECRET_ACCESS_KEY,
    };
  } catch (error) {
    console.error('Error fetching secret:', error);
    throw new Error('Unable to retrieve AWS credentials');
  }
};


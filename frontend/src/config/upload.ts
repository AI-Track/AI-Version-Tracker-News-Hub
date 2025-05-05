export type UploadProvider = 'aws' | 'cloudflare' | 'custom';

export interface UploadConfig {
  provider: UploadProvider;
  endpoint: string;
  token: string;
  bucket?: string;
  region?: string;
  customHeaders?: Record<string, string>;
}

const uploadConfig: UploadConfig = {
  provider: 'custom',
  endpoint: process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT || '',
  token: process.env.NEXT_PUBLIC_UPLOAD_TOKEN || '',
  bucket: process.env.NEXT_PUBLIC_UPLOAD_BUCKET,
  region: process.env.NEXT_PUBLIC_UPLOAD_REGION,
  customHeaders: {},
};

export default uploadConfig; 
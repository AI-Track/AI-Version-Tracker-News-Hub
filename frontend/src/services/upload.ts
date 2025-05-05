import uploadConfig, { UploadProvider } from '@/config/upload';

export interface UploadResponse {
  url: string;
  key?: string;
  error?: string;
}

class UploadService {
  private getUploadHeaders(): Headers {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${uploadConfig.token}`);
    
    if (uploadConfig.customHeaders) {
      Object.entries(uploadConfig.customHeaders).forEach(([key, value]) => {
        headers.append(key, value);
      });
    }
    
    return headers;
  }

  private async handleAwsUpload(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (uploadConfig.bucket) {
      formData.append('bucket', uploadConfig.bucket);
    }
    
    if (uploadConfig.region) {
      formData.append('region', uploadConfig.region);
    }

    try {
      const response = await fetch(uploadConfig.endpoint, {
        method: 'POST',
        headers: this.getUploadHeaders(),
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return {
        url: data.url,
        key: data.key,
      };
    } catch (error) {
      return {
        url: '',
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  private async handleCloudflareUpload(file: File): Promise<UploadResponse> {
    try {
      const response = await fetch(uploadConfig.endpoint, {
        method: 'POST',
        headers: this.getUploadHeaders(),
        body: file,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return {
        url: data.url,
        key: data.id,
      };
    } catch (error) {
      return {
        url: '',
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  private async handleCustomUpload(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(uploadConfig.endpoint, {
        method: 'POST',
        headers: this.getUploadHeaders(),
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return {
        url: data.url,
        key: data.key,
      };
    } catch (error) {
      return {
        url: '',
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async uploadFile(file: File): Promise<UploadResponse> {
    switch (uploadConfig.provider) {
      case 'aws':
        return this.handleAwsUpload(file);
      case 'cloudflare':
        return this.handleCloudflareUpload(file);
      case 'custom':
        return this.handleCustomUpload(file);
      default:
        return {
          url: '',
          error: 'Invalid upload provider',
        };
    }
  }
}

export const uploadService = new UploadService(); 
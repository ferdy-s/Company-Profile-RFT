import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from './env';

// Initialize S3 client for MinIO
export const s3Client = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  forcePathStyle: true, // Required for MinIO
});

/**
 * Ensure the bucket exists, create if it doesn't
 */
export async function ensureBucketExists(): Promise<void> {
  try {
    await s3Client.send(
      new HeadBucketCommand({
        Bucket: env.S3_BUCKET_NAME,
      })
    );
  } catch (error: unknown) {
    const e = error as { name?: string; $metadata?: { httpStatusCode?: number } };
    if (e.name === 'NotFound' || e.$metadata?.httpStatusCode === 404) {
      // Bucket doesn't exist, but MinIO will create it on first upload
      // For production, you might want to create it explicitly
      console.log(`Bucket ${env.S3_BUCKET_NAME} will be created on first upload`);
    } else {
      throw error;
    }
  }
}

/**
 * Generate a presigned URL for uploading a file to S3/MinIO
 * @param fileKey - The key/path for the file in the bucket
 * @param contentType - The MIME type of the file
 * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Presigned URL for PUT operation
 */
export async function getPresignedUploadUrl(
  fileKey: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: fileKey,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

/**
 * Get the public URL for a file in the bucket
 * @param fileKey - The key/path of the file
 * @returns Public URL to access the file
 */
export function getPublicUrl(fileKey: string): string {
  // For MinIO, construct the public URL
  const endpoint = normalizePublicEndpointForBrowser(env.S3_ENDPOINT).replace(/\/$/, ''); // Remove trailing slash
  return `${endpoint}/${env.S3_BUCKET_NAME}/${fileKey}`;
}

/**
 * Normalize S3 endpoint so URLs work in the browser.
 * - In Docker, the internal hostname is usually `minio`, but the browser must use the published host (localhost).
 */
export function normalizePublicEndpointForBrowser(endpoint: string): string {
  try {
    const u = new URL(endpoint);
    if (u.hostname === 'minio') {
      u.hostname = 'localhost';
    }
    return u.toString().replace(/\/$/, '');
  } catch {
    return endpoint.replace(/\/$/, '').replace('minio', 'localhost');
  }
}

export function normalizePublicUrlForBrowser(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname === 'minio') u.hostname = 'localhost';
    return u.toString();
  } catch {
    return url.replace('http://minio:', 'http://localhost:').replace('https://minio:', 'https://localhost:');
  }
}


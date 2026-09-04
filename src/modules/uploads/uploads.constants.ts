import { join } from 'node:path';

export const UPLOADS_DIR = join(process.cwd(), 'uploads');
export const UPLOADS_URL_PREFIX = '/uploads';
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

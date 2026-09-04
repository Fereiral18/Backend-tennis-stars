import { registerAs } from '@nestjs/config';

function parseCorsOrigin(value: string | undefined): string | string[] {
  if (!value) {
    return '*';
  }

  const origins = value
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  return origins.length === 1 ? origins[0] : origins;
}

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
}));

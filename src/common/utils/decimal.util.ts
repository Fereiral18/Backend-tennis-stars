import type { Prisma } from '@prisma/client';

/**
 * Converts a Prisma Decimal field into a plain JS number for API responses.
 */
export function toNumber(value: Prisma.Decimal | number): number {
  return typeof value === 'number' ? value : value.toNumber();
}

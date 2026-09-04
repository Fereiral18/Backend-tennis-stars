-- AlterTable
ALTER TABLE "sale_items" ADD COLUMN     "color" TEXT,
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'UNISEX',
ADD COLUMN     "size" TEXT;

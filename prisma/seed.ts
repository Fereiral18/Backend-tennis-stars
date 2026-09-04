import { Gender, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@courtstore.com';
const ADMIN_PASSWORD = '123456';

const categories = [
  { name: 'Nike', description: 'Zapatillas deportivas de la marca Nike.' },
  { name: 'Adidas', description: 'Zapatillas deportivas de la marca Adidas.' },
  { name: 'Puma', description: 'Zapatillas deportivas de la marca Puma.' },
  { name: 'Under Armour', description: 'Zapatillas deportivas de la marca Under Armour.' },
  { name: 'New Balance', description: 'Zapatillas deportivas de la marca New Balance.' },
];

const productsByCategory: Record<
  string,
  { name: string; description: string; price: number; imageUrl: string }[]
> = {
  Nike: [
    {
      name: 'Nike Air Zoom Pegasus',
      description: 'Zapatilla running con amortiguación reactiva para entrenamientos diarios.',
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
    },
    {
      name: 'Nike Court Vision Low',
      description: 'Calzado urbano inspirado en el básquet clásico de los 80.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    },
  ],
  Adidas: [
    {
      name: 'Adidas Ultraboost 22',
      description: 'Retorno de energía superior con entresuela Boost.',
      price: 179.99,
      imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
    },
  ],
  Puma: [
    {
      name: 'Puma Velocity Nitro 2',
      description: 'Zapatilla ligera con espuma NITRO para máxima velocidad.',
      price: 109.99,
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    },
  ],
  'Under Armour': [
    {
      name: 'Under Armour HOVR Phantom',
      description: 'Amortiguación HOVR que devuelve energía en cada zancada.',
      price: 139.99,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    },
  ],
  'New Balance': [
    {
      name: 'New Balance Fresh Foam 1080v12',
      description: 'Máxima comodidad para largas distancias.',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
    },
  ],
};

async function main(): Promise<void> {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      name: 'Administrador',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });

    const products = productsByCategory[category.name] ?? [];

    for (const product of products) {
      await prisma.product.upsert({
        where: { name: product.name },
        update: {},
        create: {
          ...product,
          brand: category.name,
          gender: Gender.UNISEX,
          categoryId: createdCategory.id,
        },
      });
    }
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });

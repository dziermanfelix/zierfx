// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const artist = await prisma.artist.upsert({
    where: { name: 'Lo-Fi Beats' },
    update: {},
    create: {
      name: 'Lo-Fi Beats',
      albums: {
        create: [
          {
            name: 'Rainy Days',
            year: 2023,
            tracks: {
              create: [{ name: 'Coffee & Code' }, { name: 'Lo-Fi Chill' }, { name: 'Rain in Tokyo' }],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded artist:', artist.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

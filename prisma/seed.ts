import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.track.deleteMany({});
  await prisma.album.deleteMany({});
  await prisma.artist.deleteMany({});

  const artist = await prisma.artist.upsert({
    where: { name: 'Zierfx' },
    update: {},
    create: {
      name: 'Zierfx',
      albums: {
        create: [
          {
            name: 'Charge The Sea',
            year: 2025,
            tracks: {
              create: [
                { name: 'Out To Sea' },
                { name: 'Running' },
                { name: 'Trip' },
                { name: 'Young Cole' },
                { name: 'Misfit' },
              ],
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

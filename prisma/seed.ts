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
          {
            name: 'Upcoming',
            year: 2026,
            tracks: {
              create: [
                { name: 'Test 1' },
                { name: 'Test 2' },
                { name: 'Test 3' },
                { name: 'Test 4' },
                { name: 'Test 5' },
                { name: 'Test 6' },
                { name: 'Test 7' },
                { name: 'Test 8' },
                { name: 'Test 9' },
                { name: 'Test 10' },
              ],
            },
          },
          {
            name: 'Gladberries',
            year: 2020,
            tracks: {
              create: [
                { name: 'Running' },
                { name: 'Glassy' },
                { name: 'Young Cole' },
                { name: 'My Favorite' },
                { name: 'If Only for Today' },
                { name: 'Quarter' },
                { name: 'Misfit' },
                { name: 'Believing' },
                { name: 'Neighbors' },
                { name: 'For The Boy' },
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

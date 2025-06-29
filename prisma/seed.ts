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

  const artist2 = await prisma.artist.upsert({
    where: { name: 'Dered Yeebob' },
    update: {},
    create: {
      name: 'Dered Yeebob',
      albums: {
        create: [
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
          {
            name: 'Simple Holiday',
            year: 2020,
            tracks: {
              create: [
                { name: 'Mirror Mirror' },
                { name: 'Trip' },
                { name: 'Sands' },
                { name: 'Feel You' },
                { name: 'Far Away' },
                { name: 'Feed Your Soul' },
                { name: 'San Diego' },
                { name: 'Malibu Canyon' },
                { name: 'Decline of A Man' },
                { name: 'To Hell With It' },
                { name: 'Simple Holiday' },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('Seeded artist:', artist2.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

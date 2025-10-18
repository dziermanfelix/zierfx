import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminUsername = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASS;

  if (!adminUsername || !adminPassword) {
    console.error('Error: ADMIN_USER and ADMIN_PASS must be set in .env file');
    process.exit(1);
  }

  // Check if admin user already exists
  const existingUser = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (existingUser) {
    console.log(`Admin user "${adminUsername}" already exists. Skipping creation.`);
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      username: adminUsername,
      email: `${adminUsername}@admin.local`,
      password: hashedPassword,
      role: 'admin',
      name: 'Admin User',
    },
  });

  console.log(`✓ Admin user created successfully!`);
  console.log(`  Username: ${adminUser.username}`);
  console.log(`  Email: ${adminUser.email}`);
  console.log(`  Role: ${adminUser.role}`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


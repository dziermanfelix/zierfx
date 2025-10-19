#!/usr/bin/env ts-node
/**
 * Script to ensure admin user exists in the database
 *
 * This script will:
 * - Create an admin user if it doesn't exist
 * - Update the password if the user exists but password has changed
 *
 * Usage:
 *   For production: DATABASE_URL=<prod-url> ADMIN_USER=<user> ADMIN_PASS=<pass> npm run ensure-admin
 *   For local: ADMIN_USER=<user> ADMIN_PASS=<pass> npm run ensure-admin
 *   Or set ADMIN_USER and ADMIN_PASS in your .env file and run: npm run ensure-admin
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminUsername = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASS;
  const adminEmail = process.env.ADMIN_EMAIL;

  // Validate required environment variables
  if (!adminUsername || !adminPassword) {
    console.error('❌ Error: ADMIN_USER and ADMIN_PASS must be set');
    console.error('');
    console.error('Usage:');
    console.error(
      '  DATABASE_URL=<db-url> ADMIN_USER=<username> ADMIN_PASS=<password> npx tsx scripts/ensure-admin.ts'
    );
    console.error('');
    console.error('Or set these variables in your .env file:');
    console.error('  ADMIN_USER=your_username');
    console.error('  ADMIN_PASS=your_password');
    console.error('  ADMIN_EMAIL=your_email (optional)');
    process.exit(1);
  }

  console.log('🔐 Ensuring admin user exists...');
  console.log(`   Username: ${adminUsername}`);

  const email = adminEmail || `${adminUsername}@admin.local`;
  console.log(`   Email: ${email}`);
  console.log('');

  // Check if admin user already exists
  const existingUser = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  if (existingUser) {
    console.log(`👤 Admin user "${adminUsername}" already exists.`);

    // Check if password needs updating (compare with stored hash)
    const passwordMatch = await bcrypt.compare(adminPassword, existingUser.password);

    if (!passwordMatch) {
      console.log('🔄 Password has changed. Updating...');

      await prisma.user.update({
        where: { username: adminUsername },
        data: {
          password: hashedPassword,
          role: 'admin', // Ensure role is admin
          email: email, // Update email if provided
        },
      });

      console.log('✅ Admin password updated successfully!');
    } else {
      console.log('✅ Admin user is up to date. No changes needed.');

      // Still ensure role is admin and email is correct
      await prisma.user.update({
        where: { username: adminUsername },
        data: {
          role: 'admin',
          email: email,
        },
      });
    }
  } else {
    // Create new admin user
    console.log(`📝 Creating admin user "${adminUsername}"...`);

    const adminUser = await prisma.user.create({
      data: {
        username: adminUsername,
        email: email,
        password: hashedPassword,
        role: 'admin',
        name: 'Admin User',
      },
    });

    console.log('');
    console.log('✅ Admin user created successfully!');
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
  }

  console.log('');
  console.log('🎉 Done!');
}

main()
  .catch((e) => {
    console.error('');
    console.error('❌ Error:', e.message);
    console.error('');
    if (e.message.includes('connect')) {
      console.error('💡 Tip: Make sure DATABASE_URL is set correctly');
      console.error('   Current DATABASE_URL:', process.env.DATABASE_URL ? '(set)' : '(not set)');
    }
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

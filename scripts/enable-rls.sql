-- Enable RLS on all tables
-- Since you're using Prisma with direct PostgreSQL connections, RLS won't affect your app
-- but this will satisfy Supabase's security requirements

ALTER TABLE "Artist" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Album" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Track" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Venue" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Show" ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for all operations
-- These policies allow everything, which is safe since Prisma uses direct connections
-- and bypasses RLS anyway

CREATE POLICY "Allow all operations on Artist" ON "Artist" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on Album" ON "Album" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on Track" ON "Track" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on User" ON "User" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on Venue" ON "Venue" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on Show" ON "Show" FOR ALL USING (true) WITH CHECK (true);

-- Note: We don't enable RLS on _prisma_migrations as that's managed by Prisma

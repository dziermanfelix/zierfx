import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function listAllFiles() {
  const bucket = process.env.SUPABASE_BUCKET;
  if (!bucket) return null;
  const { data, error } = await supabase.storage.from(bucket).list('');

  if (error) {
    console.error('Error listing files:', error);
    return;
  }

  console.log('Files:', data);
}

listAllFiles();

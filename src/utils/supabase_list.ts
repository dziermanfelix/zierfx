import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SERVICE_KEY!);

async function listAllFiles() {
  const { data, error } = await supabase.storage.from('albums').list('');

  if (error) {
    console.error('Error listing files:', error);
    return;
  }

  console.log('Files:', data);
}

listAllFiles();

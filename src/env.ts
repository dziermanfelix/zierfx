export const IS_PROD = process.env.NODE_ENV === 'production';

export const USE_SUPABASE_DB = process.env.USE_SUPABASE_DB === 'true';
export const USE_SUPABASE_STORAGE = process.env.USE_SUPABASE_STORAGE === 'true';

export const DATABASE_URL = USE_SUPABASE_DB ? process.env.DATABASE_URL_SUPABASE : process.env.DATABASE_URL_LOCAL;

export const SUPABASE_URL = process.env.SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET!;

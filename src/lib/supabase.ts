
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jzqkjfvvdaqbcfyiaxal.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6cWtqZnZ2ZGFxYmNmeWlheGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxODg2NDMsImV4cCI6MjA1NTc2NDY0M30.rW6pFdVEAdtcsKUqu3d9qEfJLI8hWj2hthKoePcjpjM';

export const supabase = createClient(supabaseUrl, supabaseKey);

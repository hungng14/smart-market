
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jzqkjfvvdaqbcfyiaxal.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6cWtqZnZ2ZGFxYmNmeWlheGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxODg2NDMsImV4cCI6MjA1NTc2NDY0M30.rW6pFdVEAdtcsKUqu3d9qEfJLI8hWj2hthKoePcjpjM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

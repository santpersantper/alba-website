import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://phoepkacbrtolqmlwkvw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBob2Vwa2FjYnJ0b2xxbWx3a3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDUxMjcsImV4cCI6MjA3NjE4MTEyN30.ZtrCsy3ReW0ctykXqt9YWy14oevyzWZSdYALYPDX8fo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export { SUPABASE_URL, SUPABASE_ANON_KEY };

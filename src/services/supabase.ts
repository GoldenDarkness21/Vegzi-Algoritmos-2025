import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://apihkwltrkieijcurlfh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWhrd2x0cmtpZWlqY3VybGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzYwNTksImV4cCI6MjA2NTM1MjA1OX0.I6-fEQncYLAVGWiOONQ69NU3anqCIWaRh2oMEdchIzs";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
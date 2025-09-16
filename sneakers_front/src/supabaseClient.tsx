import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsqvsejtfbmglexxdpbh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcXZzZWp0ZmJtZ2xleHhkcGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjQ1OTEsImV4cCI6MjA3MzUwMDU5MX0.ix4UhAOsGXSpHF1OVWSKc_tKTwUedWhIwLkWlyQZ_Xk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

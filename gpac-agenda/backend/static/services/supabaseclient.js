import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm';

const supabaseUrl = 'https://ykwvxcgvbvhkqbzlpvzj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrd3Z4Y2d2YnZoa3FiemxwdnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4MjI1NzAsImV4cCI6MjAyMDM5ODU3MH0.Pu_zyKqBGAFWBm-pM-Zr8mo_TBOkYAV0lB_VRhwKgFE';

export const supabase = createClient(supabaseUrl, supabaseKey);

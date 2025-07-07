import { createClient } from 'https://esm.sh/@supabase/supabase-js'

 
const supabaseUrl = 'https://bieztfazapkndadtrcad.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZXp0ZmF6YXBrbmRhZHRyY2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzc4NDAsImV4cCI6MjA2NTc1Mzg0MH0.kmI3kZAC910mvcCVzjcGVUSZqweewNh6ro4YOsI_Q9s'

export const supabase = createClient(supabaseUrl, supabaseKey)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfqwuzosrbrdcqcrkaok.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcXd1em9zcmJyZGNxY3JrYW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NDE4MTIsImV4cCI6MjA2MjQxNzgxMn0.3iJY_OWHBiXGcwRAxBMcM5VrVaVUW7BWB1MTVI3g6WM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
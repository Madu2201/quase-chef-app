import { createClient } from '@supabase/supabase-js';

// Essas chaves são strings, o TS vai inferir isso automaticamente
const supabaseUrl = 'https://iqkurvmcjinmxrmrvkpx.supabase.co';
const supabaseAnonKey = 'sb_publishable_BZZ_H3cTHdImtVU6_8XN4g_umcSJCik';

// Criamos a instância do cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
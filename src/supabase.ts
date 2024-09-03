import { createClient } from "@supabase/supabase-js";
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) 	throw new Error("Missing VITE_SUPABASE_URL environement variable");
if (!supabaseAnonKey) throw new Error("Missing VITE_SUPABASE_ANON_KEY environement variable");

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    realtime: {
        params: {
            private: true,
        }
    }
});
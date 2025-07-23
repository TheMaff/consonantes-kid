import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnon) {
  throw new Error("‼️ Supabase env vars missing");
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
    },
});
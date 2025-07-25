//#src/types/supabase.d.ts
import { AuthError, Session } from "@supabase/supabase-js";

declare module "@supabase/supabase-js" {
    interface SupabaseAuthClient {
        /** 2.52.x – no tipado en la d.ts oficial */
        getSessionFromUrl(opts?: { storeSession?: boolean }): Promise<{
            data: { session: Session | null };
            error: AuthError | null;
        }>;
    }
}

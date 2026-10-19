import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Koneksi sesi admin: SUPABASE_PUBLISHABLE_KEY + cookie login (@supabase/ssr)
// Dipakai untuk: login, keluar, ganti password, dan aksi tambah/ubah/hapus produk
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dipanggil dari Server Component
          }
        },
      },
    }
  );
}

// Koneksi server untuk pengunjung: SUPABASE_SECRET_KEY
// Dipakai untuk: membaca katalog dan detail produk
export function createServiceClient() {
  return createSupabaseClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
  );
}


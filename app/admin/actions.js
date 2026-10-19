"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;

  if (!(data instanceof FormData)) {
    return { error: "Data form tidak valid." };
  }

  const email = data.get("email")?.toString() || "";
  const password = data.get("password")?.toString() || "";

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email atau password salah." };
  }

  redirect("/admin");
}

export async function keluar() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;

  if (!(data instanceof FormData)) {
    return { error: "Data form tidak valid." };
  }

  const passwordBaru = data.get("password_baru")?.toString() || "";
  const konfirmasiPassword = data.get("konfirmasi_password")?.toString() || "";

  // Validasi di server: minimal 8 karakter dan harus sama dengan konfirmasi
  if (!passwordBaru || passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password tidak sama." };
  }

  const supabase = await createClient();

  // Memeriksa bahwa admin sudah login sebelum mengubah password
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login sebagai admin untuk mengganti password." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    if (error.message?.toLowerCase().includes("different from the old password")) {
      return { error: "Password baru tidak boleh sama dengan password lama." };
    }
    return { error: error.message || "Gagal mengganti password." };
  }

  return { success: true, message: "Password berhasil diganti." };
}



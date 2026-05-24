import { supabase } from "./supabase";

// ==========================
// SIGN UP
// ==========================
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  // Create wallet for new user
  if (data?.user && !error) {
    const { error: walletError } = await supabase.from("wallets").insert({
      user_id: data.user.id,
      ngn: 100000,
      btc: 0,
      eth: 0,
      usdt: 0,
    });

    if (walletError) {
      console.error("Wallet creation error:", walletError.message);
    }
  }

  return { data, error };
}

// ==========================
// LOGIN
// ==========================
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

// ==========================
// LOGOUT
// ==========================
export async function logout() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// ==========================
// FORGOT PASSWORD
// ==========================
export async function forgotPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  return { data, error };
}

// ==========================
// RESET PASSWORD
// ==========================
export async function resetPassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { data, error };
}

// ==========================
// GET CURRENT USER
// ==========================
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Get user error:", error.message);
    return null;
  }

  return data?.user || null;
}

// ==========================
// GET SESSION
// ==========================
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Session error:", error.message);
    return null;
  }

  return data?.session || null;
}
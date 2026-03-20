import { supabase } from "./supabase";

// SIGN UP
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if(data?.user){
    await supabase.from("wallets").insert({
      user_id: data.user.id,
      ngn: 100000,
      btc: 0,
      eth: 0,
      usdt: 0,
    });
  }

  return { data, error };
}

// LOGIN
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

// LOGOUT
export async function logout() {
  await supabase.auth.signOut();
}

// GET CURRENT USER
export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user;
}
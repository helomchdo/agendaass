import { supabase } from './supabaseclient.js';

// Function to sign in user with email and password
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  // Store the access token in localStorage for API calls
  if (data.session && data.session.access_token) {
    localStorage.setItem('supabase.auth.token', data.session.access_token);
  }

  return data;
}

// Function to sign out user
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  localStorage.removeItem('supabase.auth.token');
}

// Function to get current user session
export function getSession() {
  return supabase.auth.getSession();
}

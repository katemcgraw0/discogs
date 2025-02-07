import "../global.css"

// app/_layout.js
import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments, Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from './lib/supabase-client'; // Adjust the import path as needed

export default function RootLayout() {
  const router = useRouter();
  // useSegments returns an array of the current active route segments.
  const segments = useSegments();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check the initial session on app startup.
    async function getInitialSession() {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Session:", session);
      console.log("Segments:", segments);

      // If no session exists and we're not already in the auth group, go to login.
      if (!session && !segments.includes('(auth)')) {
        console.log("Redirecting to login");
        setLoading(false);
        router.replace('/(auth)/login');
      }
      // If there is a session but we're on an auth page (e.g. the login screen), redirect to your main app.
      else if (session && segments.includes('(auth)')) {
        setLoading(false);
        router.replace('/(tabs)/profile');
      }
      setLoading(false);
    }
    getInitialSession();

    // Subscribe to changes in the auth state.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // When the session becomes null (logged out) and we’re not on an auth route,
        // redirect to the login page.
        if (!session && !segments.includes('(auth)')) {
          router.replace('/(auth)/login');
        }
        // If a session exists (user just logged in) and we're on an auth page,
        // redirect to the main app.
        else if (session && segments.includes('(auth)')) {
          router.replace('/(tabs)/profile');
        }
      }
    );

    return () => {
      // Clean up the listener on unmount.
      authListener.subscription.unsubscribe();
    };
  }, [router, segments]);

  // While checking the auth state, show a loading indicator.
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // When not loading, render the nested routes.
  return <Slot />;
}

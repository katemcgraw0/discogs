import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from './lib/supabase-client'; // Ensure the path is correct
import { useRouter, Redirect } from 'expo-router';

export default function IndexPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  return(<Redirect href="/(auth)/login" />);

}

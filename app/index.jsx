
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import {Link, useRouter, Redirect, router} from "expo-router";
import { Text, View, ActivityIndicator } from "react-native";

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if(session){
        router.replace("/(tabs)/profile")
      }
      else{
        console.log("no user")
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      if(session){
        router.replace("/(tabs)/profile");
      }
      else{
        router.replace("/(auth)/login");
      }
    })
  }, [])

}
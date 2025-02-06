
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../../components/Auth'
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import {Link, useRouter} from "expo-router";

export default function App() {
  const [session, setSession] = useState(null)

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session)
//     })

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session)
//     })
//   }, [])

  return (
    <View>
      <Auth />
      {session && session.user && <Text>{session.user.id}</Text>}
      <Link className = "bg-black text-white" href="/(tabs)">LINK TO APP</Link>
    </View>
  )
}
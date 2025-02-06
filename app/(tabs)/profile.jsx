import { useEffect, useState } from 'react'
import { 
  Alert,
  SafeAreaView, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { supabase } from '../lib/supabase-client'

export default function Profile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
      } else {
        Alert.alert("ERROR ACCESSING USER")
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* ScrollView in case user object data is large */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Profile</Text>
          <Text className="text-sm text-gray-500">Your account details</Text>
        </View>

        {/* User Info */}
        {user ? (
          <View className="space-y-2">
            {/* Example: display user email and ID */}
            <Text className="text-base text-gray-800">
              <Text className="font-semibold">Email:</Text> {user?.email}
            </Text>
            <Text className="text-base text-gray-800">
              <Text className="font-semibold">User ID:</Text> {user?.id}
            </Text>

            {/* Full user object (JSON) */}
            <Text className="text-xs text-gray-500 mt-4">
              {JSON.stringify(user, null, 2)}
            </Text>
          </View>
        ) : (
          <Text className="text-gray-600">Loading user...</Text>
        )}

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mt-8 bg-red-500 p-3 rounded-md items-center"
        >
          <Text className="text-white font-semibold">LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

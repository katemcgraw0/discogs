import { useEffect, useState } from 'react'
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { supabase } from '../lib/supabase-client'
import { Button, Input } from '@rneui/themed'

export default function Profile () {
  const [user, setUser] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [editable, setEditable] = useState(false)
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        console.log('User data:', user)
      } else {
        Alert.alert('ERROR ACCESSING USER')
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleEditProfile = async () => {
    setEditable(!editable)
  }
  
  const handleSaveProfile = async () => {
    // Update user profile
    const { data, error } = await supabase.from('profiles').upsert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      username: username
    })
    if (error) {
      Alert.alert('Error updating profile')
    } else {
      Alert.alert('Profile updated successfully')
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* ScrollView in case user object data is large */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className='px-4 py-6'>
        {/* Header */}
        <View className='mb-6'>
          <Text className='text-2xl font-bold text-gray-800'>Profile</Text>
          <Text className='text-sm text-gray-500'>Your account details</Text>
        </View>

        {/* User Info */}
        {user ? (
          <View className='space-y-2'>
            {/* Example: display user email and ID */}
            <Text className='text-base text-gray-800'>
              <Text className='font-semibold'>Email:</Text> {user?.email}
            </Text>
            <Text className='text-base text-gray-800'>
              <Text className='font-semibold'>User ID:</Text> {user?.id}
            </Text>

            {/* Full user object (JSON) */}
            <View className='text-xs text-gray-500 mt-4'>
              <Input
                onChangeText={text => setFirstName(text)}
                value={firstName}
                placeholder='First Name'
                autoCapitalize={'none'}
              />
              <Input
                onChangeText={text => setFirstName(text)}
                value={lastName}
                placeholder='Last Name'
                autoCapitalize={'none'}
              />
            </View>
            <Input
              onChangeText={text => setFirstName(text)}
              value={username}
              placeholder='username'
              autoCapitalize={'none'}
            />
          </View>
        ) : (
          <Text className='text-gray-600'>Loading user...</Text>
        )}

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleEditProfile}
          className='mt-8 bg-red-400 p-3 rounded-md items-center'
        >
          {(!editable && (
            <Text className='text-white font-semibold'>EDIT PROFILE</Text>
          )) || <Text className='text-white font-semibold'>CANCEL</Text>}
        </TouchableOpacity>

        {editable && (
          <TouchableOpacity
            onPress={handleLogout}
            className='mt-8 bg-green-800 p-3 rounded-md items-center'
          >
            <Text className='text-white font-semibold'>SAVE CHANGES</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleLogout}
          className='mt-8 bg-red-500 p-3 rounded-md items-center'
        >
          <Text className='text-white font-semibold'>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

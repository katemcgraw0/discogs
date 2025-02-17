import { Tabs } from 'expo-router'

import Ionicons from '@expo/vector-icons/Ionicons'

export default function TabLayout () {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#355E3B', headerShown:false
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          tabBarLabel: 'Home',
            title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home-sharp' : 'home-outline'}
              color={color}
              size={24}
            />
          )
        }}
      />
      <Tabs.Screen
        name='browse'
        options={{
          tabBarLabel: 'Browse',
          title: 'Browse',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              color={color}
              size={24}
            />
          )
        }}
      />

      <Tabs.Screen
        name='library'
        options={{
          title: 'Library',
          tabBarLabel: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'library' : 'library-outline'}
              color={color}
              size={24}
            />
          )
        }}
      />
      <Tabs.Screen
        name='wishlist'
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'list' : 'list-outline'}
              color={color}
              size={24}
            />
          )
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person-circle' : 'person-circle-outline'}
              color={color}
              size={24}
            />
          )
        }}
      />
    </Tabs>
  )
}

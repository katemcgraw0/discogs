import { View, Text, TextInput, Button, FlatList, Image, Pressable } from "react-native";
import {Link, useRouter} from "expo-router";
import React, { useEffect, useState } from "react";
import axios from "axios";


// import {CONSUMER_KEY} from '@env';
// import {CONSUMER_SECRET} from '@env';
const CONSUMER_KEY = process.env.EXPO_PUBLIC_CONSUMER_KEY;     
const CONSUMER_SECRET = process.env.EXPO_PUBLIC_CONSUMER_SECRET;

export default function Browse() {

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const router = useRouter();

const handleSearch = async () => {
  try {
    console.log(CONSUMER_KEY);
    console.log(CONSUMER_SECRET);
    const response = await axios.get('https://api.discogs.com/database/search', {
      params: {
        q: searchQuery,
        type: 'release',
        key: CONSUMER_KEY,
        secret: CONSUMER_SECRET,
      },
      headers: {
        'User-Agent': 'MyVinylApp/1.0',
      },
    });
    console.log(response.data);
    setResults(response.data.results || []);
  } catch (error) {
    console.error('Error searching Discogs:', error);
  }
};

const renderAlbum = ({ item }) => (
    <Pressable
      onPress={() => {
        // Navigate to the details screen with the release ID
        // item.type could be "release", "master", etc.
        // Typically for a release: /releases/<id>
        // But for simplicity, let's just pass item.id and handle logic in detail screen
        router.push(`/browse/${item.id}`);
      }}
      className="flex-row items-center my-2"
    >
      {item.cover_image && (
        <Image
          source={{ uri: item.cover_image }}
          className="w-24 h-24 rounded"
          resizeMode="cover"
        />
      )}
      <View className="ml-3 flex-1">
        <Text className="font-semibold text-lg" numberOfLines={1}>
          {item.title}
        </Text>
        {item.year && <Text className="text-gray-700">Year: {item.year}</Text>}
        {item.country && <Text className="text-gray-700">Country: {item.country}</Text>}
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 pt-10 px-4">
      <Text className="text-2xl font-bold mb-4">Discogs Search</Text>
      <TextInput
        className="border border-gray-300 rounded px-3 py-2 mb-2"
        placeholder="Enter album or artist"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />

      <FlatList
        className="mt-4"
        data={results}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderAlbum}
      />
    </View>
  );
}
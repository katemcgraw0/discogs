import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useSearchParams } from 'expo-router';
import axios from 'axios';
import AlbumDropDown from '../../../components/AlbumDropDown';


const CONSUMER_KEY = process.env.EXPO_PUBLIC_CONSUMER_KEY;     
const CONSUMER_SECRET = process.env.EXPO_PUBLIC_CONSUMER_SECRET;

export default function ReleaseDetails() {
  const { id } = useLocalSearchParams(); // read the dynamic [id] from the URL
  const [release, setRelease] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReleaseDetails = async () => {
      try {
        // For a "release":
        // GET /releases/{release_id}
        // For a "master":
        // GET /masters/{master_id}
        // We'll assume "release" for this example
    
        const url = `https://api.discogs.com/releases/${id}`;
        console.log('fetching release details from:', url);
        const response = await axios.get(url, {
          params: {
            key: CONSUMER_KEY,
            secret: CONSUMER_SECRET,
          },
          headers: {
            'User-Agent': 'MyVinylApp/1.0',
          },
        });
        setRelease(response.data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error fetching release details');
      }
    };

    if (id) {
      fetchReleaseDetails();
    }
  }, [id]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 text-xl">Error: {error}</Text>
      </View>
    );
  }

  if (!release) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Loading release details...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4">
      {/* Basic Info */}
      <View className="flex-row items-center justify-between mb-2">
                <Text className="text-2xl font-bold">{release.title}</Text>
                <AlbumDropDown albumid={id} />
            </View>

      {/* Artwork */}
      {release.thumb && (
        <Image
          source={{ uri: release.thumb }}
          style={{ width: 150, height: 150 }}
          className="mb-4"
          resizeMode="cover"
        />
      )}

      {/* Release Info */}
      <Text className="text-base mb-1">Year: {release.year}</Text>
      <Text className="text-base mb-1">Country: {release.country}</Text>
      <Text className="text-base mb-1">Label: {release.label?.[0] || 'N/A'}</Text>
      <Text className="text-base mb-4">Format: {release.format?.[0] || 'N/A'}</Text>

      {/* Tracklist */}
      {release.tracklist && release.tracklist.length > 0 && (
        <View className="mt-4">
          <Text className="text-xl font-semibold">Tracklist</Text>
          {release.tracklist.map((track, index) => (
            <Text key={index} className="mt-1">{track.position} - {track.title}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

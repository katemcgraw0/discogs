import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { supabase } from "../lib/supabase-client";
import axios from "axios";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; // ✅ Auto-refresh on tab focus

const CONSUMER_KEY = "your_consumer_key";     
const CONSUMER_SECRET = "your_consumer_secret";

export default function Library() {
    const [user, setUser] = useState(null);
    const [albumIds, setAlbumIds] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Step 1: Get the current user
    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) {
                Alert.alert("Error fetching user");
                return;
            }
            setUser(data.user);
        };

        fetchUser();
    }, []);

    // Step 2: Fetch albums whenever this tab is focused
    useFocusEffect(
        useCallback(() => {
            if (user) {
                fetchUserAlbums();
            }
        }, [user])
    );

    // Fetch album IDs from Supabase
    const fetchUserAlbums = async () => {
        setLoading(true);
        setAlbums([]); // ✅ Clear old albums before fetching new ones

        try {
            const { data, error } = await supabase
                .from("collections")
                .select("album_id")
                .eq("user_id", user?.id);

            if (error) {
                console.log(error);
                throw new Error("Error fetching album collection");
            }

            console.log("User album data:", data);
            const ids = data.map((item) => item.album_id);
            console.log("Fetched Album IDs:", ids);
            setAlbumIds(ids);

            // Step 3: Fetch album details
            fetchAlbumDetails(ids);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Fetch album details from Discogs API
    const fetchAlbumDetails = async (ids) => {
        try {
            const albumData = await Promise.all(
                ids.map(async (id) => {
                    const url = `https://api.discogs.com/releases/${id}`;
                    console.log("Fetching release details from:", url);
                    const response = await axios.get(url, {
                        params: {
                            key: CONSUMER_KEY,
                            secret: CONSUMER_SECRET,
                        },
                        headers: {
                            "User-Agent": "MyVinylApp/1.0",
                        },
                    });

                    return response.data;
                })
            );

            setAlbums(albumData);
        } catch (err) {
            console.log(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#ff0000" />
                <Text className="mt-4">Loading your collection...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-red-500 text-xl">Error: {error}</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 p-4">
            <Text className="text-2xl font-bold mb-4 mt-4">Your Collection</Text>

            {albums.length === 0 ? (
                <Text className="text-gray-500">No albums found in your collection.</Text>
            ) : (
                albums.map((album) => (
                    <View key={album.id} className="mb-6 flex-row items-center">
                        {/* Album Image */}
                        {album.thumb && (
                            <Image
                                source={{ uri: album.thumb }}
                                className="w-20 h-20 rounded-lg mr-4"
                                resizeMode="cover"
                            />
                        )}

                        {/* Album Details */}
                        <View className="flex-1">
                            <Text className="text-lg font-semibold">{album.title}</Text>
                            <Text className="text-sm text-gray-500">
                                {album.year} • {album.country}
                            </Text>

                            {/* Link to album details */}
                            <Link href={`/browse/${album.id}`} className="text-blue-500 mt-2">
                                View Details
                            </Link>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
}

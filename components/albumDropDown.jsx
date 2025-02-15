import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Pressable } from 'react-native';
import { supabase } from '../app/lib/supabase-client';

export default function AlbumDropDown({ albumid }) {
  const [user, setUser] = useState(null);
  const [userOwnsAlbum, setUserOwnsAlbum] = useState(false);
  const [userWantsAlbum, setUserWantsAlbum] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        Alert.alert('ERROR ACCESSING USER');
        return;
      }
      setUser(data.user);
    };

    fetchUser();
  }, []);

  // Fetch user album relation after user is set
  useEffect(() => {
    if (user?.id) {
      getUserRelationToAlbum();
    }
  }, [user]);

  const getUserRelationToAlbum = async () => {
    if (!user?.id) return;

    try {
      const { data: collectionData, error: collectionDataError } = await supabase
        .from('collections')
        .select('*')
        .eq('album_id', albumid)
        .eq('user_id', user.id);

      if (collectionDataError) {
        console.error(collectionDataError);
        Alert.alert('Error getting data');
      } else {
        setUserOwnsAlbum(collectionData.length > 0);
      }

      const { data: wishListData, error: wishListDataError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('album_id', albumid)
        .eq('user_id', user.id);

      if (wishListDataError) {
        console.error(wishListDataError);
        Alert.alert('Error getting data');
      } else {
        setUserWantsAlbum(wishListData.length > 0);
      }
    } catch (err) {
      console.error('Database Error:', err);
    }
  };

  const addAlbumToCollection = async () => {
    if (!user?.id) return;

    try {
      if (!userOwnsAlbum) {
        const { error } = await supabase
          .from('collections')
          .insert([{ user_id: user.id, album_id: albumid }]);

        if (error) {
          Alert.alert('Error adding to collection');
        } else {
          Alert.alert('Added to collection');
          getUserRelationToAlbum();
        }
      } else {
        const { error } = await supabase
          .from('collections')
          .delete()
          .eq('album_id', albumid)
          .eq('user_id', user.id);

        if (error) {
          Alert.alert('Error removing from collection');
        } else {
          Alert.alert('Removed from collection');
          getUserRelationToAlbum();
        }
      }
    } catch (err) {
      console.error('Collection Update Error:', err);
    }
  };

  const addAlbumToWishlist = async () => {
    if (!user?.id) return;

    try {
      if (!userWantsAlbum) {
        const { error } = await supabase
          .from('wishlists')
          .insert([{ user_id: user.id, album_id: albumid }]);

        if (error) {
          Alert.alert('Error adding to wishlist');
        } else {
          Alert.alert('Added to wishlist');
          getUserRelationToAlbum();
        }
      } else {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('album_id', albumid)
          .eq('user_id', user.id);

        if (error) {
          Alert.alert('Error removing from wishlist');
        } else {
          Alert.alert('Removed from wishlist');
          getUserRelationToAlbum();
        }
      }
    } catch (err) {
      console.error('Wishlist Update Error:', err);
    }
  };

  return (
    <View className="relative">
      {/* Three-dot menu button */}
      <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} className="p-2">
        <Text className="text-2xl font-bold">⋮</Text>
      </TouchableOpacity>

      {/* Overlay to close dropdown when clicking outside */}
      {dropdownVisible && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0)', // Invisible but catches clicks
            zIndex: 40, // Ensure it covers everything
          }}
          onPress={() => setDropdownVisible(false)}
        />
      )}

      {/* Dropdown menu */}
      {dropdownVisible && (
        <View
          style={{
            position: 'absolute',
            top: 40,
            right: 0,
            width: 160,
            backgroundColor: 'white',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
            zIndex: 50, // Ensure dropdown is above the overlay
          }}
        >
          <TouchableOpacity
            style={{ padding: 12 }}
            onPress={() => {
              addAlbumToCollection();
              setDropdownVisible(false);
            }}
          >
            {userOwnsAlbum ? <Text>Remove from Collection</Text> : <Text>Add to Collection</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 12 }}
            onPress={() => {
              addAlbumToWishlist();
              setDropdownVisible(false);
            }}
          >
            {userWantsAlbum ? <Text>Remove from Wishlist</Text> : <Text>Add to Wishlist</Text>}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

import { View, Text, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import AlbumDropDown from "./AlbumDropDown";

export default function AlbumTile({ album, showDropdown = false }) {
  return (
    <Pressable
      onPress={() => {}}
      className="flex-row items-center my-2"
    >
      {/* Album Image */}
      {album.thumb || album.cover_image ? (
        <Image
          source={{ uri: album.thumb || album.cover_image }}
          className="w-24 h-24 rounded-lg mr-4"
          resizeMode="cover"
        />
      ) : null}

      {/* Album Details */}
      <View className="flex-1">
        {/* Title + Dropdown */}
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-lg font-semibold">{album.title}</Text>
          {showDropdown && <AlbumDropDown albumid={album.id} />}
        </View>

        {/* Metadata */}
        <Text className="text-sm text-gray-500">
          {album.year ? `${album.year} • ` : ""}
          {album.country || ""}
        </Text>

        {/* Link to Album Details */}
        <Link href={`/browse/${album.id}`} className="text-blue-500 mt-2">
          View Details
        </Link>
      </View>
    </Pressable>
  );
}

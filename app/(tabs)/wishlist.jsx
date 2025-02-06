import { Text, View,  } from "react-native";
import {Link} from "expo-router";

export default function Wishlist() {
  return (
    <View
    >
      <Text className = "text-red-500 text-xl">Edit app/index.tsx to edit this screen.</Text>
      <Link className = "bg-black text-white" href="/(tabs)">LINK TO APP</Link>
    </View>
  );
}
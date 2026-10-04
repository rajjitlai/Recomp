import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { exercises } from "../data/exercises";
import { ExerciseImage } from "../components/ExerciseImage";
import { Label } from "../components/ui";

export default function Library() {
  return (
    <SafeAreaView
      edges={["top", "left", "right", "bottom"]}
      className="flex-1 bg-ink"
    >
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 24,
          maxWidth: 1000,
          width: "100%",
          alignSelf: "center",
        }}
        ListHeaderComponent={
          <View className="mb-6">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/")
              }
              className="mb-5 h-12 w-12 justify-center"
            >
              <Feather name="arrow-left" size={24} color="#d4f77d" />
            </Pressable>
            <Label>YOUR MOVEMENT LIBRARY</Label>
            <Text className="mb-3 mt-3 text-4xl font-black text-white">
              Built for variety.
            </Text>
            <Text className="text-base text-muted">
              {exercises.length} exercise entries across your weekly split.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${item.name}`}
            onPress={() =>
              router.push({
                pathname: "/exercise/[id]",
                params: { id: item.id },
              })
            }
            className="mb-3 flex-row items-center gap-4 rounded-2xl border border-line bg-panel p-3"
          >
            <ExerciseImage exercise={item} />
            <View className="flex-1">
              <Text className="text-base font-bold text-white">
                {item.name}
              </Text>
              <Text className="mt-1 text-sm capitalize text-muted">
                {item.category} · {item.equipment}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#a3aa9c" />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

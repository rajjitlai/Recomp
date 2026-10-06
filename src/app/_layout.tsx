import "../../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { WorkoutProvider, useWorkout } from "../context/WorkoutContext";
import { JourneySetup } from "../components/JourneySetup";
import { Button, Page } from "../components/ui";

function Content() {
  const { data, loading, loadError, saveError, retry, retrySave } =
    useWorkout();
  if (loading)
    return (
      <View className="flex-1 items-center justify-center gap-5 bg-ink">
        <ActivityIndicator color="#d4f77d" />
        <Text className="text-muted">Getting your week ready…</Text>
      </View>
    );
  if (loadError)
    return (
      <Page>
        <Text className="mb-6 text-xl text-white">{loadError}</Text>
        <Button label="Try again" onPress={retry} />
      </Page>
    );
  return (
    <View className="flex-1 bg-ink">
      {saveError && (
        <View className="gap-3 bg-[#4d2d21] p-4">
          <Text className="text-white">{saveError}</Text>
          <Button label="Retry save" onPress={retrySave} secondary />
        </View>
      )}
      {data.journeyCompleted === false ? (
        <JourneySetup />
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#10120f" },
            animation: "slide_from_right",
          }}
        />
      )}
    </View>
  );
}
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <WorkoutProvider>
        <StatusBar style="light" />
        <Content />
      </WorkoutProvider>
    </SafeAreaProvider>
  );
}

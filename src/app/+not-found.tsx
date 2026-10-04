import { router } from "expo-router";
import { View } from "react-native";
import { Button, Empty, Page } from "../components/ui";
export default function NotFound() {
  return (
    <Page back>
      <Empty
        title="This page took a rest day."
        body="Head home to find your workouts."
      />
      <View className="mt-5">
        <Button label="Go home" onPress={() => router.replace("/")} />
      </View>
    </Page>
  );
}

import { useState } from "react";
import { Image, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import type { Exercise } from "../data/exerciseTypes";
import { exerciseImages } from "../data/imageRegistry";

export function ExerciseImage({
  exercise,
  large = false,
}: {
  exercise: Exercise;
  large?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const source = exercise.image ?? exerciseImages[exercise.id];
  return (
    <View
      className={`items-center justify-center overflow-hidden rounded-2xl bg-[#252b21] ${large ? "h-64 w-full" : "h-16 w-16 sm:h-20 sm:w-20"}`}
    >
      {source && !failed ? (
        <Image
          source={source}
          accessibilityLabel={exercise.name}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          <View
            className={`items-center justify-center rounded-full border border-[#455139] ${large ? "h-32 w-32" : "h-12 w-12"}`}
          >
            <Feather
              name={exercise.type === "strength" ? "target" : "activity"}
              size={large ? 48 : 23}
              color="#a8bf89"
            />
          </View>
          {large && (
            <Text className="mt-4 text-xs uppercase tracking-[3px] text-muted">
              {exercise.category} / {exercise.equipment}
            </Text>
          )}
        </>
      )}
    </View>
  );
}

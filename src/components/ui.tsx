import type { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  Image,
  type ViewStyle,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export function Label({
  children,
  accent = false,
}: {
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <Text
      className={`text-xs font-bold tracking-[2px] ${accent ? "text-lime" : "text-muted"}`}
    >
      {children}
    </Text>
  );
}
export function Button({
  label,
  onPress,
  secondary = false,
  disabled = false,
  icon = "arrow-up-right",
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      className={`min-h-14 flex-row items-center justify-between gap-4 rounded-2xl px-5 py-4 ${secondary ? "border border-line bg-panel" : "bg-lime"} ${disabled ? "opacity-40" : "active:opacity-75"}`}
    >
      <Text
        className={`font-bold text-base ${secondary ? "text-white" : "text-ink"}`}
      >
        {label}
      </Text>
      <Feather
        name={icon}
        size={20}
        color={secondary ? "#d4f77d" : "#10120f"}
      />
    </Pressable>
  );
}
export function Page({
  children,
  back,
  title,
}: {
  children: ReactNode;
  back?: boolean;
  title?: string;
}) {
  return (
    <SafeAreaView
      edges={
        back ? ["top", "left", "right", "bottom"] : ["top", "left", "right"]
      }
      className="flex-1 bg-ink"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-6xl self-center px-5 pb-10 pt-5 md:px-10">
          <View className="mb-8 flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={back ? "Go back" : "Home"}
              onPress={() =>
                back && router.canGoBack() ? router.back() : router.replace("/")
              }
              className="min-h-12 flex-row items-center gap-3"
            >
              {back ? (
                <Feather name="arrow-left" size={26} color="#d4f77d" />
              ) : (
                <Image
                  source={require("../../assets/logo.png")}
                  accessibilityIgnoresInvertColors
                  className="h-7 w-7"
                  resizeMode="contain"
                />
              )}
              <Text className="text-2xl font-black tracking-tight text-white">
                {back ? (title ?? "Back") : "recomp"}
                {!back && <Text className="text-lime">.</Text>}
              </Text>
            </Pressable>
            <View className="hidden rounded-full border border-line px-3 py-2 sm:flex">
              <Text className="text-[10px] font-bold tracking-[2px] text-muted">
                YOUR WEEK. YOUR WORK.
              </Text>
            </View>
          </View>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export function Panel({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={style} className="rounded-3xl border border-line bg-panel p-5">
      {children}
    </View>
  );
}
export function SectionTitle({
  title,
  caption,
}: {
  title: string;
  caption?: string;
}) {
  return (
    <View className="mb-4 mt-7 flex-row items-center justify-between gap-3">
      <Text className="text-xl font-bold text-white">{title}</Text>
      {caption && <Text className="text-xs text-muted">{caption}</Text>}
    </View>
  );
}
export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <Panel>
      <Feather name="wind" size={32} color="#d4f77d" />
      <Text className="mb-2 mt-4 text-xl font-bold text-white">{title}</Text>
      <Text className="text-base leading-6 text-muted">{body}</Text>
    </Panel>
  );
}

import { View } from "react-native";
export function ProgressBar({
  value,
  total,
}: {
  value: number;
  total: number;
}) {
  const percent = total ? Math.min(100, Math.max(0, (value / total) * 100)) : 0;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: value }}
      className="h-1.5 overflow-hidden rounded-full bg-line"
    >
      <View
        className="h-full rounded-full bg-lime"
        style={{ width: `${percent}%` }}
      />
    </View>
  );
}

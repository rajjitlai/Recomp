import { Platform } from "react-native";
import { isRunningInExpoGo } from "expo";

export function remindersAvailable(): boolean {
  return !(Platform.OS === "android" && isRunningInExpoGo());
}

export async function setReminders(enabled: boolean): Promise<void> {
  if (!remindersAvailable())
    throw new Error(
      "Workout reminders need an Android development build. Expo Go does not support this notification setup.",
    );
  // Import lazily: expo-notifications initializes push-token registration on import,
  // which throws in Android Expo Go even when the app only schedules local reminders.
  const Notifications = await import("expo-notifications");
  if (!enabled) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return;
  }
  if (Platform.OS === "android")
    await Notifications.setNotificationChannelAsync("workouts", {
      name: "Workout reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted)
    throw new Error(
      "Notifications are not allowed. Enable them in your device settings to receive reminders.",
    );
  await Notifications.cancelAllScheduledNotificationsAsync();
  try {
    for (let weekday = 2; weekday <= 7; weekday++)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to show up.",
          body: "Your workout is ready. Open Recomp and take the first rep.",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour: 8,
          minute: 0,
          channelId: "workouts",
        },
      });
  } catch (error) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    throw error;
  }
}

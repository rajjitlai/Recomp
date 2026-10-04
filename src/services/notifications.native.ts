import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

export async function setReminders(enabled: boolean): Promise<void> {
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

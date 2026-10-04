import { Text } from "react-native";
import { Page, Label } from "../../components/ui";
import { WorkoutCard } from "../../components/WorkoutCard";
import { useWorkout } from "../../context/WorkoutContext";
import { workoutDays } from "../../data/exerciseTypes";
import { todayDay, weekLabel } from "../../services/workoutRotation";
import { historyKey } from "../../services/state";
export default function Train() {
  const { data, plan, week, completed } = useWorkout();
  return (
    <Page>
      <Label>{weekLabel(week)}</Label>
      <Text className="mb-3 mt-3 text-4xl font-black text-white">
        Your training week.
      </Text>
      <Text className="mb-7 text-base text-muted">
        Six sessions. A clear plan for every day.
      </Text>
      {workoutDays.map((day) => (
        <WorkoutCard
          key={day}
          workout={plan.days[day]}
          week={week}
          done={completed(day).length}
          skipped={data.history[historyKey(week, day)]?.skipped}
          today={todayDay() === day}
        />
      ))}
    </Page>
  );
}

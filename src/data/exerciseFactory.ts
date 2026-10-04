import type { Exercise, ExerciseCategory, Pool } from "./exerciseTypes";

export const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function instruction(name: string): string {
  if (/leg extension/i.test(name))
    return "Sit with your back supported and align your knees with the machine pivot. Straighten your knees smoothly, then lower slowly without lifting your hips.";
  if (/curl/i.test(name) && !/leg|hamstring/i.test(name))
    return "Keep your elbows steady beside your torso. Curl with control, then lower through a comfortable range without swinging.";
  if (/squat|lunge|step-up/i.test(name))
    return "Brace your trunk and keep your knee tracking over your foot. Lower under control, then drive through your whole foot to stand.";
  if (/deadlift|good morning|pull-through/i.test(name))
    return "Brace your trunk and hinge at your hips. Keep the load close and your back neutral; drive your hips forward to stand.";
  if (/row|pulldown|pull-ups|chin-ups/i.test(name))
    return "Keep your torso stable. Pull your elbows toward your body, pause briefly, and return slowly without shrugging.";
  if (/press|push-up/i.test(name))
    return "Set a stable base and brace your trunk. Lower with control, then press smoothly without bouncing or locking your joints forcefully.";
  if (/fly|crossover|pec deck/i.test(name))
    return "Keep a soft bend in your elbows. Move your arms through a comfortable arc and return slowly without overstretching your shoulders.";
  if (/extension|pushdown|crusher|kickback/i.test(name))
    return "Keep your upper arms stable. Extend your elbows smoothly, then return with control without swinging the load.";
  if (/calf/i.test(name))
    return "Rise onto the balls of your feet, pause, and lower your heels slowly through a comfortable range. Avoid bouncing.";
  if (/shrug|farmer/i.test(name))
    return "Stand tall with your ribs stacked over your hips. Keep the load controlled and avoid rolling your shoulders.";
  if (/thrust|bridge/i.test(name))
    return "Keep your feet planted and brace your trunk. Squeeze your glutes to lift your hips without arching your lower back.";
  if (/raise/i.test(name) && !/leg|knee|calf/i.test(name))
    return "Keep your trunk still and elbows softly bent. Raise with control to a comfortable height, then lower slowly.";
  if (/plank|dead bug|bird dog|hollow/i.test(name))
    return "Brace your abdomen and breathe steadily. Keep your trunk stable and shorten the movement if your back starts to arch.";
  if (/leg curl|hamstring curl/i.test(name))
    return "Keep your hips stable. Bend your knees with control and return slowly without arching your lower back.";
  return "Start in a stable position and move through a comfortable range. Keep each repetition controlled and breathe steadily; pause to reset your position when needed.";
}

export function createExercise(name: string, pool: Pool): Exercise {
  const glute =
    /hip thrust|glute bridge|pull-through|split squat|reverse lunge/i.test(
      name,
    );
  const category: ExerciseCategory =
    pool === "posterior"
      ? glute
        ? "glutes"
        : "hamstrings"
      : pool === "conditioning" || pool === "bodyweight"
        ? "cardio"
        : pool;
  const circuit = ["conditioning", "bodyweight", "core"].includes(pool);
  const movementPattern: Exercise["movementPattern"] =
    pool === "bodyweight"
      ? /push-up/i.test(name)
        ? "push"
        : "legs"
      : pool === "core"
        ? /plank|mountain climber|dead bug|bird dog|hollow/i.test(name)
          ? "stability"
          : "core-flexion"
        : pool === "conditioning"
          ? /jump|burpee/i.test(name) && !/jump rope/i.test(name)
            ? "jump"
            : "locomotion"
          : "strength";
  const compound =
    /press|squat|deadlift|row|pull-up|chin-up|dip|lunge|thrust|push-up|rack pull|good morning|step-up/i.test(
      name,
    ) && !/pushdown/i.test(name);
  const equipment = /cable|pushdown|pulldown|face pull|bayesian/i.test(name)
    ? "Cable machine"
    : /dumbbell|hammer|concentration|zottman|arnold/i.test(name)
      ? "Dumbbells"
      : /smith/i.test(name)
        ? "Smith machine"
        : /machine|pec deck|leg press|leg extension|leg curl|hack squat/i.test(
              name,
            )
          ? "Machine"
          : /ez-bar/i.test(name)
            ? "EZ bar"
            : /barbell|deadlift|pendlay|rack pull|good morning|jm press|skull crusher|front squat|push press|t-bar/i.test(
                  name,
                )
              ? "Barbell"
              : /box jump|step-up/i.test(name)
                ? "Stable box"
                : /jump rope/i.test(name)
                  ? "Jump rope"
                  : /pull-up|chin-up|hanging/i.test(name)
                    ? "Pull-up bar"
                    : /bench dip|incline push|decline push|bulgarian/i.test(
                          name,
                        )
                      ? "Bench"
                      : /farmer/i.test(name)
                        ? "Dumbbells"
                        : "Bodyweight";
  const id = `${pool}-${slug(name)}`;
  const folder = ["quads", "posterior", "calves"].includes(pool)
    ? "legs"
    : circuit
      ? "cardio"
      : pool;
  return {
    id,
    name,
    category,
    pool,
    movementPattern,
    secondaryCategories:
      pool === "posterior" ? [glute ? "hamstrings" : "glutes"] : [],
    type: pool === "core" ? "core" : circuit ? "cardio" : "strength",
    equipment,
    sets: circuit ? 3 : compound || pool === "calves" ? 4 : 3,
    reps: pool === "calves" ? "12–20" : compound ? "6–10" : "10–15",
    workSeconds: 40,
    restSeconds: 20,
    instructions: instruction(name),
    imagePath: `assets/exercises/${folder}/${slug(name)}.jpg`,
  };
}

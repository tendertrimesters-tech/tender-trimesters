/** Shared mood definitions used across HomeScreen and JournalScreen */

export type Mood = "glowing" | "calm" | "tired" | "anxious" | "teary" | "grateful" | "nauseous" | "energized";

export const MOODS: { value: Mood; emoji: string; label: string; bg: string }[] = [
  { value: "glowing", emoji: "🌸", label: "Glowing", bg: "bg-blush/40" },
  { value: "calm", emoji: "🌿", label: "Calm", bg: "bg-sage/40" },
  { value: "tired", emoji: "🌙", label: "Tired", bg: "bg-butter" },
  { value: "anxious", emoji: "💭", label: "Anxious", bg: "bg-lavender/40" },
  { value: "teary", emoji: "💧", label: "Teary", bg: "bg-blush/30" },
  { value: "grateful", emoji: "💛", label: "Grateful", bg: "bg-butter" },
  { value: "nauseous", emoji: "🍃", label: "Nauseous", bg: "bg-sage/30" },
  { value: "energized", emoji: "✨", label: "Energized", bg: "bg-blush/40" },
];

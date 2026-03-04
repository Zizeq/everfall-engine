import type { ScriptLine } from "../types";

// Standard Emotion Map (So you don't have to define these in every file)
const STANDARD_EMOTIONS: Record<string, string> = {
  n: "neutral",
  h: "happy",
  s: "sad",
  a: "angry",
  su: "surprised",
  f: "frustrated",
  u: "unsure",
  w: "worried",
};

export const parseScript = (rawText: string) => {
  const lines = rawText.split("\n");
  const parsedLines: ScriptLine[] = [];

  // This map will store "w" -> "Willow" found in the file
  const localCharMap: Record<string, string> = {};

  lines.forEach((line, index) => {
    const clean = line.trim();
    if (!clean || clean.startsWith("//")) return;

    // 1. HEADER PARSING (#DEF_CHARS)
    if (clean.includes("=")) {
      // Check if this line is a definition like "w = Willow"
      const [key, value] = clean.split("=").map((s) => s.trim());
      // We assume single letters are definitions if they aren't dialogue
      if (key.length <= 3 && value) {
        localCharMap[key] = value;
        return; // Don't treat this as a game line
      }
    }

    // 2. COMMAND PARSING (@ bg graduation)
    if (clean.startsWith("@")) {
      const parts = clean.substring(1).trim().split(" ");
      const command = parts[0];
      const args = parts.slice(1);

      parsedLines.push({
        id: `line-${index}`,
        type: "command",
        command: command, // "bg" or "music"
        args: args, // ["graduation"]
      });
      return;
    }

    if (clean.startsWith("$")) {
      const parts = clean.substring(1).trim().split(" ");
      const command = parts[0]; // "fact" or "stat"
      // Join the rest back together for text, or keep array for stats
      const args = parts.slice(1);

      parsedLines.push({
        id: `line-${index}`,
        type: "command",
        command: command,
        args: args,
      });
      return;
    }

    // 4. DIALOGUE PARSING (w h Hello)
    const parts = clean.split(" ");
    const charId = parts[0]; // "w"

    // Check if "w" is in our map
    if (localCharMap[charId]) {
      const emotionCode = parts[1]; // "h"
      const text = parts.slice(2).join(" "); // "I can't believe..."

      // Convert "h" to "happy" using our standard map
      const fullEmotion = STANDARD_EMOTIONS[emotionCode] || emotionCode;
      // Get full name "Willow" from our local map
      const fullName = localCharMap[charId];

      parsedLines.push({
        id: `line-${index}`,
        type: "dialogue",
        characterId: fullName, // Store "Willow" (not "w")
        emotion: fullEmotion, // Store "happy" (not "h")
        text: text,
      });
    }
  });

  return parsedLines;
};

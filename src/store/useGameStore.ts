import { create } from "zustand";
import type { GameState, ScriptLine } from "../types";

interface GameActions {
  // Navigation & Engine
  advanceLine: () => void;
  loadScript: (lines: ScriptLine[]) => void;

  // Visuals
  setBackground: (bgId: string) => void;
  setSprite: (charName: string, emotion: string) => void;

  // Journal Features
  setJournalNote: (charId: string, text: string) => void;
  unlockCharacter: (charId: string) => void;
  addJournalFact: (charId: string, text: string) => void;
  toggleFact: (charId: string, factIndex: number) => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  // --- INITIAL STATE ---
  currentChapter: 1,
  currentLineIndex: 0,
  scriptLines: [],
  energy: 100,
  inventory: [],

  // Stats
  relationships: {
    ash: { comfort: 50, bond: 50 },
    nova: { comfort: 50, bond: 50 },
  },

  // Visuals
  currentBg: "",
  activeSprites: {},

  // Journal Defaults
  journalNotes: {},
  journalFacts: {}, // New: Stores the auto-collected facts
  unlockedCharacters: [],

  // --- ACTIONS ---

  // 1. LOAD SCRIPT
  loadScript: (lines) => {
    set({ scriptLines: lines, currentLineIndex: 0 });
    // Immediately try to process the first line
    get().advanceLine();
  },

  // 2. THE SMART ADVANCE ACTION (The Engine Brain)
  advanceLine: () => {
    const state = get();
    const nextIndex = state.currentLineIndex + 1;
    const line = state.scriptLines[state.currentLineIndex];

    // Safety check: End of script
    if (!line) return;

    // A. HANDLE COMMANDS
    if (line.type === "command") {
      // Command: @ bg kitchen
      if (line.command === "bg" && line.args) {
        set({ currentBg: line.args[0] });
      }

      // Command: $ fact nova He is annoying
      if (line.command === "fact" && line.args && line.args.length >= 2) {
        const charId = line.args[0].toLowerCase(); // "nova"
        const text = line.args.slice(1).join(" "); // "He is annoying"
        state.addJournalFact(charId, text);
      }

      // IMPORTANT: If it was a command, don't stop!
      // Move to the NEXT line immediately.
      set({ currentLineIndex: nextIndex });

      // Slight delay to prevent infinite loops if script is broken
      setTimeout(() => get().advanceLine(), 0);
      return;
    }

    // B. HANDLE DIALOGUE
    if (line.type === "dialogue") {
      // Update sprites if defined
      if (line.characterId && line.emotion) {
        set((state) => ({
          activeSprites: {
            ...state.activeSprites,
            [line.characterId!]: line.emotion!,
          },
        }));
      }
      // We STOP here and wait for player input (clicks)
    }
  },

  // 3. MANUAL SETTERS (Helpers)
  setBackground: (bgId) => set({ currentBg: bgId }),

  setSprite: (charName, emotion) =>
    set((state) => ({
      activeSprites: { ...state.activeSprites, [charName]: emotion },
    })),

  // 4. JOURNAL ACTIONS
  setJournalNote: (charId, text) =>
    set((state) => ({
      journalNotes: { ...state.journalNotes, [charId]: text },
    })),

  unlockCharacter: (charId) =>
    set((state) => ({
      unlockedCharacters: [...state.unlockedCharacters, charId],
    })),

  addJournalFact: (charId, text) =>
    set((state) => {
      const currentFacts = state.journalFacts[charId] || [];
      // Avoid duplicates
      if (currentFacts.some((f) => f.text === text)) return {};

      return {
        journalFacts: {
          ...state.journalFacts,
          [charId]: [...currentFacts, { text, crossed: false }],
        },
      };
    }),

  toggleFact: (charId, index) =>
    set((state) => {
      const facts = [...(state.journalFacts[charId] || [])];
      if (facts[index]) {
        // Flip the 'crossed' boolean
        facts[index] = { ...facts[index], crossed: !facts[index].crossed };
      }
      return { journalFacts: { ...state.journalFacts, [charId]: facts } };
    }),
}));

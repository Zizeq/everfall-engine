import { create } from "zustand";
import type { GameState, ScriptLine } from "../types";

type ScreenName = "main_menu" | "game" | "options" | "save_load"; // Added "save_load"

interface GameActions {
  // Navigation & Meta
  currentScreen: ScreenName;
  setScreen: (screen: ScreenName) => void;
  resetGame: () => void;

  // --- NEW SAVE/LOAD ACTIONS ---
  saveGame: (slotId: string) => void;
  loadGame: (slotId: string) => boolean;

  // Engine
  advanceLine: () => void;
  loadScript: (lines: ScriptLine[]) => void;
  // ... (rest of your existing actions: setBackground, setSprite, etc.)
  setBackground: (bgId: string) => void;
  setSprite: (charName: string, emotion: string) => void;
  setJournalNote: (charId: string, text: string) => void;
  unlockCharacter: (charId: string) => void;
  addJournalFact: (charId: string, text: string) => void;
  toggleFact: (charId: string, factIndex: number) => void;

  settings: { musicVolume: number; textSpeed: number };
  setSetting: (key: "musicVolume" | "textSpeed", value: number) => void;
}

const INITIAL_STATE = {
  currentChapter: 1,
  currentLineIndex: 0,
  scriptLines: [],
  energy: 100,
  inventory: [],
  relationships: {
    ash: { comfort: 50, bond: 50 },
    nova: { comfort: 50, bond: 50 },
  },
  currentBg: "",
  activeSprites: {},
  journalNotes: {},
  journalFacts: {},
  unlockedCharacters: [],
  settings: { musicVolume: 50, textSpeed: 50 },
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  // --- STATE ---
  currentScreen: "main_menu",
  ...INITIAL_STATE,

  // --- ACTIONS ---
  setScreen: (screen) => set({ currentScreen: screen }),

  resetGame: () => {
    set({
      ...INITIAL_STATE,
      currentScreen: "game",
    });
  },

  // --- SAVE/LOAD LOGIC ---
  saveGame: (slotId) => {
    const state = get();

    // Create the Save Object
    const saveData = {
      date: new Date().toLocaleString(),
      previewText: `Line ${state.currentLineIndex} - ${state.currentBg || "Unknown Location"}`,
      gameState: {
        currentChapter: state.currentChapter,
        currentLineIndex: state.currentLineIndex,
        scriptLines: state.scriptLines,
        energy: state.energy,
        inventory: state.inventory,
        relationships: state.relationships,
        currentBg: state.currentBg,
        activeSprites: state.activeSprites,
        journalNotes: state.journalNotes,
        journalFacts: state.journalFacts,
        unlockedCharacters: state.unlockedCharacters,
      },
    };

    // Save to LocalStorage
    localStorage.setItem(`save_${slotId}`, JSON.stringify(saveData));
    console.log(`Game saved to slot ${slotId}`);
  },

  loadGame: (slotId) => {
    try {
      const json = localStorage.getItem(`save_${slotId}`);
      if (!json) return false;

      const { gameState } = JSON.parse(json);

      // Merge saved state into current store
      set({
        ...gameState,
        currentScreen: "game", // Force screen to game
      });
      return true;
    } catch (e) {
      console.error("Failed to load save:", e);
      return false;
    }
  },

  // ... (Keep your existing advanceLine, loadScript, setters here)
  loadScript: (lines) => {
    set({ scriptLines: lines, currentLineIndex: 0 });
    get().advanceLine();
  },

  advanceLine: () => {
    // ... (Paste your existing advanceLine logic here)
    // I'm omitting it for brevity, but keep the one from the previous step!
    const state = get();
    const nextIndex = state.currentLineIndex + 1;
    const line = state.scriptLines[state.currentLineIndex];

    if (!line) return;

    if (line.type === "command") {
      if (line.command === "bg" && line.args) set({ currentBg: line.args[0] });
      if (line.command === "fact" && line.args) {
        const charId = line.args[0].toLowerCase();
        const text = line.args.slice(1).join(" ");
        state.addJournalFact(charId, text);
      }
      set({ currentLineIndex: nextIndex });
      setTimeout(() => get().advanceLine(), 0);
      return;
    }

    if (line.type === "dialogue") {
      if (line.characterId && line.emotion) {
        set((state) => ({
          activeSprites: {
            ...state.activeSprites,
            [line.characterId!]: line.emotion!,
          },
        }));
      }
    }
  },

  setBackground: (bgId) => set({ currentBg: bgId }),
  setSprite: (charName, emotion) =>
    set((state) => ({
      activeSprites: { ...state.activeSprites, [charName]: emotion },
    })),
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
      if (facts[index])
        facts[index] = { ...facts[index], crossed: !facts[index].crossed };
      return { journalFacts: { ...state.journalFacts, [charId]: facts } };
    }),
  setSetting: (key, value) =>
    set((state) => ({ settings: { ...state.settings, [key]: value } })),
}));

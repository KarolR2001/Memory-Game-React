import { create } from 'zustand';
import { TileData, GameState, GameRecord } from '../types/gameTypes';
import card1 from '../assets/1.jpg';
import card2 from '../assets/2.jpg';
import card3 from '../assets/3.jpg';
import card4 from '../assets/4.jpg';
import card5 from '../assets/5.jpg';
import card6 from '../assets/6.jpg';
import card7 from '../assets/7.jpg';
import card8 from '../assets/8.jpg';
import card9 from '../assets/9.jpg';
import card10 from '../assets/10.jpg';
import card11 from '../assets/11.png';
import card12 from '../assets/12.png';
import card13 from '../assets/13.jpg';
import card14 from '../assets/14.jpg';
import card15 from '../assets/15.png';
import card16 from '../assets/16.png';
import card17 from '../assets/17.png';
import card18 from '../assets/18.png';

const imageSet = [
  card1, card2, card3, card4, card5, card6, card7, card8, card9,
  card10, card11, card12, card13, card14, card15, card16, card17, card18,
];

const difficultyMap = {
  level1: 3,
  level2: 6,
  level3: 9,
};

type GameStore = GameState & {
  initializePreview: () => void;
  startGame: () => void;
  revealTile: (id: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  setDifficulty: (level: 'level1' | 'level2' | 'level3' | null) => void;
  resetGame: () => void;
  saveGameToHistory: () => void;
  getGameHistory: () => GameRecord[];
  clearGameHistory: () => void;
  isGameStarted: boolean;
  initializeGame: () => void;
  showWinScreenReset: boolean;
  resetShowWinScreen: () => void;
  setIsGameStarted: (value: boolean) => void;
};

export const useGameStore = create<GameStore>((set, get) => {
  let timerId: number | null = null;

  return {
    tiles: [],
    attempts: 0,
    matchedPairs: 0,
    timer: 0,
    difficulty: null,
    isGameStarted: false,
    showWinScreenReset: false,

    initializePreview: () => {
      const tiles = Array(12).fill(null).map((_, i) => ({
        id: i,
        image: '',
        isRevealed: false,
        isMatched: false,
      }));
      set({ tiles, attempts: 0, matchedPairs: 0, timer: 0 });
      console.log("gameStore: initializePreview called");
    },
    initializeGame: () => {
      set(() => ({
        tiles: [],
        attempts: 0,
        matchedPairs: 0,
        timer: 0,
        isGameStarted: false,
      }));
      get().initializePreview();
      console.log("gameStore: initializeGame called");
    },

    startGame: () => {
      const difficulty = get().difficulty;
      if (!difficulty) return;

      const pairCount = difficultyMap[difficulty];
      const selectedImages = imageSet.slice(0, pairCount);
      const tiles: TileData[] = [...selectedImages, ...selectedImages]
        .map((image, index) => ({
          id: index,
          image: image as string,
          isRevealed: false,
          isMatched: false,
        }))
        .sort(() => Math.random() - 0.5);

      set({
        tiles,
        attempts: 0,
        matchedPairs: 0,
        timer: 0,
        isGameStarted: true,
        showWinScreenReset: true,
      });
      get().startTimer();
      console.log("gameStore: startGame called");
    },

    revealTile: (id: number) => {
      if (!get().isGameStarted) return;
      set((state) => {
        const tiles = [...state.tiles];
        const revealedTiles = tiles.filter((tile) => tile.isRevealed && !tile.isMatched);

        if (revealedTiles.length >= 2) return state;

        const tileIndex = tiles.findIndex((tile) => tile.id === id);
        if (tileIndex === -1 || tiles[tileIndex].isRevealed || tiles[tileIndex].isMatched) {
          return state;
        }
        tiles[tileIndex].isRevealed = true;

        const newRevealedTiles = tiles.filter((tile) => tile.isRevealed && !tile.isMatched);
        if (newRevealedTiles.length === 2) {
          const [first, second] = newRevealedTiles;
          if (first.image === second.image) {
            tiles.forEach((tile) => {
              if (tile.image === first.image) {
                tile.isMatched = true;
                tile.isRevealed = true;
              }
            });
            console.log("gameStore: revealTile matched pair", first.image);
            return {
              tiles,
              attempts: state.attempts + 1,
              matchedPairs: state.matchedPairs + 1,
            };
          }
          setTimeout(() => {
            useGameStore.setState((state) => ({
              tiles: state.tiles.map((tile) =>
                tile.isMatched ? tile : { ...tile, isRevealed: false }
              ),
            }));
          }, 1000);
          console.log("gameStore: revealTile pair not matched");
          return { tiles, attempts: state.attempts + 1 };
        }
        console.log("gameStore: revealTile tile revealed", id);
        return { tiles };
      });
    },

    startTimer: () => {
      if (timerId) return;
      timerId = setInterval(() => {
        set((state) => ({ timer: state.timer + 1 }));
      }, 1000);
      console.log("gameStore: startTimer called");
    },

    stopTimer: () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      console.log("gameStore: stopTimer called");
    },

    setDifficulty: (level) => {
      set({ difficulty: level });
      console.log("gameStore: setDifficulty called", level);
    },

    resetGame: () => {
      get().stopTimer();
      set({ tiles: [], attempts: 0, matchedPairs: 0, timer: 0 });
      get().initializePreview();
      get().setIsGameStarted(false);
      console.log("gameStore: resetGame called");
    },

    saveGameToHistory: () => {
      const { attempts, timer } = get();
      const gameRecord: GameRecord = {
        attempts,
        duration: timer,
        date: new Date().toISOString(),
      };
      const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
      history.push(gameRecord);
      localStorage.setItem('gameHistory', JSON.stringify(history));
      console.log("gameStore: saveGameToHistory called", gameRecord);
    },

    getGameHistory: () => {
      const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
      console.log("gameStore: getGameHistory called", history);
      return history;
    },

    clearGameHistory: () => {
      localStorage.setItem('gameHistory', JSON.stringify([]));
      console.log("gameStore: clearGameHistory called");
    },
    resetShowWinScreen: () => {
      set({ showWinScreenReset: false });
    },
    setIsGameStarted: (value: boolean) => {
      set({ isGameStarted: value });
    },
  };
});

useGameStore.getState().initializePreview();
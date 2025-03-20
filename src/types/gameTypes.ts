export type TileData = {
  id: number;
  image: string;
  isRevealed: boolean;
  isMatched: boolean;
};

export type GameState = {
  tiles: TileData[];
  attempts: number;
  matchedPairs: number;
  timer: number;
  difficulty: 'level1' | 'level2' | 'level3' | null; //<--null dla braku wyboru
};

export type GameRecord = {
  attempts: number;
  duration: number;
  date: string;
};
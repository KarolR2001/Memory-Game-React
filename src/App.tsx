// App.tsx
import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import GameBoard from './components/GameBoard/GameBoard';
import GameStats from './components/GameStats/GameStats';
import GameHistory from './components/GameHistory/GameHistory';
import CustomSelect from './components/Controls/CustomSelect/CustomSelect';
import CustomButton from './components/Controls/CustomButton/CustomButton'; 
import Logo from './assets/LOGO.svg';
import './styles/App.scss';

const App = () => {
  const { difficulty, setDifficulty, startGame, resetGame, isGameStarted, initializePreview } =
    useGameStore();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializePreview();
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(loadingTimeout);
  }, [initializePreview]);

  const levelOptions = [
    { value: '', label: 'Level', disabled: true },
    { value: 'level1', label: '1 (6 cards)' },
    { value: 'level2', label: '2 (12 cards)' },
    { value: 'level3', label: '3 (18 cards)' },
  ];

  if (isLoading) {
    return (
      <div className="splash-screen">
        <img src={Logo} alt="Memory Game Logo" className="splash-logo" />
      </div>
    );
  }

  return (
    <div className="App">
      <img src={Logo} alt="Memory Game Logo" className="app-logo" />
      {!isGameStarted ? (
        <div className="start-screen">
          <CustomSelect
            options={levelOptions}
            defaultValue=""
            onChange={(value) =>
              setDifficulty(value as 'level1' | 'level2' | 'level3' | null)
            }
          />
          <CustomButton onClick={startGame} disabled={!difficulty}>
            Start
          </CustomButton>
          <CustomButton onClick={() => setIsHistoryOpen(true)}>History</CustomButton>
        </div>
      ) : (
        <div className="game-screen">
          <div className="controls">
            <GameStats />
            <CustomButton onClick={resetGame}>Reset</CustomButton>
          </div>
        </div>
      )}
      <GameBoard />
      {isHistoryOpen && <GameHistory onClose={() => setIsHistoryOpen(false)} />}
    </div>
  );
};

export default App;
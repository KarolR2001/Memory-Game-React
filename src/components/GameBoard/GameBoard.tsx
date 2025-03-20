import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import Tile from '../Tile/Tile';
import Confetti from 'react-confetti';
import './GameBoard.scss';
import CustomButton from '../../components/Controls/CustomButton/CustomButton';

const GameBoard = () => {
  const { 
    tiles, 
    difficulty, 
    matchedPairs, 
    startGame, 
    stopTimer, 
    saveGameToHistory, 
    resetGame, 
    setDifficulty, 
    showWinScreenReset, 
    resetShowWinScreen 
  } = useGameStore();
  
  const totalPairs = difficulty ? difficultyMap[difficulty] : 0;
  const gameSavedRef = useRef(false);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    
    if (matchedPairs === totalPairs && matchedPairs > 0 && !showWinScreen) {
      stopTimer();
      
      if (!gameSavedRef.current) {
        saveGameToHistory();
        gameSavedRef.current = true;
      }
      
      setShowWinScreen(true);

      setTimeout(() => {
        setShowConfetti(true);
        console.log("Confetti should be visible now");
      }, 300); 

      const resetTimeout = setTimeout(() => {
        console.log("Resetting game after celebration");
        resetGame();
        setShowWinScreen(false);
        setShowConfetti(false);
        gameSavedRef.current = false;
      }, 10000);
      
      return () => clearTimeout(resetTimeout);
    }
    
    if (showWinScreenReset) {
      setShowWinScreen(false);
      resetShowWinScreen();
    }
  }, [matchedPairs, totalPairs, stopTimer, saveGameToHistory, resetGame, showWinScreen, showWinScreenReset, resetShowWinScreen]);
  
  const handleNextLevel = () => {
    if (difficulty === 'level1') {
      setDifficulty('level2');
    } else if (difficulty === 'level2') {
      setDifficulty('level3');
    }
    startGame();
    setShowWinScreen(false);
    setShowConfetti(false);
    gameSavedRef.current = false;
  };
  
  if (showWinScreen) {
    return (
      <div className="game-board">
        <div className="win-screen">
          <h2>You Won!</h2>
          <CustomButton 
            onClick={() => {
              startGame();
              console.log("Play Again clicked");
            }} 
            variant="light"
          >
            Play Again
          </CustomButton>
          {difficulty !== 'level3' && (
            <CustomButton onClick={handleNextLevel} variant="light">
              Next Level
            </CustomButton>
          )}
        </div>
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={900}
            recycle={false}
            run={true}
            tweenDuration={10000}
          />
        )}
      </div>
    );
  }
  
  return (
    <div className={`game-board ${difficulty || 'preview'}`}>
      {tiles.map((tile) => (
        <Tile key={tile.id} {...tile} />
      ))}
    </div>
  );
};

export default GameBoard;

const difficultyMap = {
  level1: 3,
  level2: 6,
  level3: 9,
};
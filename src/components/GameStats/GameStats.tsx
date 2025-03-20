import { useGameStore } from '../../store/gameStore';
import './GameStats.scss';

const GameStats = () => {
  const { attempts, timer } = useGameStore();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-stats">
      <div className="stat">
        <span className="label">Attempts:</span>
        <span className="value">{attempts}</span>
      </div>
      <div className="stat">
        <span className="label">Time:</span>
        <span className="value">{formatTime(timer)}</span>
      </div>
    </div>
  );
};

export default GameStats;
import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import './GameHistory.scss';
import CustomSelect from '../Controls/CustomSelect/CustomSelect'; 
import CustomButton from '../Controls/CustomButton/CustomButton';

type GameHistoryProps = {
  onClose: () => void;
};

const GameHistory = ({ onClose }: GameHistoryProps) => {
  const { getGameHistory, clearGameHistory } = useGameStore();
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'attempts' | 'duration'>('date-desc');
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sortedHistory = [...getGameHistory()].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'attempts':
        return a.attempts - b.attempts;
      case 'duration':
        return a.duration - b.duration;
      default:
        return 0;
    }
  });

  const bestGame = sortedHistory.length > 0
    ? sortedHistory.reduce((prev, curr) => (prev.attempts < curr.attempts ? prev : curr))
    : null;

  const handleClearHistory = () => {
    setShowClearConfirmation(true);
  };

  const confirmClearHistory = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearGameHistory();
      setIsClearing(false);
      setShowClearConfirmation(false);
    }, 500);
  };

  const sortOptions = [ 
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'attempts', label: 'Attempts' },
    { value: 'duration', label: 'Duration' },
  ];

  return (
    <div className="game-history-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <h2>Game History</h2>
        <div className="history-stats">
          <p>Total Games: {sortedHistory.length}</p>
          {bestGame && (
            <p>
              Best Score: {bestGame.attempts} attempts ({formatTime(bestGame.duration)})
            </p>
          )}
        </div>
        <div className="sort-controls">
          <label htmlFor="sort-by">Sort by:</label>
          <CustomSelect 
            options={sortOptions}
            defaultValue={sortBy}
            onChange={(value) => setSortBy(value as 'date-desc' | 'date-asc' | 'attempts' | 'duration')}
          />
        </div>
        {sortedHistory.length === 0 ? (
          <p>No games played yet.</p>
        ) : (
          <ul className={`history-list ${isClearing ? 'clearing' : ''}`}>
            {sortedHistory.map((game, index) => (
              <li
                key={index}
                className={`history-item ${game.attempts === bestGame?.attempts ? 'best-score' : ''}`}
              >
                <span className="date">{formatDate(game.date)}</span>
                <span className="attempts">Attempts: {game.attempts}</span>
                <span className="duration">Time: {formatTime(game.duration)}</span>
              </li>
            ))}
          </ul>
        )}
        {showClearConfirmation && (
          <div className="clear-confirmation">
            <p>Are you sure you want to clear the history?</p>
            <div className="confirmation-buttons">
              <CustomButton onClick={confirmClearHistory} variant="primary">
                Yes
              </CustomButton>
              <CustomButton onClick={() => setShowClearConfirmation(false)} variant="secondary">
                No
              </CustomButton>
            </div>
          </div>
        )}
        {!showClearConfirmation && (
          <div className="modal-buttons">
            <CustomButton onClick={handleClearHistory} variant="primary">
              Clear History
            </CustomButton>
            <CustomButton onClick={onClose} variant="light">
              Close
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameHistory;
import { useEffect, useState } from 'react';
import { TileData } from '../../types/gameTypes';
import { useGameStore } from '../../store/gameStore';
import './Tile.scss';

const Tile = ({ id, image, isRevealed, isMatched }: TileData) => {
  const { revealTile } = useGameStore();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isMatched && !isAnimating) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isMatched]);

  const handleClick = () => {
    if (!isRevealed && !isMatched) {
      revealTile(id);
    }
  };

  return (
    <div
      className={`tile ${isRevealed || isMatched ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={handleClick}
    >
      <div className="tile-inner">
        <div className="tile-back" />
        <div className={`tile-front ${isAnimating ? 'pulse' : ''}`}>
          {image && <img src={image} alt="tile" />}
        </div>
      </div>
    </div>
  );
};

export default Tile;
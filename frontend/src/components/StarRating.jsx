import { useState } from 'react';
import { Star } from 'lucide-react';

const RATING_LABELS = {
  1: '1 - Poor',
  2: '2 - Fair',
  3: '3 - Good',
  4: '4 - Very Good',
  5: '5 - Excellent',
};

export function StarDisplay({ rating, showNumeric = true }) {
  const value = Number(rating) || 0;
  const rounded = Math.round(value);
  const tier = value >= 4 ? 'high' : value >= 3 ? 'mid' : 'low';

  return (
    <div className="rating-display">
      <div className="stars-row" aria-label={`Rated ${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rounded ? '#f59e0b' : 'transparent'}
            color={star <= rounded ? '#f59e0b' : '#cbd5e1'}
            strokeWidth={2}
          />
        ))}
      </div>
      {showNumeric && <span className={`rating-pill ${tier}`}>{value.toFixed(1)} / 5</span>}
    </div>
  );
}

export function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const activeValue = hovered || Number(value) || 0;

  return (
    <div className="rating-picker-box">
      <div className="stars-row" role="radiogroup" aria-label="Feedback Rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= activeValue;
          return (
            <button
              key={star}
              type="button"
              className="star-btn"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => onChange(star)}
              role="radio"
              aria-checked={Number(value) === star}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                size={26}
                fill={filled ? '#f59e0b' : 'transparent'}
                color={filled ? '#f59e0b' : '#94a3b8'}
                strokeWidth={2}
              />
            </button>
          );
        })}
      </div>
      <span className="rating-label-badge">
        {RATING_LABELS[activeValue] || 'Select rating'}
      </span>
    </div>
  );
}

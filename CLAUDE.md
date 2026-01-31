# Flashcard App

Single-file flashcard application with SM-2 spaced repetition algorithm.

## Tech Stack

- Vanilla HTML/CSS/JavaScript (no frameworks)
- Browser LocalStorage for persistence
- Single file: `flashcards.html`

## SM-2 Algorithm

Full SM-2 implementation with auto-quality detection:

### Quality Rating (auto-calculated)
- **0 (Forgot)**: Wrong answer, not close
- **1 (Almost)**: Wrong, partial similarity
- **2 (Typo)**: Wrong, but ≥80% similar (Levenshtein)
- **3 (Struggled)**: Correct, but slow (>8s)
- **4 (Good)**: Correct, normal speed (3-8s)
- **5 (Perfect)**: Correct, fast (<3s)

### Easiness Factor (EF)
Per-card difficulty multiplier (1.3 minimum, 2.5 default). Updated after each review:
```
EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
```

### Learning Stages
- **L0**: New card → 1 min interval
- **L1**: First success → 10 min
- **L2**: Second success → 1 day
- **L3**: Third success → 6 days
- **M (Mastered)**: 4+ successes → interval × EF

Failed reviews reset to L0 but preserve EF.

## Data Structure

```javascript
{
  w: "word",           // Word to learn
  s: "sentence",       // Example sentence containing the word
  d: "definition",     // Definition/hint
  int: 1,              // Current interval (minutes)
  due: timestamp,      // Next review time (ms since epoch)
  ef: 2.5,             // Easiness Factor
  n: 0,                // Repetition count (learning stage)
  reviews: 0,          // Total reviews
  correct: 0,          // Correct answers
  lastReview: "ISO",   // Last review timestamp
  lastQuality: 4       // Last quality rating (0-5)
}
```

## Key Functions

- `sm2(card, quality)`: Core SM-2 algorithm
- `calculateQuality(answer, correct, timeMs)`: Auto-rates 0-5
- `levenshtein(a, b)`: String similarity for typo detection
- `show()`: Display next due card
- `dueCards()`: Get cards ready for review

## LocalStorage Keys

- `cards`: JSON array of all flashcards
- `focusMode`: Boolean for distraction-free mode

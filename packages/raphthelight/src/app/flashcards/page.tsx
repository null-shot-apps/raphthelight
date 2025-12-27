'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Top 50 most common Swedish verbs for demo
const verbDatabase = [
  { swedish: 'vara', english: 'to be', example: 'Jag är glad', exampleEn: 'I am happy' },
  { swedish: 'ha', english: 'to have', example: 'Jag har en bil', exampleEn: 'I have a car' },
  { swedish: 'göra', english: 'to do/make', example: 'Vad gör du?', exampleEn: 'What are you doing?' },
  { swedish: 'kunna', english: 'to be able to/can', example: 'Jag kan simma', exampleEn: 'I can swim' },
  { swedish: 'säga', english: 'to say', example: 'Vad säger du?', exampleEn: 'What do you say?' },
  { swedish: 'vilja', english: 'to want', example: 'Jag vill ha kaffe', exampleEn: 'I want coffee' },
  { swedish: 'komma', english: 'to come', example: 'Kom hit!', exampleEn: 'Come here!' },
  { swedish: 'se', english: 'to see', example: 'Jag ser dig', exampleEn: 'I see you' },
  { swedish: 'ta', english: 'to take', example: 'Ta det lugnt', exampleEn: 'Take it easy' },
  { swedish: 'få', english: 'to get/receive', example: 'Kan jag få hjälp?', exampleEn: 'Can I get help?' },
  { swedish: 'tycka', english: 'to think/like', example: 'Jag tycker om dig', exampleEn: 'I like you' },
  { swedish: 'gå', english: 'to go/walk', example: 'Jag går hem', exampleEn: 'I\'m going home' },
  { swedish: 'veta', english: 'to know', example: 'Jag vet inte', exampleEn: 'I don\'t know' },
  { swedish: 'bli', english: 'to become', example: 'Jag blir glad', exampleEn: 'I become happy' },
  { swedish: 'tro', english: 'to believe/think', example: 'Jag tror det', exampleEn: 'I think so' },
  { swedish: 'börja', english: 'to start', example: 'Vi börjar nu', exampleEn: 'We start now' },
  { swedish: 'arbeta', english: 'to work', example: 'Jag arbetar här', exampleEn: 'I work here' },
  { swedish: 'stå', english: 'to stand', example: 'Stå upp!', exampleEn: 'Stand up!' },
  { swedish: 'finna', english: 'to find', example: 'Jag hittar den', exampleEn: 'I find it' },
  { swedish: 'ge', english: 'to give', example: 'Ge mig det', exampleEn: 'Give me that' },
  { swedish: 'leva', english: 'to live', example: 'Jag lever i Sverige', exampleEn: 'I live in Sweden' },
  { swedish: 'tala', english: 'to speak', example: 'Talar du svenska?', exampleEn: 'Do you speak Swedish?' },
  { swedish: 'ligga', english: 'to lie/be located', example: 'Boken ligger där', exampleEn: 'The book is there' },
  { swedish: 'sitta', english: 'to sit', example: 'Sitt ner', exampleEn: 'Sit down' },
  { swedish: 'heta', english: 'to be called', example: 'Jag heter Anna', exampleEn: 'My name is Anna' }
];

interface FlashcardProgress {
  [key: string]: {
    lastReviewed: number;
    interval: number;
    easeFactor: number;
    repetitions: number;
  };
}

export default function FlashcardsPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<FlashcardProgress>({});
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [todaysDeck, setTodaysDeck] = useState<typeof verbDatabase>([]);
  const [reviewedToday, setReviewedToday] = useState(0);

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem('flashcardProgress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }

    // Generate today's deck (cards due for review)
    const deck = generateTodaysDeck(saved ? JSON.parse(saved) : {});
    setTodaysDeck(deck);
  }, []);

  const generateTodaysDeck = (progressData: FlashcardProgress) => {
    const now = Date.now();
    const due = verbDatabase.filter(verb => {
      const cardProgress = progressData[verb.swedish];
      if (!cardProgress) return true; // New card
      const nextReview = cardProgress.lastReviewed + (cardProgress.interval * 24 * 60 * 60 * 1000);
      return now >= nextReview;
    });

    // If no cards due, show first 10 for practice
    return due.length > 0 ? due : verbDatabase.slice(0, 10);
  };

  const handleRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    const verb = todaysDeck[currentCard];
    const cardProgress = progress[verb.swedish] || {
      lastReviewed: 0,
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0
    };

    // SM-2 Algorithm (simplified)
    let newInterval = cardProgress.interval;
    let newEaseFactor = cardProgress.easeFactor;
    let newRepetitions = cardProgress.repetitions;

    if (rating === 'again') {
      newInterval = 1;
      newRepetitions = 0;
    } else {
      newRepetitions += 1;
      if (newRepetitions === 1) {
        newInterval = 1;
      } else if (newRepetitions === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(cardProgress.interval * cardProgress.easeFactor);
      }

      // Adjust ease factor
      const qualityMap = { hard: 3, good: 4, easy: 5 };
      const quality = qualityMap[rating];
      newEaseFactor = cardProgress.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      newEaseFactor = Math.max(1.3, newEaseFactor);
    }

    const newProgress = {
      ...progress,
      [verb.swedish]: {
        lastReviewed: Date.now(),
        interval: newInterval,
        easeFactor: newEaseFactor,
        repetitions: newRepetitions
      }
    };

    setProgress(newProgress);
    localStorage.setItem('flashcardProgress', JSON.stringify(newProgress));
    setReviewedToday(reviewedToday + 1);
    setShowAnswer(false);

    // Move to next card
    if (currentCard < todaysDeck.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      // Deck complete
      setCurrentCard(0);
      const newDeck = generateTodaysDeck(newProgress);
      setTodaysDeck(newDeck);
    }
  };

  if (todaysDeck.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-6 py-4 flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-gray-900">Flashcards</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-16 max-w-2xl text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Done for Today!</h2>
            <p className="text-lg text-gray-600 mb-8">
              You've reviewed all your cards. Come back tomorrow for more practice!
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  const verb = todaysDeck[currentCard];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Swedish Verbs</h1>
          <div className="text-sm text-gray-600">
            {currentCard + 1} / {todaysDeck.length}
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <span className="text-gray-600">Reviewed today: <span className="font-bold text-blue-600">{reviewedToday}</span></span>
          <span className="text-gray-600">Cards remaining: <span className="font-bold text-blue-600">{todaysDeck.length - currentCard}</span></span>
        </div>
      </div>

      <main className="container mx-auto px-6 py-16 max-w-2xl">
        {/* Flashcard */}
        <div
          className="bg-white rounded-3xl shadow-2xl p-12 min-h-[400px] flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {!showAnswer ? (
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-4 uppercase tracking-wide">Swedish Verb</p>
              <h2 className="text-6xl font-bold text-gray-900 mb-8">{verb.swedish}</h2>
              <p className="text-gray-400 italic">Click to reveal answer</p>
            </div>
          ) : (
            <div className="text-center w-full">
              <p className="text-gray-500 text-sm mb-2 uppercase tracking-wide">English</p>
              <h2 className="text-5xl font-bold text-blue-600 mb-8">{verb.english}</h2>
              
              <div className="bg-blue-50 rounded-2xl p-6 mb-8">
                <p className="text-gray-600 text-sm mb-2">Example:</p>
                <p className="text-xl font-semibold text-gray-900 mb-2">{verb.example}</p>
                <p className="text-gray-600 italic">{verb.exampleEn}</p>
              </div>

              <p className="text-gray-400 text-sm mb-6">How well did you know this?</p>

              {/* Rating Buttons */}
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRating('again');
                  }}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-3 rounded-xl font-semibold transition-colors"
                >
                  <div className="text-sm">Again</div>
                  <div className="text-xs opacity-75">&lt;1 day</div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRating('hard');
                  }}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-3 rounded-xl font-semibold transition-colors"
                >
                  <div className="text-sm">Hard</div>
                  <div className="text-xs opacity-75">3 days</div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRating('good');
                  }}
                  className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-3 rounded-xl font-semibold transition-colors"
                >
                  <div className="text-sm">Good</div>
                  <div className="text-xs opacity-75">6 days</div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRating('easy');
                  }}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-3 rounded-xl font-semibold transition-colors"
                >
                  <div className="text-sm">Easy</div>
                  <div className="text-xs opacity-75">10 days</div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">💡 SRS Tip:</span> Be honest with your ratings! 
            The system adapts to show you cards right before you forget them.
          </p>
        </div>
      </main>
    </div>
  );
}


'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const lessonContent = {
  '1': {
    title: 'Lesson 1: Hej! (Hello!)',
    sections: [
      {
        type: 'intro',
        content: {
          title: 'Welcome to Swedish Greetings!',
          text: 'In Sweden, "Hej" (pronounced like "hey") is your best friend. It works for hello AND goodbye. Lagom efficiency! 🇸🇪'
        }
      },
      {
        type: 'vocabulary',
        content: {
          title: 'Essential Greetings',
          words: [
            { swedish: 'Hej', pronunciation: 'hey', english: 'Hello/Hi', note: 'Most common!' },
            { swedish: 'Hej hej', pronunciation: 'hey hey', english: 'Bye', note: 'Casual goodbye' },
            { swedish: 'God morgon', pronunciation: 'goo MOR-on', english: 'Good morning', note: 'Formal' },
            { swedish: 'Tack', pronunciation: 'tack', english: 'Thanks', note: 'Say it often!' },
            { swedish: 'Tack så mycket', pronunciation: 'tack so MYK-et', english: 'Thanks so much', note: '' }
          ]
        }
      },
      {
        type: 'culture',
        content: {
          title: '🇸🇪 Cultural Insight: Jantelagen',
          text: 'Swedes value modesty and equality. Don\'t brag or stand out too much. When someone compliments you, a simple "Tack" is better than elaborate self-praise. This is Jantelagen - the Law of Jante.',
          tip: 'If someone says "Du är duktig!" (You\'re good!), just smile and say "Tack!"'
        }
      },
      {
        type: 'grammar',
        content: {
          title: 'En vs Ett: Your First Taste',
          text: 'Swedish nouns have two genders: EN-words (common) and ETT-words (neuter). About 75% are en-words, 25% are ett-words.',
          examples: [
            { swedish: 'en bil', english: 'a car', gender: 'en' },
            { swedish: 'ett hus', english: 'a house', gender: 'ett' },
            { swedish: 'en katt', english: 'a cat', gender: 'en' },
            { swedish: 'ett barn', english: 'a child', gender: 'ett' }
          ],
          tip: '💡 Pro tip: Always learn nouns WITH their article. Not "bil", but "en bil"!'
        }
      },
      {
        type: 'dialogue',
        content: {
          title: 'Practice Dialogue',
          scenario: 'Meeting someone for the first time',
          lines: [
            { speaker: 'Anna', swedish: 'Hej! Jag heter Anna.', english: 'Hi! My name is Anna.' },
            { speaker: 'You', swedish: 'Hej! Jag heter [your name].', english: 'Hi! My name is [your name].' },
            { speaker: 'Anna', swedish: 'Trevligt att träffas!', english: 'Nice to meet you!' },
            { speaker: 'You', swedish: 'Trevligt att träffas!', english: 'Nice to meet you!' }
          ]
        }
      },
      {
        type: 'quiz',
        content: {
          title: 'Quick Check',
          questions: [
            {
              question: 'How do you say "Hello" in Swedish?',
              options: ['Hej', 'Bonjour', 'Hola', 'Ciao'],
              correct: 0
            },
            {
              question: 'Which article goes with "bil" (car)?',
              options: ['en', 'ett', 'der', 'le'],
              correct: 0
            },
            {
              question: 'What is Jantelagen about?',
              options: ['Being loud', 'Being modest', 'Being late', 'Being formal'],
              correct: 1
            }
          ]
        }
      }
    ]
  },
  '2': {
    title: 'Lesson 2: Fika Culture',
    sections: [
      {
        type: 'intro',
        content: {
          title: 'Welcome to Fika! ☕🍰',
          text: 'Fika is not just coffee. It\'s a Swedish institution - a sacred break for coffee and pastries. It\'s about slowing down, connecting, and enjoying the moment. Very lagom!'
        }
      },
      {
        type: 'vocabulary',
        content: {
          title: 'At the Konditori (Café)',
          words: [
            { swedish: 'kaffe', pronunciation: 'KAH-feh', english: 'coffee', note: 'Swedes drink LOTS' },
            { swedish: 'te', pronunciation: 'teh', english: 'tea', note: '' },
            { swedish: 'kanelbulle', pronunciation: 'kah-NEL-bull-eh', english: 'cinnamon bun', note: 'National treasure!' },
            { swedish: 'chokladboll', pronunciation: 'shok-LAHD-boll', english: 'chocolate ball', note: 'Oat & cocoa treat' },
            { swedish: 'smörgås', pronunciation: 'SMUR-gos', english: 'sandwich', note: '' },
            { swedish: 'Kan jag få...', pronunciation: 'kan ya foh', english: 'Can I have...', note: 'Polite ordering' }
          ]
        }
      },
      {
        type: 'dialogue',
        content: {
          title: 'Ordering at a Konditori',
          scenario: 'You walk into a cozy Swedish café',
          lines: [
            { speaker: 'Barista', swedish: 'Hej! Vad får det lov att vara?', english: 'Hi! What can I get you?' },
            { speaker: 'You', swedish: 'Hej! Kan jag få en kaffe och en kanelbulle?', english: 'Hi! Can I have a coffee and a cinnamon bun?' },
            { speaker: 'Barista', swedish: 'Javisst! Något annat?', english: 'Of course! Anything else?' },
            { speaker: 'You', swedish: 'Nej tack, det är bra.', english: 'No thanks, that\'s good.' },
            { speaker: 'Barista', swedish: 'Det blir 65 kronor.', english: 'That\'ll be 65 kronor.' },
            { speaker: 'You', swedish: 'Tack så mycket!', english: 'Thanks so much!' }
          ]
        }
      },
      {
        type: 'culture',
        content: {
          title: '🇸🇪 Cultural Insight: Fika at Work',
          text: 'In Swedish workplaces, fika is often scheduled into the day - usually around 10am and 3pm. It\'s not lazy; it\'s productive! Taking breaks improves focus and team bonding.',
          tip: 'Never skip fika if invited by colleagues. It\'s where real connections happen!'
        }
      },
      {
        type: 'grammar',
        content: {
          title: 'More En vs Ett Patterns',
          text: 'Food words follow patterns! Most foods are EN-words, but there are exceptions.',
          examples: [
            { swedish: 'en bulle', english: 'a bun', gender: 'en' },
            { swedish: 'ett bröd', english: 'a bread', gender: 'ett' },
            { swedish: 'en kaka', english: 'a cookie/cake', gender: 'en' },
            { swedish: 'ett äpple', english: 'an apple', gender: 'ett' }
          ],
          tip: '💡 Pattern: Most pastries are EN-words (en bulle, en kaka, en tårta)'
        }
      }
    ]
  }
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const [currentSection, setCurrentSection] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const lesson = lessonContent[lessonId as keyof typeof lessonContent];

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const section = lesson.sections[currentSection];
  const isLastSection = currentSection === lesson.sections.length - 1;

  const handleNext = () => {
    if (isLastSection) {
      // Mark lesson as complete
      const saved = localStorage.getItem('swedishLearnerProfile');
      if (saved) {
        const profile = JSON.parse(saved);
        const completedLessons = profile.completedLessons || [];
        if (!completedLessons.includes(`module-${lessonId}`)) {
          completedLessons.push(`module-${lessonId}`);
          profile.completedLessons = completedLessons;
          profile.streak = (profile.streak || 0) + 1;
          localStorage.setItem('swedishLearnerProfile', JSON.stringify(profile));
        }
      }
      router.push('/dashboard');
    } else {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <span>←</span> Back
          </button>
          <h1 className="text-lg font-bold text-gray-900">{lesson.title}</h1>
          <div className="text-sm text-gray-600">
            {currentSection + 1} / {lesson.sections.length}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-gray-200 h-2">
        <div
          className="bg-blue-600 h-2 transition-all duration-300"
          style={{ width: `${((currentSection + 1) / lesson.sections.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 min-h-[500px]">
          {section.type === 'intro' && <IntroSection content={section.content} />}
          {section.type === 'vocabulary' && <VocabularySection content={section.content} />}
          {section.type === 'culture' && <CultureSection content={section.content} />}
          {section.type === 'grammar' && <GrammarSection content={section.content} />}
          {section.type === 'dialogue' && <DialogueSection content={section.content} />}
          {section.type === 'quiz' && (
            <QuizSection
              content={section.content}
              answers={quizAnswers}
              setAnswers={setQuizAnswers}
              showResults={showResults}
              setShowResults={setShowResults}
            />
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
            {currentSection > 0 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {isLastSection ? 'Complete Lesson ✓' : 'Continue'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function IntroSection({ content }: { content: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">{content.title}</h2>
      <p className="text-xl text-gray-700 leading-relaxed">{content.text}</p>
    </div>
  );
}

function VocabularySection({ content }: { content: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">{content.title}</h2>
      <div className="space-y-4">
        {content.words.map((word: any, idx: number) => (
          <div key={idx} className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-2xl font-bold text-blue-900 mb-1">{word.swedish}</div>
                <div className="text-sm text-gray-600 mb-2">Pronunciation: {word.pronunciation}</div>
                <div className="text-lg text-gray-800">{word.english}</div>
              </div>
              {word.note && (
                <div className="bg-yellow-100 px-3 py-1 rounded-full text-sm text-gray-700">
                  {word.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CultureSection({ content }: { content: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">{content.title}</h2>
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
        <p className="text-lg text-gray-800 leading-relaxed mb-4">{content.text}</p>
        {content.tip && (
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <p className="text-gray-700">
              <span className="font-semibold">💡 Tip:</span> {content.tip}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function GrammarSection({ content }: { content: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">{content.title}</h2>
      <p className="text-lg text-gray-700 leading-relaxed">{content.text}</p>
      <div className="grid md:grid-cols-2 gap-4">
        {content.examples.map((example: any, idx: number) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border-2 ${
              example.gender === 'en'
                ? 'bg-green-50 border-green-300'
                : 'bg-purple-50 border-purple-300'
            }`}
          >
            <div className="text-xl font-bold text-gray-900 mb-1">{example.swedish}</div>
            <div className="text-gray-700">{example.english}</div>
          </div>
        ))}
      </div>
      {content.tip && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <p className="text-gray-700">{content.tip}</p>
        </div>
      )}
    </div>
  );
}

function DialogueSection({ content }: { content: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">{content.title}</h2>
      <p className="text-gray-600 italic">{content.scenario}</p>
      <div className="space-y-4">
        {content.lines.map((line: any, idx: number) => (
          <div
            key={idx}
            className={`p-4 rounded-xl ${
              line.speaker === 'You'
                ? 'bg-blue-50 border-2 border-blue-300 ml-8'
                : 'bg-gray-50 border-2 border-gray-300 mr-8'
            }`}
          >
            <div className="font-semibold text-gray-900 mb-2">{line.speaker}:</div>
            <div className="text-lg font-medium text-gray-900 mb-1">{line.swedish}</div>
            <div className="text-gray-600">{line.english}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuizSection({
  content,
  answers,
  setAnswers,
  showResults,
  setShowResults
}: {
  content: any;
  answers: number[];
  setAnswers: (answers: number[]) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
}) {
  const handleAnswer = (questionIdx: number, optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const score = answers.filter((answer, idx) => answer === content.questions[idx].correct).length;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">{content.title}</h2>
      <div className="space-y-6">
        {content.questions.map((q: any, qIdx: number) => (
          <div key={qIdx} className="bg-gray-50 rounded-xl p-6">
            <p className="text-lg font-semibold text-gray-900 mb-4">
              {qIdx + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((option: string, oIdx: number) => (
                <button
                  key={oIdx}
                  onClick={() => handleAnswer(qIdx, oIdx)}
                  disabled={showResults}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showResults
                      ? oIdx === q.correct
                        ? 'border-green-500 bg-green-50'
                        : answers[qIdx] === oIdx
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white'
                      : answers[qIdx] === oIdx
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  {option}
                  {showResults && oIdx === q.correct && ' ✓'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!showResults && answers.length === content.questions.length && (
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Check Answers
        </button>
      )}

      {showResults && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">
            You scored {score} out of {content.questions.length}!
          </p>
          <p className="text-gray-700">
            {score === content.questions.length
              ? '🎉 Perfect! You\'re ready to move on!'
              : score >= content.questions.length / 2
              ? '👍 Good job! Review the material and try again.'
              : '📚 Take your time and review the lesson.'}
          </p>
        </div>
      )}
    </div>
  );
}


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const pronunciationLessons = [
  {
    id: 'aa-vowel',
    title: 'Å - The "Oh" Sound',
    description: 'Master the Swedish Å (like "oh" in "boat")',
    difficulty: 'Beginner',
    examples: [
      { word: 'å', ipa: 'oː', english: 'stream', tip: 'Round your lips like saying "oh"' },
      { word: 'år', ipa: 'oːr', english: 'year', tip: 'Hold the "oh" sound longer' },
      { word: 'båt', ipa: 'boːt', english: 'boat', tip: 'Start with "b" then round lips' },
      { word: 'gå', ipa: 'goː', english: 'go/walk', tip: 'Like "go" but rounder' }
    ]
  },
  {
    id: 'ae-vowel',
    title: 'Ä - The "Eh" Sound',
    description: 'Learn the Swedish Ä (like "e" in "bed")',
    difficulty: 'Beginner',
    examples: [
      { word: 'ä', ipa: 'ɛː', english: 'is', tip: 'Open mouth wider than English "e"' },
      { word: 'äta', ipa: 'ˈɛːta', english: 'to eat', tip: 'Like "air" without the "r"' },
      { word: 'läsa', ipa: 'ˈlɛːsa', english: 'to read', tip: 'Relax your jaw' },
      { word: 'väder', ipa: 'ˈvɛːdɛr', english: 'weather', tip: 'Two ä sounds!' }
    ]
  },
  {
    id: 'oe-vowel',
    title: 'Ö - The Tricky One',
    description: 'Conquer the Swedish Ö (no English equivalent!)',
    difficulty: 'Intermediate',
    examples: [
      { word: 'ö', ipa: 'øː', english: 'island', tip: 'Say "ee" but round your lips' },
      { word: 'öl', ipa: 'øːl', english: 'beer', tip: 'Like German "ö" or French "eu"' },
      { word: 'öra', ipa: 'ˈøːra', english: 'ear', tip: 'Start with "ee", then pucker' },
      { word: 'möta', ipa: 'ˈmøːta', english: 'to meet', tip: 'Hold the rounded "ee"' }
    ]
  },
  {
    id: 'sje-sound',
    title: 'The Sje-Sound',
    description: 'Master the infamous Swedish "sj" sound',
    difficulty: 'Advanced',
    examples: [
      { word: 'sju', ipa: 'ɧʉː', english: 'seven', tip: 'Like whispering "shh" with tongue back' },
      { word: 'sjuk', ipa: 'ɧʉːk', english: 'sick', tip: 'Breathy &quot;sh&quot; from throat' },
      { word: 'sjunga', ipa: 'ˈɧʉŋa', english: 'to sing', tip: 'Start soft, then add voice' },
      { word: 'kör', ipa: 'ɕøːr', english: 'choir/drive', tip: 'Softer than English &quot;sh&quot;' }
    ]
  },
  {
    id: 'prosody',
    title: 'Swedish Melody (Prosody)',
    description: 'Learn the sing-song rhythm of Swedish',
    difficulty: 'Intermediate',
    examples: [
      { word: 'anden', ipa: 'ˈandɛn', english: 'the duck', tip: 'Accent 1: Stress first syllable, drop second' },
      { word: 'anden', ipa: 'ˈandɛn', english: 'the spirit', tip: 'Accent 2: Rise on first, fall on second' },
      { word: 'tomten', ipa: 'ˈtɔmtɛn', english: 'Santa/the lot', tip: 'Two meanings, two melodies!' },
      { word: 'Hej!', ipa: 'hɛj', english: 'Hi!', tip: 'Rise at the end like a question' }
    ]
  }
];

export default function PronunciationPage() {
  const router = useRouter();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState(0);

  if (!selectedLesson) {
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
            <h1 className="text-xl font-bold text-gray-900">Pronunciation Training</h1>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Master Swedish Sounds 🎵
            </h2>
            <p className="text-lg text-gray-600">
              Swedish has unique vowels and the famous &quot;sing-song&quot; melody. Practice these sounds to sound like a native!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {pronunciationLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson.id)}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-blue-300"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h3>
                <p className="text-gray-600 mb-4">{lesson.description}</p>
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {lesson.difficulty}
                  </span>
                  <span className="text-blue-600 font-semibold">Practice →</span>
                </div>
              </button>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-2">🎯 Pro Tips for Swedish Pronunciation:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <span className="font-semibold">Listen actively:</span> Swedish has pitch accents - same word, different melody = different meaning!</li>
              <li>• <span className="font-semibold">Exaggerate at first:</span> Round those lips for Å and Ö more than feels natural</li>
              <li>• <span className="font-semibold">Record yourself:</span> Compare your pronunciation to native speakers</li>
              <li>• <span className="font-semibold">Practice daily:</span> Even 5 minutes of pronunciation practice builds muscle memory</li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  const lesson = pronunciationLessons.find(l => l.id === selectedLesson)!;
  const example = lesson.examples[currentExample];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSelectedLesson(null)}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Lessons
          </button>
          <h1 className="text-lg font-bold text-gray-900">{lesson.title}</h1>
          <div className="text-sm text-gray-600">
            {currentExample + 1} / {lesson.examples.length}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-gray-200 h-2">
        <div
          className="bg-blue-600 h-2 transition-all duration-300"
          style={{ width: `${((currentExample + 1) / lesson.examples.length) * 100}%` }}
        />
      </div>

      <main className="container mx-auto px-6 py-16 max-w-3xl">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-7xl font-bold text-gray-900 mb-6">{example.word}</h2>
            <div className="bg-blue-50 rounded-xl p-4 mb-6 inline-block">
              <p className="text-sm text-gray-600 mb-1">IPA Pronunciation:</p>
              <p className="text-3xl font-mono text-blue-900">[{example.ipa}]</p>
            </div>
            <p className="text-2xl text-gray-600 mb-2">English: <span className="font-semibold">{example.english}</span></p>
          </div>

          {/* Pronunciation Tip */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-8">
            <p className="text-lg text-gray-800">
              <span className="font-bold text-yellow-800">💡 How to say it:</span> {example.tip}
            </p>
          </div>

          {/* Audio Placeholder */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-center text-white mb-8">
            <div className="text-5xl mb-4">🔊</div>
            <p className="text-lg mb-4">Listen to native pronunciation</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
              Play Audio
            </button>
            <p className="text-sm mt-4 opacity-75">(Audio feature coming soon)</p>
          </div>

          {/* Practice Section */}
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Practice:</span> Say the word out loud 5 times, focusing on the tip above.
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-400 font-semibold">
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentExample > 0 && (
            <button
              onClick={() => setCurrentExample(currentExample - 1)}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
            >
              ← Previous
            </button>
          )}
          {currentExample < lesson.examples.length - 1 ? (
            <button
              onClick={() => setCurrentExample(currentExample + 1)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Next Example →
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedLesson(null);
                setCurrentExample(0);
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Complete Lesson ✓
            </button>
          )}
        </div>
      </main>
    </div>
  );
}




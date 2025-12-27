'use client';

import { useState } from 'react';

type Match = {
  giver: string;
  receiver: string;
};

export default function SecretSanta() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [inputName, setInputName] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  const [showMatch, setShowMatch] = useState(false);

  const addParticipant = () => {
    const trimmedName = inputName.trim();
    if (trimmedName && !participants.includes(trimmedName)) {
      setParticipants([...participants, trimmedName]);
      setInputName('');
      setMatches([]);
      setSelectedPerson('');
      setShowMatch(false);
    }
  };

  const removeParticipant = (name: string) => {
    setParticipants(participants.filter(p => p !== name));
    setMatches([]);
    setSelectedPerson('');
    setShowMatch(false);
  };

  const generateMatches = () => {
    if (participants.length < 2) {
      alert('Need at least 2 participants!');
      return;
    }

    let givers = [...participants];
    let receivers = [...participants];
    const newMatches: Match[] = [];
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      givers = [...participants].sort(() => Math.random() - 0.5);
      receivers = [...participants].sort(() => Math.random() - 0.5);
      
      const valid = givers.every((giver, i) => giver !== receivers[i]);
      
      if (valid) {
        givers.forEach((giver, i) => {
          newMatches.push({ giver, receiver: receivers[i] });
        });
        break;
      }
      attempts++;
    }

    if (newMatches.length === 0) {
      alert('Could not generate valid matches. Try again!');
      return;
    }

    setMatches(newMatches);
    setSelectedPerson('');
    setShowMatch(false);
  };

  const viewMatch = () => {
    if (selectedPerson) {
      setShowMatch(true);
    }
  };

  const getMatchFor = (person: string) => {
    return matches.find(m => m.giver === person)?.receiver || '';
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-auto bg-gradient-to-br from-red-900 via-green-900 to-red-800">
      {/* Snowflakes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="snowflake absolute text-white text-opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${Math.random() * 10 + 10}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Main content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
              🎅 Secret Santa 🎄
            </h1>
            <p className="text-gray-600">Generate your holiday gift exchange matches!</p>
          </div>

          {/* Add Participant Section */}
          <div className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                placeholder="Enter participant name"
                className="flex-1 px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-500 text-gray-800"
              />
              <button
                onClick={addParticipant}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
              >
                Add
              </button>
            </div>
          </div>

          {/* Participants List */}
          {participants.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Participants ({participants.length})
              </h2>
              <div className="space-y-2">
                {participants.map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between bg-red-50 px-4 py-3 rounded-xl border-2 border-red-200"
                  >
                    <span className="text-gray-800 font-medium">{name}</span>
                    <button
                      onClick={() => removeParticipant(name)}
                      className="text-red-600 hover:text-red-800 font-bold text-xl"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          {participants.length >= 2 && (
            <button
              onClick={generateMatches}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-xl transition-colors shadow-lg mb-8"
            >
              🎁 Generate Matches
            </button>
          )}

          {/* View Matches Section */}
          {matches.length > 0 && (
            <div className="border-t-2 border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                View Your Match
              </h2>
              
              <div className="space-y-4">
                <select
                  value={selectedPerson}
                  onChange={(e) => {
                    setSelectedPerson(e.target.value);
                    setShowMatch(false);
                  }}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-500 text-gray-800"
                >
                  <option value="">Select your name...</option>
                  {participants.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>

                {selectedPerson && !showMatch && (
                  <button
                    onClick={viewMatch}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
                  >
                    Reveal My Match 👀
                  </button>
                )}

                {showMatch && selectedPerson && (
                  <div className="bg-gradient-to-r from-green-100 to-red-100 p-6 rounded-xl border-2 border-green-400 text-center">
                    <p className="text-gray-700 mb-2 font-medium">You are giving a gift to:</p>
                    <p className="text-3xl font-bold text-red-600">
                      🎁 {getMatchFor(selectedPerson)} 🎁
                    </p>
                    <p className="text-sm text-gray-600 mt-4">
                      Keep it secret! 🤫
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {participants.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">Add participants to get started! 🎄</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


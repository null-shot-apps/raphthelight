'use client';

import { useState } from 'react';

export default function Landing() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (showOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100">
      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Swedish Flag Colors Accent */}
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-16 h-2 bg-yellow-400 rounded-full"></div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Learn Swedish
            <span className="block text-blue-600 mt-2">The Lagom Way</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-4">
            Not too much. Not too little. <span className="font-semibold italic">Just right.</span>
          </p>

          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Master Swedish with a balanced approach: formal grammar meets gatusvenska (street Swedish), 
            powered by AI conversations and cultural insights.
          </p>

          <button
            onClick={() => setShowOnboarding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-12 py-4 rounded-full font-semibold shadow-lg transition-all transform hover:scale-105"
          >
            Börja Nu (Start Now)
          </button>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <FeatureCard
              icon="🎯"
              title="SFI Track"
              description="Official Swedish for Immigrants curriculum from A1 to B1"
            />
            <FeatureCard
              icon="💬"
              title="AI Roleplay"
              description="Practice real scenarios: fika breaks, konditori orders, and more"
            />
            <FeatureCard
              icon="🎵"
              title="Prosody Training"
              description="Master the Swedish sing-song melody and tricky vowels (å, ä, ö)"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <FeatureCard
              icon="📚"
              title="En vs Ett Mastery"
              description="Finally understand Swedish gender with clear patterns"
            />
            <FeatureCard
              icon="🔄"
              title="Smart Flashcards"
              description="SRS system for the 1,000 most common Swedish verbs"
            />
            <FeatureCard
              icon="🇸🇪"
              title="Cultural Tips"
              description="Learn Jantelagen and Swedish social norms naturally"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    level: '',
    goal: '',
    dailyMinutes: 15
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleStart = () => {
    // Save to localStorage
    localStorage.setItem('swedishLearnerProfile', JSON.stringify(userData));
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Hej! What&apos;s your name?</h2>
            <p className="text-gray-600">We&apos;ll use this to personalize your learning journey.</p>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              placeholder="Your name"
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none"
            />
          </div>
        )}

        {/* Step 2: Current Level */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">What&apos;s your Swedish level?</h2>
            <div className="space-y-3">
              {[
                { value: 'absolute-beginner', label: 'Absolute Beginner', desc: 'I know nothing' },
                { value: 'a1', label: 'A1 - Beginner', desc: 'I know basic phrases' },
                { value: 'a2', label: 'A2 - Elementary', desc: 'I can have simple conversations' },
                { value: 'b1', label: 'B1 - Intermediate', desc: 'I can handle most situations' }
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => setUserData({ ...userData, level: level.value })}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    userData.level === level.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{level.label}</div>
                  <div className="text-sm text-gray-600">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Goal */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Why are you learning Swedish?</h2>
            <div className="space-y-3">
              {[
                { value: 'moving', label: '🏠 Moving to Sweden', desc: 'I need Swedish for daily life' },
                { value: 'work', label: '💼 Work/Study', desc: 'Professional or academic reasons' },
                { value: 'family', label: '❤️ Family/Partner', desc: 'Connecting with loved ones' },
                { value: 'interest', label: '🎯 Personal Interest', desc: 'I love languages and culture' }
              ].map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => setUserData({ ...userData, goal: goal.value })}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    userData.goal === goal.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{goal.label}</div>
                  <div className="text-sm text-gray-600">{goal.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Daily Commitment */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">How much time per day?</h2>
            <p className="text-gray-600">Consistency beats intensity. Even 10 minutes daily works!</p>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>10 min</span>
                <span className="font-semibold text-blue-600">{userData.dailyMinutes} min</span>
                <span>60 min</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={userData.dailyMinutes}
                onChange={(e) => setUserData({ ...userData, dailyMinutes: parseInt(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mt-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">💡 Lagom Tip:</span> {userData.dailyMinutes} minutes is perfect! 
                Not too much to burn out, not too little to forget. Just right.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !userData.name) ||
                (step === 2 && !userData.level) ||
                (step === 3 && !userData.goal)
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Start Learning! 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}




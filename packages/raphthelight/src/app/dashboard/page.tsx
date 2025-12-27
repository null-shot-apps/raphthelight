'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserProfile {
  name: string;
  level: string;
  goal: string;
  dailyMinutes: number;
  streak?: number;
  completedLessons?: string[];
}

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentModule] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('swedishLearnerProfile');
    if (saved) {
      const data = JSON.parse(saved);
      setProfile({
        ...data,
        streak: data.streak || 0,
        completedLessons: data.completedLessons || []
      });
    }
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🇸🇪</div>
            <h1 className="text-xl font-bold text-gray-900">Lagom Swedish</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="font-bold text-gray-900">{profile.streak} day streak</span>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {profile.name[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hej, {profile.name}! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Ready for your {profile.dailyMinutes}-minute Swedish session?
          </p>
        </div>

        {/* SFI Track Progress */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Your SFI Track</h3>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold text-sm">
              {profile.level.toUpperCase()} Level
            </span>
          </div>

          {/* Module Cards */}
          <div className="space-y-4">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                isUnlocked={module.id <= currentModule}
                isCompleted={profile.completedLessons?.includes(`module-${module.id}`) || false}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <QuickActionCard
            icon="💬"
            title="AI Roleplay"
            description="Practice a real conversation"
            href="/roleplay"
            color="blue"
          />
          <QuickActionCard
            icon="🎴"
            title="Flashcards"
            description="Review your vocabulary"
            href="/flashcards"
            color="yellow"
          />
          <QuickActionCard
            icon="🎵"
            title="Pronunciation"
            description="Master Swedish sounds"
            href="/pronunciation"
            color="green"
          />
        </div>
      </main>
    </div>
  );
}

const modules = [
  {
    id: 1,
    title: 'Lesson 1: Hej! (Hello!)',
    description: 'Basic greetings, introductions, and the magic of "Hej"',
    duration: '15 min',
    topics: ['Greetings', 'Self-introduction', 'En vs Ett intro']
  },
  {
    id: 2,
    title: 'Lesson 2: Fika Culture',
    description: 'Learn to order at a konditori and understand Swedish coffee culture',
    duration: '20 min',
    topics: ['Food vocabulary', 'Ordering phrases', 'Cultural insight: Fika']
  },
  {
    id: 3,
    title: 'Lesson 3: En vs Ett Mastery',
    description: 'Finally crack the code of Swedish noun genders',
    duration: '25 min',
    topics: ['Gender patterns', 'Common en-words', 'Common ett-words']
  },
  {
    id: 4,
    title: 'Lesson 4: V2 Word Order',
    description: 'Master the unique Swedish sentence structure',
    duration: '20 min',
    topics: ['V2 rule', 'Time expressions', 'Question formation']
  },
  {
    id: 5,
    title: 'Lesson 5: Å, Ä, Ö Challenge',
    description: 'Conquer the Swedish vowels that trip everyone up',
    duration: '20 min',
    topics: ['Vowel pronunciation', 'Minimal pairs', 'Listening practice']
  }
];

function ModuleCard({ 
  module, 
  isUnlocked, 
  isCompleted 
}: { 
  module: typeof modules[0]; 
  isUnlocked: boolean; 
  isCompleted: boolean;
}) {
  return (
    <Link
      href={isUnlocked ? `/lesson/${module.id}` : '#'}
      className={`block p-6 rounded-xl border-2 transition-all ${
        !isUnlocked
          ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
          : isCompleted
          ? 'border-green-300 bg-green-50 hover:shadow-lg'
          : 'border-blue-300 bg-blue-50 hover:shadow-lg hover:border-blue-400'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl">
              {!isUnlocked ? '🔒' : isCompleted ? '✅' : '📘'}
            </div>
            <h4 className="text-xl font-bold text-gray-900">{module.title}</h4>
          </div>
          <p className="text-gray-600 mb-3">{module.description}</p>
          <div className="flex flex-wrap gap-2">
            {module.topics.map((topic) => (
              <span
                key={topic}
                className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
        <div className="text-sm text-gray-500 ml-4">{module.duration}</div>
      </div>
    </Link>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  href,
  color
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'border-blue-300 bg-blue-50 hover:border-blue-400',
    yellow: 'border-yellow-300 bg-yellow-50 hover:border-yellow-400',
    green: 'border-green-300 bg-green-50 hover:border-green-400'
  };

  return (
    <Link
      href={href}
      className={`block p-6 rounded-xl border-2 transition-all hover:shadow-lg ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}




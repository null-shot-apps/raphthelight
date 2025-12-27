'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const scenarios = [
  {
    id: 'konditori',
    title: '☕ Ordering at a Konditori',
    description: 'Practice ordering coffee and pastries at a Swedish café',
    difficulty: 'Beginner',
    vocabulary: ['kaffe', 'kanelbulle', 'tack', 'kan jag få']
  },
  {
    id: 'fika-work',
    title: '💼 Fika Break at Work',
    description: 'Small talk with colleagues during the sacred fika time',
    difficulty: 'Intermediate',
    vocabulary: ['hur mår du', 'helgen', 'jobbet', 'vädret']
  },
  {
    id: 'grocery',
    title: '🛒 At the Grocery Store',
    description: 'Navigate ICA and ask for help finding items',
    difficulty: 'Beginner',
    vocabulary: ['var finns', 'mjölk', 'bröd', 'ursäkta']
  },
  {
    id: 'apartment',
    title: '🏠 Viewing an Apartment',
    description: 'Ask questions about rent, utilities, and move-in dates',
    difficulty: 'Advanced',
    vocabulary: ['hyra', 'lägenhet', 'när kan jag flytta in', 'ingår']
  }
];

export default function RoleplayPage() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string; translation?: string }>>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const startScenario = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setMessages([]);
    
    // Initial AI greeting based on scenario
    const greetings: Record<string, string> = {
      konditori: 'Hej! Välkommen till vårt konditori. Vad får det lov att vara?',
      'fika-work': 'Hej! Ska du ta en fika också? Vad skönt med en paus!',
      grocery: 'Hej! Kan jag hjälpa dig med något?',
      apartment: 'Hej! Välkommen! Vill du titta på lägenheten?'
    };

    const translations: Record<string, string> = {
      konditori: 'Hi! Welcome to our café. What can I get you?',
      'fika-work': 'Hi! Are you taking a fika too? How nice with a break!',
      grocery: 'Hi! Can I help you with something?',
      apartment: 'Hi! Welcome! Would you like to see the apartment?'
    };

    setTimeout(() => {
      setMessages([{
        role: 'ai',
        text: greetings[scenarioId],
        translation: translations[scenarioId]
      }]);
    }, 500);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedScenario) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    // Simulate AI response (in production, this would call an AI API)
    setTimeout(() => {
      const response = generateResponse(selectedScenario, userMessage, messages.length);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: response.swedish,
        translation: response.english
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (scenarioId: string, userInput: string, messageCount: number) => {
    // Simple response logic (in production, use AI)
    const responses: Record<string, Array<{ swedish: string; english: string }>> = {
      konditori: [
        { swedish: 'Javisst! Något annat?', english: 'Of course! Anything else?' },
        { swedish: 'Det blir 65 kronor. Swish eller kort?', english: 'That\'ll be 65 kronor. Swish or card?' },
        { swedish: 'Tack så mycket! Ha en bra dag!', english: 'Thanks so much! Have a great day!' }
      ],
      'fika-work': [
        { swedish: 'Ja, det var en hektisk morgon! Hur är det med dig?', english: 'Yes, it was a hectic morning! How about you?' },
        { swedish: 'Låter trevligt! Har du några planer för helgen?', english: 'Sounds nice! Do you have any plans for the weekend?' },
        { swedish: 'Mysigt! Jag ska nog bara ta det lugnt hemma.', english: 'Cozy! I\'ll probably just take it easy at home.' }
      ],
      grocery: [
        { swedish: 'Mjölken finns i kyldisken där borta, till vänster.', english: 'The milk is in the refrigerated section over there, to the left.' },
        { swedish: 'Varsågod! Något annat du behöver?', english: 'You\'re welcome! Anything else you need?' },
        { swedish: 'Ha en bra dag!', english: 'Have a great day!' }
      ],
      apartment: [
        { swedish: 'Hyran är 12 000 kronor per månad. El och vatten ingår.', english: 'The rent is 12,000 kronor per month. Electricity and water are included.' },
        { swedish: 'Du kan flytta in den första nästa månad.', english: 'You can move in on the first of next month.' },
        { swedish: 'Perfekt! Jag skickar kontraktet till dig imorgon.', english: 'Perfect! I\'ll send you the contract tomorrow.' }
      ]
    };

    const scenarioResponses = responses[scenarioId] || [];
    const responseIndex = Math.min(Math.floor(messageCount / 2), scenarioResponses.length - 1);
    return scenarioResponses[responseIndex] || { swedish: 'Tack!', english: 'Thanks!' };
  };

  if (!selectedScenario) {
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
            <h1 className="text-xl font-bold text-gray-900">AI Roleplay Scenarios</h1>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Practice Real Conversations 💬
            </h2>
            <p className="text-lg text-gray-600">
              Choose a scenario and chat with an AI tutor. Get instant feedback on your Swedish!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => startScenario(scenario.id)}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-blue-300"
              >
                <div className="text-4xl mb-4">{scenario.title.split(' ')[0]}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {scenario.title.substring(scenario.title.indexOf(' ') + 1)}
                </h3>
                <p className="text-gray-600 mb-4">{scenario.description}</p>
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {scenario.difficulty}
                  </span>
                  <span className="text-blue-600 font-semibold">Start →</span>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const currentScenario = scenarios.find(s => s.id === selectedScenario)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSelectedScenario(null)}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Change Scenario
          </button>
          <h1 className="text-lg font-bold text-gray-900">{currentScenario.title}</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Vocabulary Helper */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
        <div className="container mx-auto flex items-center gap-2 text-sm">
          <span className="font-semibold text-gray-700">💡 Key words:</span>
          {currentScenario.vocabulary.map((word, idx) => (
            <span key={idx} className="bg-white px-3 py-1 rounded-full text-gray-700 border border-yellow-300">
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <main className="flex-1 container mx-auto px-6 py-6 max-w-4xl flex flex-col">
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 mb-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-lg mb-1">{message.text}</p>
                  {message.translation && (
                    <p className="text-sm opacity-75 italic">{message.translation}</p>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-lg p-4 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response in Swedish..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';

type EnergyEntry = {
  id: string;
  date: string;
  morningEnergy?: number;
  morningNotes?: string;
  eveningEnergy?: number;
  eveningNotes?: string;
  activities?: string[];
};

export default function EnergyForecastApp() {
  const [entries, setEntries] = useState<EnergyEntry[]>([]);
  const [currentView, setCurrentView] = useState<'input' | 'calendar' | 'analysis'>('input');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [morningEnergy, setMorningEnergy] = useState<number>(5);
  const [morningNotes, setMorningNotes] = useState<string>('');
  const [eveningEnergy, setEveningEnergy] = useState<number>(5);
  const [eveningNotes, setEveningNotes] = useState<string>('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const activities = ['Exercise', 'Good Sleep', 'Poor Sleep', 'Stress', 'Social', 'Work Heavy', 'Relaxation'];

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('energyEntries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('energyEntries', JSON.stringify(entries));
    }
  }, [entries]);

  const saveMorningCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const existing = entries.find(e => e.date === today);
    
    if (existing) {
      setEntries(entries.map(e => 
        e.date === today 
          ? { ...e, morningEnergy, morningNotes, activities: selectedActivities }
          : e
      ));
    } else {
      setEntries([...entries, {
        id: Date.now().toString(),
        date: today,
        morningEnergy,
        morningNotes,
        activities: selectedActivities
      }]);
    }
    
    setMorningNotes('');
    setSelectedActivities([]);
    alert('Morning check-in saved!');
  };

  const saveEveningCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const existing = entries.find(e => e.date === today);
    
    if (existing) {
      setEntries(entries.map(e => 
        e.date === today 
          ? { ...e, eveningEnergy, eveningNotes }
          : e
      ));
    } else {
      setEntries([...entries, {
        id: Date.now().toString(),
        date: today,
        eveningEnergy,
        eveningNotes
      }]);
    }
    
    setEveningNotes('');
    alert('Evening check-in saved!');
  };

  const getEnergyColor = (energy?: number) => {
    if (!energy) return 'bg-gray-200';
    if (energy >= 7) return 'bg-green-500';
    if (energy >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateStats = () => {
    if (entries.length < 14) return null;

    const allEnergies = entries.flatMap(e => [e.morningEnergy, e.eveningEnergy].filter(Boolean)) as number[];
    const avgEnergy = allEnergies.reduce((a, b) => a + b, 0) / allEnergies.length;

    // Day of week analysis
    const dayStats: { [key: string]: number[] } = {};
    entries.forEach(entry => {
      const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
      if (!dayStats[day]) dayStats[day] = [];
      if (entry.morningEnergy) dayStats[day].push(entry.morningEnergy);
    });

    const bestDay = Object.entries(dayStats).reduce((best, [day, energies]) => {
      const avg = energies.reduce((a, b) => a + b, 0) / energies.length;
      return avg > best.avg ? { day, avg } : best;
    }, { day: '', avg: 0 });

    // Activity correlations
    const activityImpact: { [key: string]: { count: number; totalEnergy: number } } = {};
    entries.forEach(entry => {
      if (entry.activities && entry.eveningEnergy) {
        entry.activities.forEach(activity => {
          if (!activityImpact[activity]) activityImpact[activity] = { count: 0, totalEnergy: 0 };
          activityImpact[activity].count++;
          activityImpact[activity].totalEnergy += entry.eveningEnergy;
        });
      }
    });

    const activityAvgs = Object.entries(activityImpact).map(([activity, data]) => ({
      activity,
      avg: data.totalEnergy / data.count
    })).sort((a, b) => b.avg - a.avg);

    return { avgEnergy, bestDay, activityAvgs };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⚡ Energy Forecast</h1>
          <p className="text-gray-600">Track your energy, discover your patterns</p>
        </header>

        {/* Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-2 shadow-sm">
          <button
            onClick={() => setCurrentView('input')}
            className={`flex-1 py-3 rounded-md font-medium transition-colors ${
              currentView === 'input' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Daily Check-in
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`flex-1 py-3 rounded-md font-medium transition-colors ${
              currentView === 'calendar' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Calendar ({entries.length} days)
          </button>
          <button
            onClick={() => setCurrentView('analysis')}
            className={`flex-1 py-3 rounded-md font-medium transition-colors ${
              currentView === 'analysis' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Analysis
          </button>
        </div>

        {/* Daily Input View */}
        {currentView === 'input' && (
          <div className="space-y-6">
            {/* Morning Check-in */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🌅 Morning Check-in</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Level: {morningEnergy}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={morningEnergy}
                  onChange={(e) => setMorningEnergy(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What did you do yesterday?
                </label>
                <div className="flex flex-wrap gap-2">
                  {activities.map(activity => (
                    <button
                      key={activity}
                      onClick={() => {
                        if (selectedActivities.includes(activity)) {
                          setSelectedActivities(selectedActivities.filter(a => a !== activity));
                        } else {
                          setSelectedActivities([...selectedActivities, activity]);
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedActivities.includes(activity)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick notes (optional)
                </label>
                <input
                  type="text"
                  value={morningNotes}
                  onChange={(e) => setMorningNotes(e.target.value)}
                  placeholder="Any other details..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={saveMorningCheckIn}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Save Morning Check-in
              </button>
            </div>

            {/* Evening Check-in */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🌙 Evening Check-in</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Energy: {eveningEnergy}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={eveningEnergy}
                  onChange={(e) => setEveningEnergy(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick notes (optional)
                </label>
                <input
                  type="text"
                  value={eveningNotes}
                  onChange={(e) => setEveningNotes(e.target.value)}
                  placeholder="How was your day?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={saveEveningCheckIn}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Save Evening Check-in
              </button>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {currentView === 'calendar' && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Energy Calendar</h2>
            
            {entries.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No entries yet. Start tracking your energy!</p>
            ) : (
              <div className="space-y-3">
                {entries.slice().reverse().map(entry => (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Morning</div>
                        {entry.morningEnergy ? (
                          <>
                            <div className="flex items-center gap-2">
                              <div className={`w-12 h-12 rounded-lg ${getEnergyColor(entry.morningEnergy)} flex items-center justify-center text-white font-bold`}>
                                {entry.morningEnergy}
                              </div>
                            </div>
                            {entry.activities && entry.activities.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {entry.activities.map(activity => (
                                  <span key={activity} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {activity}
                                  </span>
                                ))}
                              </div>
                            )}
                            {entry.morningNotes && (
                              <p className="text-sm text-gray-600 mt-1">{entry.morningNotes}</p>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">No check-in</span>
                        )}
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Evening</div>
                        {entry.eveningEnergy ? (
                          <>
                            <div className="flex items-center gap-2">
                              <div className={`w-12 h-12 rounded-lg ${getEnergyColor(entry.eveningEnergy)} flex items-center justify-center text-white font-bold`}>
                                {entry.eveningEnergy}
                              </div>
                            </div>
                            {entry.eveningNotes && (
                              <p className="text-sm text-gray-600 mt-1">{entry.eveningNotes}</p>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">No check-in</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analysis View */}
        {currentView === 'analysis' && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Energy Analysis</h2>
            
            {!stats ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-2">Need at least 14 days of data for analysis</p>
                <p className="text-3xl font-bold text-purple-600">{entries.length}/14 days</p>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${(entries.length / 14) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Average Energy */}
                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Average Energy</h3>
                  <p className="text-3xl font-bold text-purple-600">{stats.avgEnergy.toFixed(1)}/10</p>
                </div>

                {/* Best Day */}
                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🌟 Peak Energy Day</h3>
                  <p className="text-xl font-bold text-green-600">
                    {stats.bestDay.day} ({stats.bestDay.avg.toFixed(1)}/10)
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    You're most energized on {stats.bestDay.day} mornings
                  </p>
                </div>

                {/* Activity Impact */}
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Activity Impact on Energy</h3>
                  <div className="space-y-2">
                    {stats.activityAvgs.map(({ activity, avg }) => (
                      <div key={activity} className="flex items-center justify-between">
                        <span className="text-gray-700">{activity}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(avg / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600 w-12">
                            {avg.toFixed(1)}/10
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 Insights</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {stats.activityAvgs[0] && (
                      <li>✨ {stats.activityAvgs[0].activity} gives you the biggest energy boost</li>
                    )}
                    {stats.activityAvgs[stats.activityAvgs.length - 1] && (
                      <li>⚠️ Watch out for {stats.activityAvgs[stats.activityAvgs.length - 1].activity} - it tends to drain your energy</li>
                    )}
                    <li>📅 Schedule demanding tasks on {stats.bestDay.day} when you're at your peak</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


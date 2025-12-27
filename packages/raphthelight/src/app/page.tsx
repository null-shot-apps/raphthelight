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

type TimeOfDay = 'morning' | 'afternoon' | 'evening';
type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export default function EnergyForecastApp() {
  const [entries, setEntries] = useState<EnergyEntry[]>([]);
  const [currentView, setCurrentView] = useState<'input' | 'calendar' | 'analysis' | 'predictions'>('input');
  const [morningEnergy, setMorningEnergy] = useState<number>(5);
  const [morningNotes, setMorningNotes] = useState<string>('');
  const [eveningEnergy, setEveningEnergy] = useState<number>(5);
  const [eveningNotes, setEveningNotes] = useState<string>('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [predictionDay, setPredictionDay] = useState<DayOfWeek>('Monday');
  const [predictionTime, setPredictionTime] = useState<TimeOfDay>('morning');

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

  const predictEnergy = (day: DayOfWeek, time: TimeOfDay) => {
    if (entries.length < 14) return null;

    const dayEntries = entries.filter(entry => {
      const entryDay = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
      return entryDay === day;
    });

    if (dayEntries.length === 0) return null;

    const energies = dayEntries
      .map(e => time === 'morning' ? e.morningEnergy : e.eveningEnergy)
      .filter(Boolean) as number[];

    if (energies.length === 0) return null;

    const avgEnergy = energies.reduce((a, b) => a + b, 0) / energies.length;
    const variance = energies.reduce((sum, e) => sum + Math.pow(e - avgEnergy, 2), 0) / energies.length;
    const stdDev = Math.sqrt(variance);

    return {
      predicted: avgEnergy,
      confidence: stdDev < 2 ? 'high' : stdDev < 3 ? 'medium' : 'low',
      warning: avgEnergy < 5,
      sampleSize: energies.length
    };
  };

  const getBestTimesForTasks = () => {
    if (entries.length < 14) return null;

    const timeSlots: { [key: string]: number[] } = {};
    
    entries.forEach(entry => {
      const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
      
      if (entry.morningEnergy) {
        const key = `${day}-morning`;
        if (!timeSlots[key]) timeSlots[key] = [];
        timeSlots[key].push(entry.morningEnergy);
      }
      
      if (entry.eveningEnergy) {
        const key = `${day}-evening`;
        if (!timeSlots[key]) timeSlots[key] = [];
        timeSlots[key].push(entry.eveningEnergy);
      }
    });

    const avgTimeSlots = Object.entries(timeSlots).map(([slot, energies]) => ({
      slot,
      avg: energies.reduce((a, b) => a + b, 0) / energies.length
    })).sort((a, b) => b.avg - a.avg);

    return avgTimeSlots.slice(0, 5);
  };

  const getEnergyDrains = () => {
    if (entries.length < 14) return null;

    const timeSlots: { [key: string]: number[] } = {};
    
    entries.forEach(entry => {
      const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
      
      if (entry.morningEnergy) {
        const key = `${day}-morning`;
        if (!timeSlots[key]) timeSlots[key] = [];
        timeSlots[key].push(entry.morningEnergy);
      }
      
      if (entry.eveningEnergy) {
        const key = `${day}-evening`;
        if (!timeSlots[key]) timeSlots[key] = [];
        timeSlots[key].push(entry.eveningEnergy);
      }
    });

    const avgTimeSlots = Object.entries(timeSlots).map(([slot, energies]) => ({
      slot,
      avg: energies.reduce((a, b) => a + b, 0) / energies.length
    })).sort((a, b) => a.avg - b.avg);

    return avgTimeSlots.slice(0, 3);
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
      if (entry.activities && entry.eveningEnergy !== undefined) {
        entry.activities.forEach(activity => {
          if (!activityImpact[activity]) activityImpact[activity] = { count: 0, totalEnergy: 0 };
          activityImpact[activity].count++;
          activityImpact[activity].totalEnergy += entry.eveningEnergy!;
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 bg-white rounded-lg p-2 shadow-sm">
          <button
            onClick={() => setCurrentView('input')}
            className={`py-3 rounded-md font-medium transition-colors ${
              currentView === 'input' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Check-in
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`py-3 rounded-md font-medium transition-colors ${
              currentView === 'calendar' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setCurrentView('analysis')}
            className={`py-3 rounded-md font-medium transition-colors ${
              currentView === 'analysis' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Analysis
          </button>
          <button
            onClick={() => setCurrentView('predictions')}
            className={`py-3 rounded-md font-medium transition-colors ${
              currentView === 'predictions' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Predictions
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
          <div className="space-y-6">
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
                  {/* Energy Trend Graph */}
                  <div className="border-l-4 border-purple-600 pl-4">
                    <h3 className="font-semibold text-gray-800 mb-3">📈 Energy Trend (Last 14 Days)</h3>
                    <div className="relative h-48 bg-gray-50 rounded-lg p-4">
                      <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
                        {entries.slice(-14).map((entry) => {
                          const avgEnergy = ((entry.morningEnergy || 0) + (entry.eveningEnergy || 0)) / 
                            ((entry.morningEnergy ? 1 : 0) + (entry.eveningEnergy ? 1 : 0));
                          const height = (avgEnergy / 10) * 100;
                          return (
                            <div key={entry.id} className="flex flex-col items-center gap-1 flex-1">
                              <div 
                                className={`w-full max-w-[20px] rounded-t transition-all ${getEnergyColor(avgEnergy)}`}
                                style={{ height: `${height}%` }}
                                title={`${new Date(entry.date).toLocaleDateString()}: ${avgEnergy.toFixed(1)}`}
                              />
                              <span className="text-[8px] text-gray-500">
                                {new Date(entry.date).getDate()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

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
                      You&apos;re most energized on {stats.bestDay.day} mornings
                    </p>
                  </div>

                  {/* Energy Drains */}
                  {getEnergyDrains() && (
                    <div className="border-l-4 border-red-600 pl-4">
                      <h3 className="font-semibold text-gray-800 mb-2">⚠️ Energy Drains</h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {getEnergyDrains()!.map(({ slot, avg }) => (
                          <li key={slot}>
                            {slot.replace('-', ' ')}: {avg.toFixed(1)}/10
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Activity Impact */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Activity Impact on Energy</h3>
                    <div className="space-y-2">
                      {stats.activityAvgs.map(({ activity, avg }) => {
                        const baselineAvg = stats.avgEnergy;
                        const percentChange = ((avg - baselineAvg) / baselineAvg * 100);
                        const percentChangeStr = percentChange.toFixed(0);
                        return (
                          <div key={activity} className="flex items-center justify-between">
                            <span className="text-gray-700">{activity}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(avg / 10) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-600 w-20">
                                {avg.toFixed(1)} ({percentChange > 0 ? '+' : ''}{percentChangeStr}%)
                              </span>
                            </div>
                          </div>
                        );
                      })}
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
                      <li>📅 Schedule demanding tasks on {stats.bestDay.day} when you&apos;re at your peak</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Predictions View */}
        {currentView === 'predictions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🔮 Energy Predictions</h2>
              
              {entries.length < 14 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-2">Need at least 14 days of data for predictions</p>
                  <p className="text-3xl font-bold text-purple-600">{entries.length}/14 days</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Prediction Tool */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-4">When are you planning something?</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                        <select
                          value={predictionDay}
                          onChange={(e) => setPredictionDay(e.target.value as DayOfWeek)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option>Monday</option>
                          <option>Tuesday</option>
                          <option>Wednesday</option>
                          <option>Thursday</option>
                          <option>Friday</option>
                          <option>Saturday</option>
                          <option>Sunday</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <select
                          value={predictionTime}
                          onChange={(e) => setPredictionTime(e.target.value as TimeOfDay)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="morning">Morning</option>
                          <option value="evening">Evening</option>
                        </select>
                      </div>
                    </div>

                    {(() => {
                      const prediction = predictEnergy(predictionDay, predictionTime);
                      if (!prediction) {
                        return <p className="text-gray-600 text-sm">Not enough data for this time slot</p>;
                      }

                      return (
                        <div className={`rounded-lg p-4 ${prediction.warning ? 'bg-red-50 border-2 border-red-300' : 'bg-green-50 border-2 border-green-300'}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-16 h-16 rounded-lg ${getEnergyColor(prediction.predicted)} flex items-center justify-center text-white font-bold text-2xl`}>
                              {prediction.predicted.toFixed(1)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                Predicted Energy: {prediction.predicted.toFixed(1)}/10
                              </p>
                              <p className="text-sm text-gray-600">
                                Confidence: {prediction.confidence} ({prediction.sampleSize} samples)
                              </p>
                            </div>
                          </div>
                          
                          {prediction.warning && (
                            <div className="bg-red-100 border border-red-300 rounded p-3 mt-3">
                              <p className="text-red-800 font-medium">⚠️ Warning: Low Energy Expected</p>
                              <p className="text-sm text-red-700 mt-1">
                                You historically have low energy at this time. Consider rescheduling demanding tasks.
                              </p>
                            </div>
                          )}
                          
                          {!prediction.warning && (
                            <div className="bg-green-100 border border-green-300 rounded p-3 mt-3">
                              <p className="text-green-800 font-medium">✅ Good Time for Activities</p>
                              <p className="text-sm text-green-700 mt-1">
                                You typically have good energy at this time!
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Best Times for Tasks */}
                  {getBestTimesForTasks() && (
                    <div className="border-l-4 border-green-600 pl-4">
                      <h3 className="font-semibold text-gray-800 mb-3">⭐ Best Times for Demanding Tasks</h3>
                      <div className="space-y-2">
                        {getBestTimesForTasks()!.map(({ slot, avg }, idx) => (
                          <div key={slot} className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-green-600">#{idx + 1}</span>
                              <div>
                                <p className="font-medium text-gray-800">
                                  {slot.replace('-', ' ')}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Average energy: {avg.toFixed(1)}/10
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        💡 Schedule important meetings, workouts, or creative work during these times
                      </p>
                    </div>
                  )}

                  {/* Scheduling Advice */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">📅 Scheduling Advice</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>✅ Book demanding tasks during your peak energy times</li>
                      <li>⏰ Schedule routine tasks during medium energy periods</li>
                      <li>🛋️ Reserve low energy times for rest and light activities</li>
                      <li>📊 Check predictions before committing to plans</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}










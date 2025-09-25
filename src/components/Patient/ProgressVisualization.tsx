import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, Award, Target } from 'lucide-react';

interface ProgressData {
  date: string;
  energy: number;
  stress: number;
  bodyComfort: number;
  overall: number;
  treatment: string;
  improvements?: string;
  sideEffects?: string;
}

interface ProgressVisualizationProps {
  data: ProgressData[];
}

const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({ data }) => {
  const [timeFilter, setTimeFilter] = useState('week');

  // Calculate improvements
  const calculateImprovement = (metric: keyof ProgressData) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3).reduce((sum, d) => sum + (d[metric] as number), 0) / 3;
    const earlier = data.slice(0, 3).reduce((sum, d) => sum + (d[metric] as number), 0) / 3;
    return ((recent - earlier) / earlier) * 100;
  };

  const energyImprovement = calculateImprovement('energy');
  const stressReduction = -calculateImprovement('stress'); // Negative because lower stress is better
  const comfortImprovement = calculateImprovement('bodyComfort');
  const overallImprovement = calculateImprovement('overall');

  const improvements = [
    { label: 'Energy Boost', value: energyImprovement, color: 'green', icon: '⚡' },
    { label: 'Stress Reduction', value: stressReduction, color: 'blue', icon: '🧘' },
    { label: 'Body Comfort', value: comfortImprovement, color: 'red', icon: '💪' },
    { label: 'Overall Wellness', value: overallImprovement, color: 'yellow', icon: '✨' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">
            Pragati Darpaṇa – Your Mirror of Progress
          </h2>
          <p className="text-gray-600 mt-1">Track your healing journey over time</p>
        </div>
        <div className="flex space-x-2">
          {['week', 'month', 'all'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === filter
                  ? 'bg-sage-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-sage-100'
              }`}
            >
              {filter === 'all' ? 'All Time' : `This ${filter}`}
            </button>
          ))}
        </div>
      </div>

      {/* Key Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {improvements.map((improvement, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">{improvement.icon}</div>
              <div className={`flex items-center space-x-1 ${
                improvement.value >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {improvement.value >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-bold text-lg">
                  {Math.abs(improvement.value).toFixed(1)}%
                </span>
              </div>
            </div>
            <h3 className="font-semibold text-charcoal mb-1">{improvement.label}</h3>
            <p className="text-sm text-gray-600">
              {improvement.value >= 0 ? 'Improved' : 'Needs attention'}
            </p>
          </div>
        ))}
      </div>

      {/* Wellness Trends Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-charcoal mb-6">Wellness Trends</h3>
        
        {/* Simple Line Chart Visualization */}
        <div className="space-y-6">
          {[
            { label: 'Energy Level', key: 'energy', color: 'bg-green-500' },
            { label: 'Stress Level', key: 'stress', color: 'bg-blue-500' },
            { label: 'Body Comfort', key: 'bodyComfort', color: 'bg-red-500' },
            { label: 'Overall Feeling', key: 'overall', color: 'bg-yellow-500' }
          ].map((metric) => (
            <div key={metric.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${metric.color}`}></div>
                  <span className="font-medium text-charcoal">{metric.label}</span>
                </div>
                <span className="text-sm text-gray-600">
                  Latest: {data[data.length - 1]?.[metric.key as keyof ProgressData]}/10
                </span>
              </div>
              <div className="flex items-center space-x-2 h-8">
                {data.slice(-7).map((point, index) => (
                  <div key={index} className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${metric.color} transition-all duration-500`}
                      style={{ 
                        height: '100%',
                        width: `${((point[metric.key as keyof ProgressData] as number) / 10) * 100}%` 
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback & Session Log */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-charcoal mb-6">Session Feedback Log</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {data.slice().reverse().map((session, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-charcoal">{session.treatment}</h4>
                  <p className="text-sm text-gray-600">{session.date}</p>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-600">Overall:</span>
                    <span className="font-medium text-sage-600">{session.overall}/10</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-xs text-gray-600">Energy</div>
                  <div className="font-medium text-green-600">{session.energy}/10</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600">Stress</div>
                  <div className="font-medium text-blue-600">{session.stress}/10</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600">Comfort</div>
                  <div className="font-medium text-red-600">{session.bodyComfort}/10</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600">Overall</div>
                  <div className="font-medium text-yellow-600">{session.overall}/10</div>
                </div>
              </div>

              {(session.improvements || session.sideEffects) && (
                <div className="space-y-2">
                  {session.improvements && (
                    <div className="bg-green-50 border border-green-200 rounded p-2">
                      <div className="text-xs font-medium text-green-800 mb-1">Improvements:</div>
                      <div className="text-sm text-green-700">{session.improvements}</div>
                    </div>
                  )}
                  {session.sideEffects && (
                    <div className="bg-orange-50 border border-orange-200 rounded p-2">
                      <div className="text-xs font-medium text-orange-800 mb-1">Side Effects:</div>
                      <div className="text-sm text-orange-700">{session.sideEffects}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-br from-sage-50 to-beige-50 rounded-xl p-6 border border-sage-200">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="w-6 h-6 text-sage-600" />
          <h3 className="text-lg font-semibold text-charcoal">Your Achievements</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold text-charcoal">Consistency Star</div>
            <div className="text-sm text-gray-600">7 sessions completed</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">📈</div>
            <div className="font-semibold text-charcoal">Progress Champion</div>
            <div className="text-sm text-gray-600">25% overall improvement</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🌟</div>
            <div className="font-semibold text-charcoal">Wellness Warrior</div>
            <div className="text-sm text-gray-600">Stress reduced by 40%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressVisualization;
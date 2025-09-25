import React, { useState } from 'react';
import { X, Battery, Cloud, Heart, Smile, Plus, Minus, Send } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: {
    treatment: string;
    time: string;
    date: string;
  };
  onSubmit: (feedback: FeedbackData) => void;
}

interface FeedbackData {
  energyLevel: number;
  stressLevel: number;
  symptomSpecific: number;
  overallFeeling: number;
  improvements: string;
  sideEffects: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, sessionData, onSubmit }) => {
  const [feedback, setFeedback] = useState<FeedbackData>({
    energyLevel: 5,
    stressLevel: 5,
    symptomSpecific: 5,
    overallFeeling: 5,
    improvements: '',
    sideEffects: ''
  });

  const [showImprovements, setShowImprovements] = useState(false);
  const [showSideEffects, setShowSideEffects] = useState(false);

  if (!isOpen) return null;

  const handleSliderChange = (field: keyof FeedbackData, value: number) => {
    setFeedback(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(feedback);
    onClose();
  };

  const getEnergyIcon = (level: number) => {
    const percentage = (level / 10) * 100;
    return (
      <div className="relative w-8 h-8">
        <Battery className="w-8 h-8 text-gray-300" />
        <div 
          className="absolute bottom-1 left-1 bg-green-500 rounded-sm transition-all duration-300"
          style={{ 
            width: `${Math.max(percentage * 0.6 / 100, 0.1)}rem`, 
            height: `${Math.max(percentage * 0.6 / 100, 0.1)}rem` 
          }}
        />
      </div>
    );
  };

  const getStressIcon = (level: number) => {
    const opacity = level / 10;
    return <Cloud className="w-8 h-8 text-gray-400" style={{ opacity: 0.3 + opacity * 0.7 }} />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-serif font-bold text-charcoal">How are you feeling?</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600">
            Your feedback for: <span className="font-medium text-sage-600">{sessionData.treatment}</span> 
            <span className="text-sm"> ({sessionData.date} at {sessionData.time})</span>
          </p>
        </div>

        {/* Feedback Sliders */}
        <div className="p-6 space-y-8">
          {/* Energy Level */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {getEnergyIcon(feedback.energyLevel)}
              <div>
                <h3 className="font-semibold text-charcoal">Energy (ऊर्जा)</h3>
                <p className="text-sm text-gray-600">How energetic do you feel?</p>
              </div>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                value={feedback.energyLevel}
                onChange={(e) => handleSliderChange('energyLevel', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Very Low</span>
                <span className="font-medium text-sage-600">{feedback.energyLevel}/10</span>
                <span>Very High</span>
              </div>
            </div>
          </div>

          {/* Stress Level */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {getStressIcon(feedback.stressLevel)}
              <div>
                <h3 className="font-semibold text-charcoal">Stress (तनाव)</h3>
                <p className="text-sm text-gray-600">How stressed or anxious do you feel?</p>
              </div>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                value={feedback.stressLevel}
                onChange={(e) => handleSliderChange('stressLevel', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Very Calm</span>
                <span className="font-medium text-blue-600">{feedback.stressLevel}/10</span>
                <span>Very Stressed</span>
              </div>
            </div>
          </div>

          {/* Symptom Specific */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-red-400" />
              <div>
                <h3 className="font-semibold text-charcoal">Body Comfort (शारीरिक आराम)</h3>
                <p className="text-sm text-gray-600">How comfortable does your body feel?</p>
              </div>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                value={feedback.symptomSpecific}
                onChange={(e) => handleSliderChange('symptomSpecific', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-red"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Uncomfortable</span>
                <span className="font-medium text-red-600">{feedback.symptomSpecific}/10</span>
                <span>Very Comfortable</span>
              </div>
            </div>
          </div>

          {/* Overall Feeling */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Smile className="w-8 h-8 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-charcoal">Overall (कुल मिलाकर)</h3>
                <p className="text-sm text-gray-600">How do you feel overall?</p>
              </div>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                value={feedback.overallFeeling}
                onChange={(e) => handleSliderChange('overallFeeling', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-yellow"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Poor</span>
                <span className="font-medium text-yellow-600">{feedback.overallFeeling}/10</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {/* Specific Observations */}
          <div className="space-y-4">
            <h3 className="font-semibold text-charcoal">Any specific changes to note?</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowImprovements(!showImprovements)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  showImprovements 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-green-50'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Report an Improvement</span>
              </button>
              <button
                onClick={() => setShowSideEffects(!showSideEffects)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  showSideEffects 
                    ? 'bg-orange-50 border-orange-200 text-orange-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-orange-50'
                }`}
              >
                <Minus className="w-4 h-4" />
                <span>Report a Side Effect</span>
              </button>
            </div>

            {showImprovements && (
              <textarea
                placeholder="Describe any improvements you've noticed..."
                value={feedback.improvements}
                onChange={(e) => setFeedback(prev => ({ ...prev, improvements: e.target.value }))}
                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50"
                rows={3}
              />
            )}

            {showSideEffects && (
              <textarea
                placeholder="Describe any side effects or concerns..."
                value={feedback.sideEffects}
                onChange={(e) => setFeedback(prev => ({ ...prev, sideEffects: e.target.value }))}
                className="w-full p-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-orange-50"
                rows={3}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center space-x-2 bg-teal-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Send className="w-5 h-5" />
            <span>Submit Feedback</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider-green::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider-blue::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider-red::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider-yellow::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default FeedbackModal;
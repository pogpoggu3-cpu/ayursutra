import React from 'react';
import { X, TrendingUp, TrendingDown, Calendar, User } from 'lucide-react';
import ProgressVisualization from '../Patient/ProgressVisualization';

interface PatientProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    id: string;
    name: string;
    condition: string;
    progress: number;
  };
  progressData: any[];
}

const PatientProgressModal: React.FC<PatientProgressModalProps> = ({ 
  isOpen, 
  onClose, 
  patient, 
  progressData 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-charcoal">{patient.name}</h2>
                <p className="text-gray-600">Condition: {patient.condition} • Progress: {patient.progress}%</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <ProgressVisualization data={progressData} />
        </div>
      </div>
    </div>
  );
};

export default PatientProgressModal;
import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Clock, 
  MapPin,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  FileText,
  Star,
  Timer,
  Activity
} from 'lucide-react';

const TherapistDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Today\'s Sessions', value: '6', change: 'On schedule', icon: <Calendar className="w-6 h-6" /> },
    { title: 'Active Patients', value: '18', change: '+3 new', icon: <Users className="w-6 h-6" /> },
    { title: 'Completion Rate', value: '98%', change: '+2%', icon: <CheckCircle className="w-6 h-6" /> },
    { title: 'Average Rating', value: '4.8/5', change: '↑ 0.2', icon: <Star className="w-6 h-6" /> }
  ];

  const todaySchedule = [
    { 
      time: '09:00 AM', 
      patient: 'Priya Sharma', 
      treatment: 'Abhyanga Massage', 
      duration: '60 mins',
      room: 'Room 1', 
      status: 'completed',
      notes: 'Patient responded well, reduced tension noted'
    },
    { 
      time: '10:30 AM', 
      patient: 'Raj Patel', 
      treatment: 'Shirodhara', 
      duration: '45 mins',
      room: 'Room 2', 
      status: 'in-progress',
      notes: 'Session in progress'
    },
    { 
      time: '12:00 PM', 
      patient: 'Anita Kumar', 
      treatment: 'Herbal Steam Bath', 
      duration: '30 mins',
      room: 'Room 3', 
      status: 'upcoming',
      notes: 'First session, explain procedure thoroughly'
    },
    { 
      time: '02:00 PM', 
      patient: 'Vikram Singh', 
      treatment: 'Nasya Therapy', 
      duration: '30 mins',
      room: 'Room 1', 
      status: 'upcoming',
      notes: 'Follow up on breathing improvements'
    }
  ];

  const roomStatus = [
    { room: 'Room 1', status: 'available', nextSession: '02:00 PM', currentTemp: '24°C' },
    { room: 'Room 2', status: 'occupied', nextSession: '11:15 AM', currentTemp: '26°C' },
    { room: 'Room 3', status: 'cleaning', nextSession: '12:00 PM', currentTemp: '23°C' },
    { room: 'Room 4', status: 'available', nextSession: '03:30 PM', currentTemp: '25°C' }
  ];

  const recentFeedback = [
    { 
      patient: 'Meera Gupta', 
      rating: 5, 
      comment: 'Excellent technique! I felt completely relaxed and my back pain has improved significantly.', 
      treatment: 'Abhyanga Massage',
      date: '2024-01-12'
    },
    { 
      patient: 'Suresh Reddy', 
      rating: 5, 
      comment: 'Very knowledgeable therapist. The Shirodhara session was perfectly executed.', 
      treatment: 'Shirodhara',
      date: '2024-01-11'
    },
    { 
      patient: 'Kavya Nair', 
      rating: 4, 
      comment: 'Good session overall. Would appreciate more explanation of the process.', 
      treatment: 'Panchakarma',
      date: '2024-01-10'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-mint-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-serif font-bold text-charcoal">Therapist Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, Maya Sharma</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current Session</p>
                  <p className="font-semibold text-blue-600">Shirodhara - Room 2</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-sage-600 to-teal-600 rounded-full flex items-center justify-center">
                  <Timer className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-8">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'schedule', label: 'Today\'s Schedule' },
            { key: 'rooms', label: 'Room Management' },
            { key: 'feedback', label: 'Patient Feedback' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-sage-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-sage-600 hover:bg-sage-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-sage-100 rounded-lg">
                      <div className="text-sage-600">{stat.icon}</div>
                    </div>
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-charcoal mb-1">{stat.value}</h3>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Session */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-charcoal flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-sage-600" />
                    Current Session
                  </h2>
                </div>
                <div className="p-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-blue-900">Shirodhara Therapy</h3>
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">In Progress</span>
                    </div>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>Patient:</span>
                        <span className="font-medium">Raj Patel</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Started:</span>
                        <span className="font-medium">10:30 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">45 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Room:</span>
                        <span className="font-medium">Room 2</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Add Notes
                      </button>
                      <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                        Complete Session
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Room Status */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-charcoal flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-sage-600" />
                    Room Status
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  {roomStatus.map((room, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-charcoal">{room.room}</h4>
                        <p className="text-sm text-gray-600">Next: {room.nextSession}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                          {room.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{room.currentTemp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-charcoal mb-6">Today's Session Schedule</h2>
              
              <div className="space-y-4">
                {todaySchedule.map((session, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    session.status === 'completed' ? 'bg-green-50 border-green-200' :
                    session.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="text-lg font-semibold text-charcoal">{session.time}</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)} border`}>
                          {session.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-600">{session.room}</div>
                        <div className="text-xs text-gray-500">{session.duration}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-charcoal mb-1">{session.patient}</h4>
                        <p className="text-sm text-gray-600">{session.treatment}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Session Notes:</h5>
                        <p className="text-sm text-gray-600">{session.notes}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      {session.status === 'upcoming' && (
                        <>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            Start Session
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                            View Patient Details
                          </button>
                        </>
                      )}
                      {session.status === 'in-progress' && (
                        <>
                          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                            Complete Session
                          </button>
                          <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">
                            Add Notes
                          </button>
                        </>
                      )}
                      {session.status === 'completed' && (
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                          View Session Report
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roomStatus.map((room, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-charcoal">{room.room}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Session:</span>
                      <span className="font-medium text-charcoal">{room.nextSession}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature:</span>
                      <span className="font-medium text-charcoal">{room.currentTemp}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-sage-600 text-white text-sm rounded hover:bg-sage-700 transition-colors">
                      View Details
                    </button>
                    <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors">
                      Adjust
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Room Management Controls</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-sage-50 rounded-lg">
                  <h4 className="font-medium text-sage-900 mb-2">Temperature Control</h4>
                  <p className="text-sm text-sage-700">Maintain optimal temperature for different treatments</p>
                  <button className="mt-2 px-4 py-2 bg-sage-600 text-white text-sm rounded hover:bg-sage-700 transition-colors">
                    Adjust All Rooms
                  </button>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Cleaning Schedule</h4>
                  <p className="text-sm text-blue-700">Schedule and track room sanitization</p>
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                    View Schedule
                  </button>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Equipment Status</h4>
                  <p className="text-sm text-yellow-700">Monitor and maintain therapy equipment</p>
                  <button className="mt-2 px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors">
                    Check Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-charcoal mb-6">Patient Feedback & Ratings</h2>
              
              <div className="space-y-6">
                {recentFeedback.map((feedback, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-charcoal">{feedback.patient}</h4>
                        <p className="text-sm text-gray-600">{feedback.treatment} • {feedback.date}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${
                              i < feedback.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`} 
                          />
                        ))}
                        <span className="ml-2 font-medium text-charcoal">{feedback.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{feedback.comment}"</p>
                    <div className="mt-3 flex space-x-2">
                      <button className="px-3 py-1 bg-sage-100 text-sage-700 text-sm rounded hover:bg-sage-200 transition-colors">
                        Respond
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors">
                        View Full Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-charcoal mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-semibold text-charcoal">4.8/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Reviews</span>
                    <span className="font-semibold text-charcoal">127</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-semibold text-charcoal">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Patient Satisfaction</span>
                    <span className="font-semibold text-green-600">98%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-charcoal mb-4">Improvement Areas</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-800">Communication</h4>
                    <p className="text-xs text-yellow-700">Some patients request more explanation during treatments</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800">Timing</h4>
                    <p className="text-xs text-blue-700">Opportunity to start sessions more punctually</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistDashboard;
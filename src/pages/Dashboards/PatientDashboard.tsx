import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Heart, TrendingUp, Clock, MessageCircle, Award, Activity, CheckCircle, 
  AlertCircle, Play, Pause, Send, Loader2, Mic, Volume2, Watch, Smartphone, Wifi, Battery
} from 'lucide-react';
import FeedbackModal from '../../components/Patient/FeedbackModal';
import ProgressVisualization from '../../components/Patient/ProgressVisualization';
import DietRecommendation from '../../components/Patient/DietRecommendation';

// Define a type for chat messages for better organization
type ChatMessage = {
  role: 'user' | 'model';
  text: string;
};

// --- Web Speech API ---
// Check for browser support. 'webkitSpeechRecognition' is for Safari/Chrome.
const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: SpeechRecognition | null = null;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
}

const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // --- Feedback Modal State ---
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [completedSession, setCompletedSession] = useState<any>(null);
  
  // --- Smartwatch Integration State ---
  const [smartwatchConnected, setSmartwatchConnected] = useState(false);
  const [smartwatchData, setSmartwatchData] = useState({
    heartRate: 72,
    steps: 8420,
    sleep: 7.5,
    stress: 3
  });

  // --- AI Assistant State ---
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // --- Scroll to bottom of chat ---
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // --- Voice Input (Speech-to-Text) ---
  const handleToggleListening = () => {
    if (!recognition) {
      alert("Sorry, your browser doesn't support voice recognition.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.lang = selectedLanguage;
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error("Speech recognition start error:", error);
        alert(`Sorry, your browser does not support the selected language (${selectedLanguage}). Please try English or check if the language pack is installed on your system.`);
        setIsListening(false);
        return;
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        // The 'language-not-supported' error is often caught here as well.
        if (event.error === 'language-not-supported') {
             alert(`Sorry, your browser does not support the selected language (${selectedLanguage}). Please try English or check if the language pack is installed on your system.`);
        } else {
            console.error("Speech recognition error:", event.error);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  };

  // --- Text-to-Speech ---
  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  };
  
  // --- Simulated Translation Function ---
  // In a real app, this would call an external translation API (like Google Translate)
  const translateText = async (text: string, targetLang: string, sourceLang: string = 'en-US'): Promise<string> => {
      console.log(`Simulating translation from ${sourceLang} to ${targetLang}: "${text}"`);
      // This is a placeholder. A real implementation would look like:
      /*
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=API_KEY`, {
          method: 'POST',
          body: JSON.stringify({ q: text, target: targetLang.split('-')[0] }),
      });
      const data = await response.json();
      return data.data.translations[0].translatedText;
      */
      if (targetLang.startsWith('en')) return text; // Don't "translate" to English
      return `[${targetLang.split('-')[0]}] ${text}`; // Simulate by prefixing with lang code
  };


  // --- Gemini API Call Function (with Multilingual Logic) ---
  const handleAskAI = async () => {
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: ChatMessage = { role: 'user', text: userInput };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setUserInput('');

    // 1. Translate user input to English before sending to Gemini
    const englishQuery = selectedLanguage.startsWith('en') 
        ? userInput
        : await translateText(userInput, 'en-US', selectedLanguage);

    const systemPrompt = `You are "AyurSutra Assistant," a specialized AI for a patient named Priya. 
      Your purpose is to provide helpful, safe, and supportive guidance based on Ayurvedic principles in English.
      Priya's current treatment plan includes Abhyanga, Shirodhara, and Herbal Steam Baths.
      Her primary goals are stress reduction and improving digestion.
      
      RULES:
      1. Always be gentle, empathetic, and encouraging. Your response MUST be in English.
      2. **Crucially, you must ALWAYS include this disclaimer at the end of your response: "This is AI-generated advice. Please consult your Vaidya (doctor) for any medical decisions."**
      3. Keep responses concise (2-4 sentences).`;
    
    // Replace with your actual API key
    const apiKey = "AIzaSyBtjJHxExKqtee8y-NJj5bEquUPXW5hWF8"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
 // Changed to gemini-pro for better general performance

    const payload = {
      contents: [{ role: 'user', parts: [{ text: englishQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      const modelResponseInEnglish = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
      
      // 2. Translate the English response back to the user's selected language
      const translatedResponse = selectedLanguage.startsWith('en')
        ? modelResponseInEnglish
        : await translateText(modelResponseInEnglish, selectedLanguage);

      const modelMessage: ChatMessage = { role: 'model', text: translatedResponse };
      setChatHistory([...updatedHistory, modelMessage]);

    } catch (error) {
      console.error("Gemini API call failed:", error);
      const errorMessage: ChatMessage = { role: 'model', text: "I'm having trouble connecting right now. Please try again." };
      setChatHistory([...updatedHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  // Mock Data (as provided)
  const treatmentStats = [
    { title: 'Sessions Completed', value: '8/12', progress: 67, icon: <CheckCircle className="w-6 h-6" /> },
    { title: 'Overall Progress', value: '78%', progress: 78, icon: <TrendingUp className="w-6 h-6" /> },
    { title: 'Wellness Score', value: '8.4/10', progress: 84, icon: <Heart className="w-6 h-6" /> },
    { title: 'Days Active', value: '24', progress: 100, icon: <Activity className="w-6 h-6" /> }
  ];

   const upcomingSessions = [
    { date: '2024-01-15', time: '09:00 AM', treatment: 'Abhyanga Massage', therapist: 'Maya Sharma', room: 'Room 1' },
    { date: '2024-01-16', time: '10:30 AM', treatment: 'Shirodhara', therapist: 'Raj Patel', room: 'Room 2' },
    { date: '2024-01-18', time: '02:00 PM', treatment: 'Herbal Steam Bath', therapist: 'Priya Nair', room: 'Room 3' }
  ];

  const dailyRoutines = [
    { time: '06:00 AM', activity: 'Morning Meditation', duration: '20 mins', completed: true },
    { time: '07:30 AM', activity: 'Herbal Tea (Tulsi)', duration: '5 mins', completed: true },
    { time: '09:00 AM', activity: 'Abhyanga Session', duration: '60 mins', completed: false },
    { time: '12:00 PM', activity: 'Ayurvedic Lunch', duration: '30 mins', completed: false },
    { time: '08:00 PM', activity: 'Evening Walk', duration: '15 mins', completed: false }
  ];

  const progressData = [
    {
      date: '2024-01-08',
      energy: 6,
      stress: 7,
      bodyComfort: 5,
      overall: 6,
      treatment: 'Abhyanga Massage',
      improvements: 'Feeling more relaxed after the session'
    },
    {
      date: '2024-01-09',
      energy: 7,
      stress: 6,
      bodyComfort: 6,
      overall: 7,
      treatment: 'Shirodhara',
      improvements: 'Better sleep quality'
    },
    {
      date: '2024-01-10',
      energy: 8,
      stress: 5,
      bodyComfort: 7,
      overall: 8,
      treatment: 'Herbal Steam Bath'
    },
    {
      date: '2024-01-11',
      energy: 8,
      stress: 4,
      bodyComfort: 8,
      overall: 8,
      treatment: 'Abhyanga Massage',
      improvements: 'Significant reduction in back pain'
    },
    {
      date: '2024-01-12',
      energy: 9,
      stress: 3,
      bodyComfort: 9,
      overall: 9,
      treatment: 'Abhyanga Massage',
      improvements: 'Feeling very energetic and positive'
    }
  ];

  // --- Feedback Handlers ---
  const handleCompleteSession = (session: any) => {
    setCompletedSession(session);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = (feedbackData: any) => {
    console.log('Feedback submitted:', feedbackData);
    // Here you would typically send the feedback to your backend
    // and update the progress data
  };

  // --- Smartwatch Handlers ---
  const handleConnectSmartwatch = () => {
    setSmartwatchConnected(true);
    // Simulate receiving data from smartwatch
    setInterval(() => {
      setSmartwatchData(prev => ({
        ...prev,
        heartRate: 70 + Math.floor(Math.random() * 10),
        steps: prev.steps + Math.floor(Math.random() * 50)
      }));
    }, 30000);
  };


  return (
    <div className="min-h-screen bg-mint-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-serif font-bold text-charcoal">Your Healing Journey</h1>
                <p className="text-gray-600 mt-1">Welcome back, Priya</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Next Session</p>
                  <p className="font-semibold text-sage-600">Tomorrow 9:00 AM</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-sage-600 to-teal-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
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
            { key: 'sessions', label: 'Sessions' },
            { key: 'progress', label: 'Progress' },
            { key: 'guidance', label: 'Daily Guidance' },
            { key: 'diet', label: 'Diet Plan' },
            { key: 'smartwatch', label: 'Smartwatch' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-2 rounded-md font-medium transition-all text-xs sm:text-sm ${
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
              {treatmentStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-sage-100 rounded-lg">
                      <div className="text-sage-600">{stat.icon}</div>
                    </div>
                    <span className="text-xs text-gray-600">{stat.progress}%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-charcoal mb-1">{stat.value}</h3>
                  <p className="text-gray-600 text-sm mb-3">{stat.title}</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-sage-600 to-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${stat.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Sessions */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-charcoal flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-sage-600" />
                    Upcoming Sessions
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-sage-50 to-beige-50 rounded-lg border-l-4 border-sage-600">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-sage-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {new Date(session.date).getDate()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-charcoal">{session.treatment}</h4>
                        <p className="text-sm text-gray-600">{session.time} • {session.therapist}</p>
                        <p className="text-xs text-sage-600 mt-1">{session.room}</p>
                      </div>
                      <button 
                        onClick={() => handleCompleteSession(session)}
                        className="text-sage-600 hover:text-sage-700"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Routine */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-charcoal flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-sage-600" />
                    Today's Routine
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  {dailyRoutines.map((routine, index) => (
                    <div key={index} className={`flex items-center space-x-4 p-3 rounded-lg ${
                      routine.completed 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <button className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        routine.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {routine.completed ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${routine.completed ? 'text-green-800' : 'text-charcoal'}`}>
                            {routine.activity}
                          </h4>
                          <span className="text-xs text-gray-600">{routine.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{routine.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-charcoal mb-6">Treatment Sessions</h2>
              
              {/* Session Timeline */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal">Abhyanga Massage - Session 8</h3>
                    <p className="text-sm text-gray-600">Completed on Jan 12, 2024 • 60 minutes</p>
                    <p className="text-sm text-green-700 mt-1">Great progress! Your stress levels have improved significantly.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">Completed</div>
                    <div className="text-xs text-gray-500">Rating: 9/10</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Play className="w-8 h-8 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal">Shirodhara - Session 9</h3>
                    <p className="text-sm text-gray-600">Tomorrow, Jan 16, 2024 • 10:30 AM</p>
                    <p className="text-sm text-blue-700 mt-1">Prepare with light breakfast, avoid caffeine.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600">Upcoming</div>
                    <button className="text-xs text-blue-600 hover:underline mt-1">View Details</button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-60">
                  <Pause className="w-8 h-8 text-gray-400" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal">Herbal Steam Bath - Session 10</h3>
                    <p className="text-sm text-gray-600">Jan 18, 2024 • 2:00 PM</p>
                    <p className="text-sm text-gray-500 mt-1">Scheduled after Shirodhara completion.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-600">Scheduled</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <ProgressVisualization data={progressData} />
        )}

        {/* Guidance Tab - Now Fully Integrated */}
        {activeTab === 'guidance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-charcoal mb-6">Daily Ayurvedic Guidance</h2>
              
              {/* Pre-therapy Instructions */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-charcoal mb-4">Pre-Treatment Preparation</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Tomorrow's Shirodhara Session</h4>
                      <ul className="space-y-1 text-sm text-blue-800">
                        <li>• Have a light breakfast 2 hours before treatment</li>
                        <li>• Avoid caffeine and heavy meals</li>
                        <li>• Wear comfortable, loose clothing</li>
                        <li>• Arrive 15 minutes early for preparation</li>
                        <li>• Bring a towel and hair tie</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Recommendations */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-charcoal mb-4">Today's Personalized Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-sage-50 rounded-lg p-4">
                    <h4 className="font-medium text-sage-900 mb-2">Morning Routine</h4>
                    <ul className="space-y-1 text-sm text-sage-800">
                      <li>• Start with warm water and lemon</li>
                      <li>• 15 minutes of gentle yoga</li>
                      <li>• Self-massage with sesame oil</li>
                    </ul>
                  </div>
                  <div className="bg-beige-50 rounded-lg p-4">
                    <h4 className="font-medium text-amber-900 mb-2">Dietary Guidance</h4>
                    <ul className="space-y-1 text-sm text-amber-800">
                      <li>• Focus on warm, cooked foods</li>
                      <li>• Include ginger and turmeric</li>
                      <li>• Avoid cold drinks and raw foods</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* AI Assistant - Integrated and Functional */}
              <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-charcoal">Ask Your AI Assistant</h3>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sage-500"
                        >
                        <option value="en-US">English</option>
                        <option value="hi-IN">हिन्दी (Hindi)</option>
                        <option value="mr-IN">मराठी (Marathi)</option>
                    </select>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  {/* Chat History */}
                  <div ref={chatContainerRef} className="h-64 overflow-y-auto bg-white rounded border border-gray-200 p-3 mb-4 space-y-4">
                    {chatHistory.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                         <MessageCircle className="w-10 h-10 text-gray-400 mb-2" />
                         <p className="text-gray-500">Ask a question to start the conversation.</p>
                         <p className="text-xs text-gray-400 mt-1">You can also use the microphone to speak.</p>
                      </div>
                    ) : (
                      chatHistory.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {msg.role === 'model' && (
                            <button onClick={() => speakText(msg.text, selectedLanguage)} className="text-gray-500 hover:text-sage-600 mt-1 flex-shrink-0">
                                <Volume2 className="w-5 h-5" />
                            </button>
                          )}
                          <div className={`max-w-md p-3 rounded-lg ${
                            msg.role === 'user' 
                            ? 'bg-sage-600 text-white' 
                            : 'bg-gray-200 text-charcoal'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input Form */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Ask a question or use the microphone..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      disabled={isLoading || isListening}
                    />
                    <button 
                      onClick={handleToggleListening}
                      className={`px-4 py-2 border rounded-lg flex items-center justify-center transition-colors ${
                        isListening 
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                      }`}
                      disabled={!recognition}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleAskAI}
                      className="px-6 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors flex items-center justify-center disabled:bg-sage-400"
                      disabled={isLoading || !userInput.trim()}
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diet Plan Tab */}
        {activeTab === 'diet' && (
          <DietRecommendation 
            patientDosha="Vata-Pitta"
            upcomingTreatment="Shirodhara"
            recentFeedback={{
              digestion: 7,
              energy: 8
            }}
          />
        )}

        {/* Smartwatch Integration Tab */}
        {activeTab === 'smartwatch' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-charcoal mb-6">Smartwatch Integration</h2>
              
              {!smartwatchConnected ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Watch className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal mb-4">Connect Your Smartwatch</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Sync your smartwatch to automatically track vital signs, sleep patterns, and activity levels 
                    to enhance your Ayurvedic treatment insights.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-sage-50 rounded-lg">
                      <Heart className="w-8 h-8 text-sage-600 mx-auto mb-2" />
                      <h4 className="font-medium text-charcoal">Heart Rate</h4>
                      <p className="text-sm text-gray-600">Monitor stress and recovery</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium text-charcoal">Activity Tracking</h4>
                      <p className="text-sm text-gray-600">Steps, movement, and exercise</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-medium text-charcoal">Sleep Analysis</h4>
                      <p className="text-sm text-gray-600">Quality and duration tracking</p>
                    </div>
                  </div>
                  <button
                    onClick={handleConnectSmartwatch}
                    className="bg-sage-600 text-white px-8 py-3 rounded-lg hover:bg-sage-700 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Wifi className="w-5 h-5" />
                    <span>Connect Smartwatch</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Connection Status */}
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-green-800">Apple Watch Connected</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <Battery className="w-4 h-4" />
                      <span className="text-sm">85%</span>
                    </div>
                  </div>

                  {/* Real-time Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100">
                      <div className="flex items-center justify-between mb-4">
                        <Heart className="w-8 h-8 text-red-500" />
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">Live</span>
                      </div>
                      <h3 className="text-2xl font-bold text-charcoal mb-1">{smartwatchData.heartRate}</h3>
                      <p className="text-red-600 text-sm">BPM</p>
                      <p className="text-xs text-gray-600 mt-2">Resting: 68 BPM</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <Activity className="w-8 h-8 text-blue-500" />
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Today</span>
                      </div>
                      <h3 className="text-2xl font-bold text-charcoal mb-1">{smartwatchData.steps.toLocaleString()}</h3>
                      <p className="text-blue-600 text-sm">Steps</p>
                      <p className="text-xs text-gray-600 mt-2">Goal: 10,000</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                      <div className="flex items-center justify-between mb-4">
                        <Clock className="w-8 h-8 text-purple-500" />
                        <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Last Night</span>
                      </div>
                      <h3 className="text-2xl font-bold text-charcoal mb-1">{smartwatchData.sleep}h</h3>
                      <p className="text-purple-600 text-sm">Sleep</p>
                      <p className="text-xs text-gray-600 mt-2">Quality: Good</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
                      <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="w-8 h-8 text-yellow-500" />
                        <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Current</span>
                      </div>
                      <h3 className="text-2xl font-bold text-charcoal mb-1">{smartwatchData.stress}/10</h3>
                      <p className="text-yellow-600 text-sm">Stress Level</p>
                      <p className="text-xs text-gray-600 mt-2">Low stress</p>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="bg-gradient-to-br from-sage-50 to-beige-50 rounded-xl p-6 border border-sage-200">
                    <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center">
                      <Smartphone className="w-5 h-5 mr-2 text-sage-600" />
                      AI Health Insights
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-charcoal font-medium">Excellent Recovery Pattern</p>
                          <p className="text-xs text-gray-600">Your heart rate variability shows great improvement since starting Abhyanga therapy.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-charcoal font-medium">Sleep Quality Improving</p>
                          <p className="text-xs text-gray-600">Deep sleep duration increased by 23% since beginning Shirodhara sessions.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-charcoal font-medium">Optimal Treatment Timing</p>
                          <p className="text-xs text-gray-600">Your stress levels are lowest between 10-11 AM - perfect for today's therapy.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        sessionData={completedSession || { treatment: '', time: '', date: '' }}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default PatientDashboard;
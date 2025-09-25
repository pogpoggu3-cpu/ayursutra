import React, { useState, useRef } from 'react';
import { 
  Users, 
  Calendar, 
  Brain, 
  TrendingUp, 
  Camera,
  Loader2,
  FileUp,
  X,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Clock
} from 'lucide-react';

// --- Type Definitions for Structured Data ---
type Therapy = {
  name: string;
  duration?: string; // e.g., "7 days", "3 sessions"
};

type TimingDetail = {
  period: string; // e.g., "Morning", "Pre-meal", "Diet"
  instruction: string;
};

type AnalysisResult = {
  patientName: string;
  patientAge?: number | null; // Optional age property
  therapies: Therapy[];
  dosageAndTiming: TimingDetail[];
};

// --- Initial State for Recent Analysis ---
const initialAnalyses: (AnalysisResult & { analyzedAt: string; accuracy: number })[] = [
  {
    patientName: "Priya Sharma",
    analyzedAt: "2 hours ago",
    accuracy: 99,
    therapies: [
      { name: "Abhyanga massage", duration: "7 days" },
      { name: "Shirodhara therapy", duration: "3 sessions" },
      { name: "Herbal steam bath", duration: "daily" },
      { name: "Meditation guidance", duration: "20 mins/day" },
    ],
    dosageAndTiming: [
      { period: "Morning", instruction: "6-8 AM" },
      { period: "Treatments", instruction: "Pre-meal" },
      { period: "Rest period", instruction: "30 mins post-therapy" },
      { period: "Diet", instruction: "Vata pacifying foods" },
    ],
  },
];

const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('prescriptions');

  // --- State for AI Prescription Analysis ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState(initialAnalyses);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Mock Data for Other Tabs ---
  const stats = [
    { title: 'Total Patients', value: '247', change: '+12%', icon: <Users className="w-6 h-6" /> },
    { title: 'Active Treatments', value: '45', change: '+8%', icon: <Calendar className="w-6 h-6" /> },
    { title: 'AI Prescriptions', value: '156', change: '+23%', icon: <Brain className="w-6 h-6" /> },
    { title: 'Success Rate', value: '94%', change: '+2%', icon: <TrendingUp className="w-6 h-6" /> }
  ];

  const recentPatients = [
    { id: 1, name: 'Priya Sharma', condition: 'Stress Management', nextSession: '2024-01-15', progress: 75 },
    { id: 2, name: 'Raj Patel', condition: 'Digestive Issues', nextSession: '2024-01-16', progress: 60 },
    { id: 3, name: 'Anita Kumar', condition: 'Joint Pain', nextSession: '2024-01-17', progress: 85 },
    { id: 4, name: 'Vikram Singh', condition: 'Insomnia', nextSession: '2024-01-18', progress: 40 }
  ];

  const todaySchedule = [
    { time: '09:00 AM', patient: 'Meera Gupta', treatment: 'Abhyanga', room: 'Room 1' },
    { time: '10:30 AM', patient: 'Suresh Reddy', treatment: 'Shirodhara', room: 'Room 2' },
    { time: '02:00 PM', patient: 'Kavya Nair', treatment: 'Panchakarma Consultation', room: 'Consultation' },
    { time: '03:30 PM', patient: 'Arjun Das', treatment: 'Nasya', room: 'Room 3' }
  ];


  // --- AI Analysis Handlers ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    } else {
      setError("Please select a valid image file.");
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyzePrescription = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);

    try {
      const base64Image = await fileToBase64(selectedFile);
      const apiKey = "AIzaSyBtjJHxExKqtee8y-NJj5bEquUPXW5hWF8"; // Your actual API Key
      
      if (apiKey === "YOUR_GEMINI_API_KEY" || !apiKey) {
          throw new Error("API Key is missing. Please add your Gemini API key.");
      }
      
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const prompt = `Analyze this image of a handwritten Ayurvedic prescription. Extract key information and return it ONLY as a single, valid JSON object. Do not include any explanatory text, markdown, or anything outside of the JSON structure. The required JSON structure is: { "patientName": "string", "patientAge": "number | null", "therapies": [ { "name": "string", "duration": "string" } ], "dosageAndTiming": [ { "period": "string", "instruction": "string" } ] }. If you cannot read something, use an empty string "", null for numbers, or an empty array []. Make your best guess for hard-to-read words.`;
      
      const payload = { contents: [ { parts: [ { text: prompt }, { inline_data: { mime_type: selectedFile.type, data: base64Image } } ] } ], };

      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`API error (${response.status}): ${errorBody.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error("The AI model returned no text. The image may be too unclear.");
      }
      const rawJsonText = result.candidates[0].content.parts[0].text;
      let parsedResult: AnalysisResult;

      try {
          const cleanedJsonText = rawJsonText.replace(/```json\n?|```/g, '').trim();
          parsedResult = JSON.parse(cleanedJsonText);
      } catch (jsonError) {
          console.error("Failed to parse JSON from AI response:", rawJsonText);
          throw new Error("The AI returned data in an invalid format.");
      }
      
      const newAnalysis = { ...parsedResult, analyzedAt: "Just now", accuracy: 95 };
      setRecentAnalyses([newAnalysis, ...recentAnalyses]);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    // The parent div and the main content container are kept, but the header/navbar is removed.
    <div className="min-h-screen bg-mint-50 pt-8"> {/* Added padding-top for spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className='mb-8'>
            <h1 className="text-3xl font-serif font-bold text-charcoal">Doctor Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, Dr. Sharma</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-8">
          {[ { key: 'overview', label: 'Overview' }, { key: 'patients', label: 'Patients' }, { key: 'prescriptions', label: 'AI Prescriptions' }, { key: 'schedule', label: 'Schedule' } ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 py-3 px-4 rounded-md font-medium transition-all text-sm sm:text-base ${ activeTab === tab.key ? 'bg-sage-600 text-white shadow-md' : 'text-gray-600 hover:text-sage-600 hover:bg-sage-50' }`}>{tab.label}</button>
          ))}
        </div>

        {/* --- CONDITIONAL TAB CONTENT --- */}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4"><div className="p-3 bg-sage-100 rounded-lg"><div className="text-sage-600">{stat.icon}</div></div><span className="text-sm text-green-600 font-medium">{stat.change}</span></div>
                  <h3 className="text-2xl font-bold text-charcoal mb-1">{stat.value}</h3><p className="text-gray-600 text-sm">{stat.title}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm"><div className="p-6 border-b border-gray-100"><h2 className="text-xl font-semibold text-charcoal">Recent Patients</h2></div>
                <div className="p-6 space-y-4">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1"><h4 className="font-medium text-charcoal">{patient.name}</h4><p className="text-sm text-gray-600">{patient.condition}</p><p className="text-xs text-gray-500 mt-1">Next: {patient.nextSession}</p></div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right"><div className="text-sm font-medium text-charcoal">{patient.progress}%</div><div className="w-16 h-2 bg-gray-200 rounded-full mt-1"><div className="h-full bg-sage-600 rounded-full" style={{ width: `${patient.progress}%` }}></div></div></div>
                        <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm"><div className="p-6 border-b border-gray-100"><h2 className="text-xl font-semibold text-charcoal">Today's Schedule</h2></div>
                <div className="p-6 space-y-4">
                  {todaySchedule.map((appointment, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border-l-4 border-sage-600 bg-sage-50 rounded-r-lg">
                      <div className="flex-shrink-0"><div className="w-2 h-2 bg-sage-600 rounded-full"></div></div>
                      <div className="flex-1 min-w-0"><div className="flex items-center justify-between"><p className="text-sm font-medium text-charcoal">{appointment.time}</p><span className="text-xs text-sage-600 bg-sage-200 px-2 py-1 rounded-full">{appointment.room}</span></div><p className="text-sm text-gray-900 mt-1">{appointment.patient}</p><p className="text-xs text-gray-600">{appointment.treatment}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-semibold text-charcoal">Patient Management</h2><button className="flex items-center space-x-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors"><Plus className="w-4 h-4" /><span>Add Patient</span></button></div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex space-x-4 mb-6">
                <div className="flex-1 relative"><Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" /><input type="text" placeholder="Search patients..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500" /></div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-4 h-4" /><span>Filter</span></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-200"><th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th><th className="text-left py-3 px-4 font-medium text-gray-700">Condition</th><th className="text-left py-3 px-4 font-medium text-gray-700">Progress</th><th className="text-left py-3 px-4 font-medium text-gray-700">Next Session</th><th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th></tr></thead>
                  <tbody>
                    {recentPatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4"><div className="flex items-center space-x-3"><div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center"><span className="text-sm font-medium text-sage-600">{patient.name.split(' ').map(n => n[0]).join('')}</span></div><span className="font-medium text-charcoal">{patient.name}</span></div></td>
                        <td className="py-3 px-4 text-gray-600">{patient.condition}</td>
                        <td className="py-3 px-4"><div className="flex items-center space-x-2"><div className="w-16 h-2 bg-gray-200 rounded-full"><div className="h-full bg-sage-600 rounded-full" style={{ width: `${patient.progress}%` }}></div></div><span className="text-sm text-gray-600">{patient.progress}%</span></div></td>
                        <td className="py-3 px-4 text-gray-600">{patient.nextSession}</td>
                        <td className="py-3 px-4"><div className="flex items-center space-x-2"><button className="p-1 text-gray-400 hover:text-sage-600"><Eye className="w-4 h-4" /></button><button className="p-1 text-gray-400 hover:text-sage-600"><Edit className="w-4 h-4" /></button><button className="p-1 text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* AI Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-semibold text-charcoal">AI Prescription Analysis</h2><button onClick={triggerFileSelect} className="flex items-center space-x-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors"><Camera className="w-4 h-4" /><span>Scan Prescription</span></button></div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              {!previewUrl ? (
                <div onClick={triggerFileSelect} className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-sage-500 hover:bg-sage-50 transition-colors">
                  <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-medium text-charcoal mb-2">Upload Handwritten Prescription</h3><p className="text-gray-600 mb-4">Our AI will analyze and convert it to a structured treatment plan</p><button className="bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-800 pointer-events-none">Choose File or Take Photo</button>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-lg font-medium text-charcoal mb-4">Prescription Preview</h3>
                  <div className="relative inline-block"><img src={previewUrl} alt="Prescription preview" className="max-h-80 rounded-lg shadow-md mx-auto" /><button onClick={() => { setPreviewUrl(null); setSelectedFile(null); }} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg hover:bg-red-100"><X className="w-5 h-5 text-red-500" /></button></div>
                  <div className="mt-6"><button onClick={handleAnalyzePrescription} disabled={isLoading} className="bg-sage-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sage-700 disabled:bg-sage-400 disabled:cursor-wait flex items-center justify-center mx-auto">{isLoading ? ( <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyzing...</> ) : "Analyze Prescription"}</button></div>
                </div>
              )}
               {error && <p className="text-red-600 text-center mt-4 font-medium bg-red-50 p-3 rounded-lg">{error}</p>}
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Recent AI Analysis</h3>
              <div className="space-y-4">
                {recentAnalyses.map((analysis, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                    <div className="flex justify-between items-start mb-3"><div><h4 className="font-medium text-charcoal">Patient: {analysis.patientName} {analysis.patientAge && `(Age: ${analysis.patientAge})`}</h4><p className="text-sm text-gray-600">Analyzed: {analysis.analyzedAt}</p></div><span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">{analysis.accuracy}% Accuracy</span></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div><h5 className="text-sm font-medium text-gray-700 mb-2">AI Interpretation (Therapies):</h5><ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">{analysis.therapies.map((therapy, i) => ( <li key={i}>{therapy.name} {therapy.duration && `- ${therapy.duration}`}</li> ))}</ul></div>
                      <div><h5 className="text-sm font-medium text-gray-700 mb-2">Dosage & Timing:</h5><ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">{analysis.dosageAndTiming.map((timing, i) => ( <li key={i}><strong>{timing.period}:</strong> {timing.instruction}</li> ))}</ul></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-semibold text-charcoal">Smart Scheduling</h2><button className="flex items-center space-x-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors"><Plus className="w-4 h-4" /><span>New Appointment</span></button></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"><h3 className="text-lg font-semibold text-charcoal mb-4">Weekly Schedule</h3><div className="grid grid-cols-7 gap-2 mb-4">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ( <div key={day} className="text-center py-2 text-sm font-medium text-gray-600">{day}</div> ))}</div><div className="grid grid-cols-7 gap-2">{Array.from({ length: 35 }, (_, i) => ( <div key={i} className="aspect-square border border-gray-200 rounded p-1 text-xs"><div className="text-gray-600">{((i % 31) + 1)}</div>{i === 14 && ( <div className="bg-sage-100 text-sage-700 text-xs px-1 rounded mt-1">3 apt</div> )}{i === 15 && ( <div className="bg-teal-100 text-teal-700 text-xs px-1 rounded mt-1">2 apt</div> )}</div> ))}</div></div>
              <div className="bg-white rounded-xl shadow-sm p-6"><h3 className="text-lg font-semibold text-charcoal mb-4">Today's Appointments</h3><div className="space-y-3">{todaySchedule.map((appointment, index) => ( <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"><div className="flex-shrink-0"><Clock className="w-4 h-4 text-sage-600 mt-1" /></div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-charcoal">{appointment.time}</p><p className="text-sm text-gray-600">{appointment.patient}</p><p className="text-xs text-gray-500">{appointment.treatment}</p></div></div> ))}</div></div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default DoctorDashboard;
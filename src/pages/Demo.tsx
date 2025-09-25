import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, Building } from 'lucide-react';

const Demo: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: 'doctor',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle demo booking
    alert('Demo booking request submitted! We\'ll contact you within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-mint-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-charcoal mb-4">
            Schedule Your Personalized Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how AyurSutra can transform your Panchakarma practice with AI-powered 
            prescription analysis, smart scheduling, and comprehensive patient management.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Demo Benefits */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">
                What You'll Experience
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">Live AI Prescription Demo</h3>
                    <p className="text-gray-600">See our AI analyze handwritten prescriptions in real-time with 99% accuracy</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">Smart Scheduling Walkthrough</h3>
                    <p className="text-gray-600">Experience intelligent appointment scheduling based on Ayurvedic principles</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">Multi-User Dashboard Tour</h3>
                    <p className="text-gray-600">Explore separate dashboards for doctors, therapists, and patients</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">Progress Tracking & Analytics</h3>
                    <p className="text-gray-600">See how patient progress is visualized and tracked over time</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Demo Duration & Format</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-sage-600" />
                  <span className="text-gray-600">Duration: 30-45 minutes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-sage-600" />
                  <span className="text-gray-600">Available: Monday to Friday, 9 AM - 6 PM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-sage-600" />
                  <span className="text-gray-600">Format: Video call or in-person (Mumbai/Pune area)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-charcoal mb-2">
                    Your Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="therapist">Therapist</option>
                    <option value="center-owner">Center Owner</option>
                    <option value="administrator">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-charcoal mb-2">
                    Organization
                  </label>
                  <div className="relative">
                    <Building className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      placeholder="Clinic/Center name"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-charcoal mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    required
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  />
                </div>

                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-charcoal mb-2">
                    Preferred Time *
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    required
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-2">
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  placeholder="Tell us about your center, current challenges, or specific features you'd like to see..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-sage-600 to-teal-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:from-sage-700 hover:to-teal-700 hover:shadow-xl transition-all duration-300"
              >
                Schedule Demo
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>We'll confirm your demo within 2 hours</p>
              <p className="mt-1">Questions? Email us at <a href="mailto:demo@ayursutra.com" className="text-sage-600 hover:underline">demo@ayursutra.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
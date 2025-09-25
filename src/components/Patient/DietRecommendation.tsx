import React, { useState } from 'react';
import { Brain, Clock, Camera, ChefHat, Leaf, Heart, Star, Eye } from 'lucide-react';

interface MealPlan {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  time: string;
  title: string;
  description: string;
  whyItHelps: string;
  keyIngredients: string[];
  doshaBenefit: string;
  calories?: number;
}

interface DietRecommendationProps {
  patientDosha: string;
  upcomingTreatment?: string;
  recentFeedback?: {
    digestion: number;
    energy: number;
  };
}

const DietRecommendation: React.FC<DietRecommendationProps> = ({ 
  patientDosha, 
  upcomingTreatment,
  recentFeedback 
}) => {
  const [selectedMeal, setSelectedMeal] = useState<MealPlan | null>(null);
  const [loggedMeals, setLoggedMeals] = useState<string[]>([]);

  // AI-generated meal plans based on patient data
  const todaysMealPlan: MealPlan[] = [
    {
      id: 'breakfast',
      type: 'breakfast',
      time: '8:00 AM',
      title: 'Warm Spiced Oatmeal',
      description: 'Creamy oats cooked with warming spices and topped with ghee',
      whyItHelps: 'This warm and grounding meal pacifies Vata, providing steady energy without weighing down your digestion.',
      keyIngredients: ['Oats', 'Cinnamon', 'Cardamom', 'Ghee', 'Almonds'],
      doshaBenefit: 'Vata Pacifying',
      calories: 320
    },
    {
      id: 'lunch',
      type: 'lunch',
      time: '12:30 PM',
      title: 'Moong Dal Kitchari with Steamed Vegetables',
      description: 'Traditional healing meal with yellow lentils, rice, and seasonal vegetables',
      whyItHelps: 'Kitchari is nourishing and easy to digest, making it the perfect food to support your body\'s cleansing process today.',
      keyIngredients: ['Moong Dal', 'Basmati Rice', 'Turmeric', 'Ginger', 'Seasonal Vegetables'],
      doshaBenefit: 'Tri-Doshic Balance',
      calories: 450
    },
    {
      id: 'dinner',
      type: 'dinner',
      time: '6:30 PM',
      title: 'Light Vegetable Soup',
      description: 'Warming broth with easily digestible vegetables and healing herbs',
      whyItHelps: 'A light dinner allows your digestive system to rest and repair overnight, crucial for reducing Ama (toxins).',
      keyIngredients: ['Seasonal Vegetables', 'Vegetable Broth', 'Cumin', 'Coriander', 'Fresh Herbs'],
      doshaBenefit: 'Kapha Reducing',
      calories: 180
    }
  ];

  const handleLogMeal = (mealId: string) => {
    setLoggedMeals(prev => [...prev, mealId]);
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      default: return '🍽️';
    }
  };

  const getDoshaColor = (benefit: string) => {
    if (benefit.includes('Vata')) return 'text-blue-600 bg-blue-50';
    if (benefit.includes('Pitta')) return 'text-red-600 bg-red-50';
    if (benefit.includes('Kapha')) return 'text-green-600 bg-green-50';
    return 'text-sage-600 bg-sage-50';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">
          Āhāra Prajñā – Your Intelligent Nourishment Guide
        </h2>
        <p className="text-gray-600">Today's personalized meal plan to support your healing</p>
      </div>

      {/* AI Brain - How It Works */}
      <div className="bg-gradient-to-br from-sage-50 to-beige-50 rounded-xl p-6 border border-sage-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-sage-600 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-charcoal">How Your AI Nutritionist Works</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-charcoal">Analyzes Your Constitution</h4>
              <p className="text-sm text-gray-600">Considers your {patientDosha} dosha for personalized recommendations</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-charcoal">Checks Therapy Schedule</h4>
              <p className="text-sm text-gray-600">
                {upcomingTreatment 
                  ? `Adapts for your ${upcomingTreatment} session` 
                  : 'Optimizes for your current treatment phase'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-charcoal">Learns from Feedback</h4>
              <p className="text-sm text-gray-600">
                {recentFeedback 
                  ? `Adjusts based on your digestion comfort (${recentFeedback.digestion}/10)`
                  : 'Incorporates your session feedback'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Meal Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {todaysMealPlan.map((meal) => (
          <div key={meal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Card Header */}
            <div className="p-4 bg-gradient-to-r from-sage-50 to-beige-50 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getMealIcon(meal.type)}</span>
                  <h3 className="font-semibold text-charcoal capitalize">{meal.type}</h3>
                </div>
                <span className="text-sm text-gray-600">{meal.time}</span>
              </div>
              <h4 className="text-lg font-serif font-bold text-charcoal">{meal.title}</h4>
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-4">
              <p className="text-gray-700">{meal.description}</p>
              
              {/* Why This Helps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h5 className="text-sm font-medium text-blue-900 mb-1">Why this helps:</h5>
                <p className="text-sm text-blue-800">{meal.whyItHelps}</p>
              </div>

              {/* Key Ingredients */}
              <div>
                <h5 className="text-sm font-medium text-charcoal mb-2">Key Ingredients:</h5>
                <div className="flex flex-wrap gap-1">
                  {meal.keyIngredients.map((ingredient, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-sage-100 text-sage-700 text-xs rounded-full"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dosha Benefit & Calories */}
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDoshaColor(meal.doshaBenefit)}`}>
                  {meal.doshaBenefit}
                </span>
                {meal.calories && (
                  <span className="text-sm text-gray-600">{meal.calories} cal</span>
                )}
              </div>
            </div>

            {/* Card Actions */}
            <div className="p-4 border-t border-gray-100 space-y-2">
              <button
                onClick={() => setSelectedMeal(meal)}
                className="w-full flex items-center justify-center space-x-2 bg-sage-600 text-white py-2 px-4 rounded-lg hover:bg-sage-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View Recipe</span>
              </button>
              
              <button
                onClick={() => handleLogMeal(meal.id)}
                disabled={loggedMeals.includes(meal.id)}
                className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                  loggedMeals.includes(meal.id)
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{loggedMeals.includes(meal.id) ? 'Logged ✓' : 'Log Your Meal'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Food Diary Integration */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <ChefHat className="w-6 h-6 text-sage-600" />
          <h3 className="text-lg font-semibold text-charcoal">Your Food Journey Today</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {todaysMealPlan.map((meal) => (
            <div key={meal.id} className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${
                loggedMeals.includes(meal.id) 
                  ? 'bg-green-100 border-2 border-green-500' 
                  : 'bg-gray-100 border-2 border-gray-300'
              }`}>
                <span className="text-2xl">{getMealIcon(meal.type)}</span>
              </div>
              <div className="text-sm font-medium text-charcoal capitalize">{meal.type}</div>
              <div className="text-xs text-gray-600">{meal.time}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Track your meals to help our AI provide better recommendations
          </p>
          <button className="inline-flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
            <Camera className="w-5 h-5" />
            <span>Open AI Nutrition Coach</span>
          </button>
        </div>
      </div>

      {/* Recipe Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-charcoal">{selectedMeal.title}</h2>
                <button 
                  onClick={() => setSelectedMeal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mt-1">Complete recipe and preparation guide</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">Ingredients:</h3>
                  <ul className="space-y-1">
                    {selectedMeal.keyIngredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Leaf className="w-4 h-4 text-sage-600" />
                        <span className="text-gray-700">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">Preparation:</h3>
                  <div className="bg-sage-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      Detailed cooking instructions would be provided here based on the specific meal and Ayurvedic principles.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">Ayurvedic Benefits:</h3>
                  <p className="text-gray-700">{selectedMeal.whyItHelps}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietRecommendation;
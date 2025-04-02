import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Palette, User } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const styleOptions = [
  { id: 'casual', name: 'Casual', colors: ['#3b82f6', '#000000', '#6b7280'] },
  { id: 'formal', name: 'Formel', colors: ['#1e3a8a', '#18181b', '#4b5563'] },
  { id: 'sportif', name: 'Sportif', colors: ['#ef4444', '#000000', '#d1d5db'] },
  { id: 'boheme', name: 'Bohème', colors: ['#a16207', '#78350f', '#d97706'] },
  { id: 'streetwear', name: 'Streetwear', colors: ['#111827', '#9333ea', '#f59e0b'] },
  { id: 'minimaliste', name: 'Minimaliste', colors: ['#525252', '#171717', '#e5e5e5'] }
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0]);
  const [error, setError] = useState('');
  const { setUserData } = useUser();
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (step === 1) {
      if (!name.trim()) {
        setError('Veuillez entrer votre nom');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      // Complete onboarding
      setUserData({
        name,
        style: {
          style: selectedStyle.id,
          colors: selectedStyle.colors
        },
        lastVisit: null,
        visitCount: 1
      });
      navigate('/');
    }
  };

  const handleStyleSelect = (style: typeof styleOptions[0]) => {
    setSelectedStyle(style);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-800 mb-2">Bienvenue chez WeatherWear</h1>
            <p className="text-gray-600">Votre assistant vestimentaire personnel</p>
          </div>

          <div className="mb-6">
            <div className="flex mb-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i <= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {i}
                  </div>
                  {i < 2 && (
                    <div 
                      className={`h-1 w-16 mx-2 ${
                        i < step ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Comment dois-je vous appeler ?
                </h2>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pl-10"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Quel est votre style vestimentaire préféré ?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {styleOptions.map((style) => (
                    <div
                      key={style.id}
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedStyle.id === style.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                      onClick={() => handleStyleSelect(style)}
                    >
                      <div className="flex items-center">
                        <Palette className="text-gray-500 mr-2" size={16} />
                        <span>{style.name}</span>
                      </div>
                      <div className="flex mt-2 space-x-1">
                        {style.colors.map((color, index) => (
                          <div 
                            key={index} 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      {selectedStyle.id === style.id && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleNextStep}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center"
          >
            {step === 2 ? "Commencer" : "Suivant"}
            <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

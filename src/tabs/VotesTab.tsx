import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Heart, TrendingUp, Users, Calendar } from 'lucide-react';

// Initialisation de Supabase
const supabaseUrl = 'https://mtfjllluaevcuickhvns.supabase.co'; // Remplacez par votre URL Supabase
const supabaseKey = 'yutuytuytutyuyuyuyutuyu'; // Remplacez par votre clé API
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface pour les fonctionnalités
interface FeatureVote {
  id: string;
  title: string;
  description: string;
  realVotes: number; // Votes réels
  hasVoted: boolean;
  icon: 'ai' | 'virtual' | 'calendar';
}

const VotesTab = () => {
  const [features, setFeatures] = useState<FeatureVote[]>([
    {
      id: "ai-stylist",
      title: "Assistant IA de style personnel",
      description: "Une IA qui apprend votre style vestimentaire et discute avec vous en temps réel pour vous donner des conseils personnalisés.",
      realVotes: 0,
      hasVoted: false,
      icon: 'ai',
    },
    {
      id: "virtual-try-on",
      title: "Essayage virtuel",
      description: "Essayez virtuellement les vêtements avant de les acheter grâce à la réalité augmentée.",
      realVotes: 0,
      hasVoted: false,
      icon: 'virtual',
    },
    {
      id: "outfit-calendar",
      title: "Calendrier de tenues",
      description: "Planifiez vos tenues à l'avance et recevez des rappels quotidiens de ce que vous avez prévu de porter.",
      realVotes: 0,
      hasVoted: false,
      icon: 'calendar',
    },
  ]);

  const [isAnimating, setIsAnimating] = useState<string | null>(null);

  // Charger les votes réels depuis Supabase
  useEffect(() => {
    const fetchVotes = async () => {
      const { data, error } = await supabase
        .from('votes')
        .select('feature_id, count(*) as votes')
        .group('feature_id');

      if (error) {
        console.error("Erreur lors du chargement des votes :", error);
        return;
      }

      setFeatures((prevFeatures) =>
        prevFeatures.map((feature) => {
          const realVotes = data.find((vote: any) => vote.feature_id === feature.id)?.votes || 0;
          return { ...feature, realVotes };
        })
      );
    };

    fetchVotes();
  }, []);

  // Gestion du vote
  const handleVote = useCallback(async (featureId: string) => {
    const feature = features.find((f) => f.id === featureId);

    if (!feature || feature.hasVoted) return;

    // Ajouter le vote dans Supabase
    const { error } = await supabase.from('votes').insert([
      { feature_id: featureId, user_id: 'unique-user-id' }
    ]);

    if (error) {
      console.error("Erreur lors de l'enregistrement du vote :", error);
      return;
    }

    // Mettre à jour l'état local
    setFeatures((prevFeatures) =>
      prevFeatures.map((f) =>
        f.id === featureId
          ? { ...f, realVotes: f.realVotes + 1, hasVoted: true }
          : f
      )
    );

    // Animation de vote
    setIsAnimating(featureId);
    setTimeout(() => setIsAnimating(null), 1000);
  }, [features]);

  // Calculer le pourcentage pour la barre de progression
  const calculatePercentage = (realVotes: number) => {
    const goal = 1000; // Objectif de votes
    return Math.min(Math.round((realVotes / goal) * 100), 100);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50">
      {/* Introduction */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">Votez pour nos prochaines fonctionnalités 🚀</h2>
        <p className="text-gray-700 text-sm">
          Aidez-nous à prioriser les fonctionnalités que vous souhaitez voir en premier. Cliquez sur le cœur pour voter !
        </p>
      </div>

      {/* Liste des fonctionnalités */}
      <div className="space-y-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`bg-white shadow-lg rounded-lg p-4 border border-gray-200 transition-transform ${
              isAnimating === feature.id ? 'scale-105' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-gray-100 rounded-full">
                  {feature.icon === 'ai' && <TrendingUp size={20} className="text-purple-500" />}
                  {feature.icon === 'virtual' && <Users size={20} className="text-blue-500" />}
                  {feature.icon === 'calendar' && <Calendar size={20} className="text-green-500" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleVote(feature.id)}
                disabled={feature.hasVoted}
                className={`p-3 rounded-full transition-all ${
                  feature.hasVoted
                    ? 'bg-pink-100 text-pink-500'
                    : 'bg-gray-100 text-gray-400 hover:bg-pink-50 hover:text-pink-400'
                }`}
                aria-label={`Voter pour ${feature.title}`}
              >
                <Heart size={24} className={feature.hasVoted ? 'fill-pink-500' : ''} />
              </button>
            </div>

            {/* Barre de progression */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {calculatePercentage(feature.realVotes)}% des votes
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {feature.realVotes} votes
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${calculatePercentage(feature.realVotes)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotesTab;
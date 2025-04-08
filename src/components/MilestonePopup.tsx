import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Définir le type pour les jalons
interface Milestone {
  day: number;
  message: string;
}

const milestones: Milestone[] = [
  { day: 1, message: "Bienvenue dans l'univers WeatherWear ! Cela fait 1 jour que vous êtes avec nous." },
  { day: 3, message: "Cela fait 3 jours que vous explorez WeatherWear ! Merci de votre fidélité." },
  { day: 7, message: "7 jours avec WeatherWear ! Vous êtes un utilisateur fidèle, merci !" },
  { day: 14, message: "14 jours avec WeatherWear ! Vous êtes un expert de notre univers." },
  { day: 30, message: "30 jours avec WeatherWear ! Vous êtes une légende. Merci infiniment !" },
];

const MilestonePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    const firstVisitDate = localStorage.getItem('firstVisitDate');
    const today = new Date().toISOString().split('T')[0];

    if (!firstVisitDate) {
      // Enregistrer la date de la première visite
      localStorage.setItem('firstVisitDate', today);
    } else {
      // Calculer le nombre de jours écoulés depuis la première visite
      const daysElapsed = Math.floor(
        (new Date(today).getTime() - new Date(firstVisitDate).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Vérifier si un jalon doit être affiché et n'a pas encore été vu
      const milestone = milestones.find((m) => m.day === daysElapsed);
      const seenMilestones = JSON.parse(localStorage.getItem('seenMilestones') || '[]');

      if (milestone && !seenMilestones.includes(milestone.day)) {
        setCurrentMilestone(milestone); // Affecter le jalon trouvé
        setShowPopup(true);
      }
    }
  }, []);

  const handleClose = () => {
    if (currentMilestone) {
      // Ajouter le jalon actuel à la liste des jalons vus
      const seenMilestones = JSON.parse(localStorage.getItem('seenMilestones') || '[]');
      seenMilestones.push(currentMilestone.day);
      localStorage.setItem('seenMilestones', JSON.stringify(seenMilestones));
    }
    setShowPopup(false);
  };

  if (!showPopup || !currentMilestone) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full text-center relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full p-1"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-300 mb-4">
          🎉 Félicitations !
        </h2>
        <p className="text-gray-700 dark:text-gray-300">{currentMilestone.message}</p>
      </div>
    </div>
  );
};

export default MilestonePopup;
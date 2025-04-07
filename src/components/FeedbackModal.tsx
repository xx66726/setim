import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { MessageSquare, Star, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

// Initialize emailjs with your user ID
// emailjs.init("user_your_emailjs_userid"); // Replace with your actual EmailJS user ID

// Ensure modal accessibility by setting the app element
ReactModal.setAppElement('#root');

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  const { userData } = useUser();
  const { language } = useLanguage();
  const { theme } = useTheme();

  // Fill in user name from stored data
  useEffect(() => {
    if (userData && userData.name) {
      setName(userData.name);
    }
  }, [userData]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Using a mailto link approach for simplicity
      // In a real app, you'd use EmailJS or a backend API
      const mailtoLink = `mailto:26corporate6@gmail.com?subject=WeatherWear Feedback from ${name}&body=Rating: ${rating}/5 stars%0D%0A%0D%0AFeedback: ${encodeURIComponent(feedback)}`;
      
      window.open(mailtoLink);
      
      // Alternatively, with EmailJS (requires actual EmailJS account setup):
      /*
      const templateParams = {
        from_name: name,
        rating: rating,
        message: feedback,
        reply_to: "no-reply@weatherwear.app"
      };
      
      await emailjs.send(
        'YOUR_SERVICE_ID',  // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        templateParams
      );
      */
      
      setSuccess(true);
      // Reset form
      setFeedback('');
      // Close modal after 2 seconds of showing success message
      setTimeout(() => {
        onClose();
        // Reset success state after closing
        setTimeout(() => setSuccess(false), 500);
      }, 2000);
    } catch (err) {
      console.error('Error sending feedback:', err);
      setError(language === 'fr' 
        ? 'Erreur lors de l\'envoi. Veuillez réessayer.'
        : 'Error sending feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Feedback Form"
      className="fixed bottom-6 right-6 max-w-md p-0 bg-transparent border-0 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-end sm:justify-center z-50 pr-4 pb-4 sm:p-0"
      closeTimeoutMS={300}
      style={{
        overlay: {
          backdropFilter: 'blur(4px)',
          transition: 'opacity 300ms ease-in-out'
        },
        content: {
          transform: 'translateY(0)',
          transition: 'transform 300ms ease-in-out',
        }
      }}
    >
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all transform max-w-md w-full ${isOpen ? 'animate-slide-up' : 'animate-slide-down'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {language === 'fr' ? 'Votre avis nous intéresse' : 'We value your feedback'}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {success ? (
            <div className="py-8 text-center">
              <div className="mb-5 flex justify-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {language === 'fr' ? 'Merci pour votre avis!' : 'Thank you for your feedback!'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {language === 'fr' 
                  ? 'Votre commentaire nous aide à améliorer WeatherWear.'
                  : 'Your feedback helps us improve WeatherWear.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'fr' ? 'Votre nom' : 'Your name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                  required
                  placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {language === 'fr' ? 'Note' : 'Rating'}
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="focus:outline-none p-1 transition-transform transform hover:scale-110"
                    >
                      <Star
                        size={30}
                        fill={(hoverRating !== null ? star <= hoverRating : star <= rating) ? '#f59e0b' : 'none'}
                        stroke={(hoverRating !== null ? star <= hoverRating : star <= rating) ? '#f59e0b' : '#9ca3af'}
                        className="transition-colors"
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {rating}/5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'fr' ? 'Commentaires' : 'Comments'}
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                  placeholder={language === 'fr' 
                    ? 'Partagez votre expérience avec WeatherWear...' 
                    : 'Share your experience with WeatherWear...'}
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-md text-red-600 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 transition-colors"
                >
                  {language === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50 transition-colors"
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {language === 'fr' ? 'Envoi...' : 'Sending...'}
                    </div>
                  ) : (
                    language === 'fr' ? 'Envoyer' : 'Submit'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ReactModal>
  );
};

export default FeedbackModal;

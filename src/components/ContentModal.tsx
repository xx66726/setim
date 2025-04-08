import { useState, useEffect, useCallback, memo } from 'react';
import Modal from 'react-modal';
import { Info, X } from 'lucide-react';
import InfoTab from '../tabs/InfoTab'; // Assurez-vous que le fichier existe
// Ensure Modal is accessible
Modal.setAppElement('#root');

interface ContentModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const MemoizedInfoTab = memo(InfoTab);

const ContentModal = ({ isOpen, onRequestClose }: ContentModalProps) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window size for responsive layout with debounce for performance
  useEffect(() => {
    let timeoutId: number;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 100); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
      contentLabel="Contenu"
      closeTimeoutMS={300}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-4xl h-[90vh] sm:h-[80vh] p-4 sm:p-6 relative flex flex-col">
        {/* Bouton de fermeture */}
        <button
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-1 rounded-full hover:bg-gray-100"
          aria-label="Fermer"
        >
          <X size={24} />
        </button>

        {/* Contenu de l'onglet Info */}
        <div className="flex-grow overflow-auto pb-2">
          <MemoizedInfoTab />
        </div>
      </div>
    </Modal>
  );
};

export default ContentModal;
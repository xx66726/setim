import { useState } from 'react';
import Modal from 'react-modal';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Facebook, Instagram, Send, Twitter, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext'; // Importer le contexte de langue

// Assurez-vous que React Modal est configuré
Modal.setAppElement('#root');

const ShareButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const { t } = useLanguage(); // Utiliser le contexte de langue

  const appUrl = window.location.href; // URL actuelle de l'application
  const shareText = `${t('shareApp')} ${appUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopySuccess(t('linkCopied'));
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess(t('copyFailed'));
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const shareOnInstagram = () => {
    handleCopy();
    alert(t('linkCopied') + ' ' + t('shareOnInstagram'));
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
        aria-label={t('shareApp')}
      >
        <Send size={24} />
      </button>

      {/* Modal de partage */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        contentLabel={t('shareApp')}
      >
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-indigo-800 mb-6">{t('shareApp')}</h2>

          <div className="flex flex-col items-center mb-6">
            <div className="bg-white p-3 rounded-lg shadow-md mb-3">
              <QRCodeSVG value={appUrl} size={180} />
            </div>
            <p className="text-gray-600 text-sm text-center">
              {t('scanQRCode')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              aria-label="Partager sur WhatsApp"
            >
              <Send size={20} />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={shareOnInstagram}
              className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
              aria-label="Partager sur Instagram"
            >
              <Instagram size={20} />
              <span>Instagram</span>
            </button>

            <button
              onClick={shareOnFacebook}
              className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Partager sur Facebook"
            >
              <Facebook size={20} />
              <span>Facebook</span>
            </button>

            <button
              onClick={shareOnTwitter}
              className="flex items-center justify-center gap-2 p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
              aria-label="Partager sur Twitter"
            >
              <Twitter size={20} />
              <span>Twitter</span>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 w-full p-3 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition-colors"
              aria-label={t('copyLink')}
            >
              <Copy size={20} />
              <span>{copySuccess || t('copyLink')}</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ShareButton;
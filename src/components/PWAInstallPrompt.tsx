import { useEffect, useState } from 'react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si l'application est déjà installée
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    checkIfInstalled();

    // Écouter l'événement 'appinstalled'
    const handleAppInstalled = () => {
      console.log('L\'application a été installée.');
      setIsInstalled(true);
      setShowPrompt(false); // Masquer la pop-up si elle est affichée
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Gérer l'événement 'beforeinstallprompt'
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Afficher la pop-up si l'application n'est pas installée
      if (!isInstalled) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 2 * 60 * 1000); // 2 minutes
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isInstalled]);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Affiche la boîte de dialogue d'installation native
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('L\'utilisateur a accepté l\'installation de la PWA.');
        } else {
          console.log('L\'utilisateur a refusé l\'installation de la PWA.');
        }
        setDeferredPrompt(null);
        setShowPrompt(false);
      });
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  return (
    !isInstalled &&
    showPrompt && (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#4f46e5',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
        }}
      >
        <p style={{ margin: 0, fontSize: '16px' }}>Installez notre application pour une meilleure expérience !</p>
        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={handleInstallClick}
            style={{
              backgroundColor: 'white',
              color: '#4f46e5',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Installer
          </button>
          <button
            onClick={handleClose}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    )
  );
};

export default PWAInstallPrompt;
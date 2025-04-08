import { useEffect, useState } from 'react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est sur iOS
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsIOSDevice(isIOS);

    // Afficher la bannière pour iOS si l'utilisateur est sur iOS
    if (isIOS) {
      setTimeout(() => {
        setShowIOSPrompt(true);
      }, 2000); // Afficher après 2 secondes
    }

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

  const handleCloseIOSPrompt = () => {
    setShowIOSPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  return (
    <>
      {/* Bannière pour iOS */}
      {isIOSDevice && showIOSPrompt && (
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
            maxWidth: '90%',
          }}
        >
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
            📱 Ajouter WeatherWear à votre écran d'accueil
          </p>
          <p style={{ margin: '8px 0', fontSize: '14px' }}>
            1. Naviguez vers la barre d'adresse du site où se trouve l'URL.<br />
            2. Appuyez sur l'icône <strong>Partager</strong> (le carré avec une flèche vers le haut).<br />
            3. Dans le menu qui s'ouvre, faites défiler et appuyez sur <strong>Ajouter à l'écran d'accueil</strong>.<br />
            4. Enfin, cliquez sur <strong>Ajouter</strong>.
          </p>
          <button
            onClick={handleCloseIOSPrompt}
            style={{
              marginTop: '8px',
              backgroundColor: 'white',
              color: '#4f46e5',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Fermer
          </button>
        </div>
      )}

      {/* Bannière pour Android ou autres navigateurs */}
      {!isInstalled &&
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
        )}
    </>
  );
};

export default PWAInstallPrompt;
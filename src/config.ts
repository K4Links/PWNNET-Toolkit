export const getBackendUrl = () => {
  // @ts-ignore
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (envUrl) return envUrl;

  // Detect if running inside a mobile WebView (APK build)
  const isMobileApp = /android|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
  const isLocalOrigin = window.location.protocol === 'file:' || window.location.protocol === 'capacitor:' || window.location.hostname === 'localhost';

  // If the app is bundled as an APK and loaded locally on the phone, local paths won't work 
  // because the Express backend does not run on the phone. Fallback to the live backend URL.
  if (isLocalOrigin && (isMobileApp || window.location.protocol === 'file:')) {
     return 'https://pwnnet-backend.onrender.com';
  }

  // Use relative path for web deployments where frontend and backend are hosted together
  return '';
};

// gatsby-browser.js - Wrap root element with providers
import React from 'react';
import { AuthProvider } from './src/hooks/useAuth';
import GlobalStyle from './src/styles/GlobalStyle';

// Wrap root element with providers
export const wrapRootElement = ({ element }) => {
  return (
    <AuthProvider>
      <GlobalStyle />
      {element}
    </AuthProvider>
  );
};

// Handle service worker
export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    'This application has been updated. Reload to display the latest version?'
  );
  if (answer === true) {
    window.location.reload();
  }
};

// Handle route updates for SPA navigation
export const onRouteUpdate = ({ location, prevLocation }) => {
  // Add any analytics or tracking here
  if (typeof window !== 'undefined') {
    // Example: Google Analytics page tracking
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }
};

// Handle client-side routing
export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  // Don't scroll to top on bot page navigation
  if (location.pathname.includes('/financial-analyzer')) {
    return false;
  }
  return true;
};
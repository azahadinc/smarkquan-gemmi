import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for "Cannot set property fetch of #<Window> which has only a getter"
// Some libraries try to polyfill fetch and fail if it's read-only.
if (typeof window !== 'undefined') {
  try {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (descriptor && !descriptor.writable && descriptor.configurable) {
      Object.defineProperty(window, 'fetch', {
        writable: true,
        configurable: true,
        enumerable: true,
        value: window.fetch
      });
    }
  } catch (e) {
    console.warn('Failed to make window.fetch writable:', e);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

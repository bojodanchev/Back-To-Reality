// Build script to create Vercel Analytics for static HTML
// Creates a standalone script that works without bundlers
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a standalone script that initializes Vercel Analytics
// This replicates what @vercel/analytics inject() does, but works in static HTML
const analyticsScript = `// Vercel Analytics for static HTML sites
// This script initializes Vercel Web Analytics using the same approach as @vercel/analytics
(function() {
  if (typeof window === 'undefined') return;
  
  // Initialize analytics queue (same as @vercel/analytics)
  window.va = window.va || function() {
    (window.vaq = window.vaq || []).push(arguments);
  };
  
  // Detect environment
  function isDevelopment() {
    try {
      return window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' ||
             window.location.hostname.includes('.local');
    } catch {
      return false;
    }
  }
  
  // Get script source (matches @vercel/analytics logic)
  function getScriptSrc() {
    if (isDevelopment()) {
      return 'https://va.vercel-scripts.com/v1/script.debug.js';
    }
    return '/_vercel/insights/script.js';
  }
  
  const scriptSrc = getScriptSrc();
  
  // Check if script is already loaded
  if (document.head.querySelector('script[src*="script.js"]')) return;
  
  // Create and inject script (matches @vercel/analytics inject() function)
  const script = document.createElement('script');
  script.src = scriptSrc;
  script.defer = true;
  script.dataset.sdkn = '@vercel/analytics';
  script.dataset.sdkv = '1.5.0';
  
  script.onerror = function() {
    const errorMessage = isDevelopment() 
      ? 'Please check if any ad blockers are enabled and try again.'
      : 'Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.';
    console.log('[Vercel Web Analytics] Failed to load script from ' + scriptSrc + '. ' + errorMessage);
  };
  
  document.head.appendChild(script);
})();
`;

writeFileSync(join(__dirname, 'vercel-analytics.js'), analyticsScript);
console.log('✓ Vercel Analytics script generated');


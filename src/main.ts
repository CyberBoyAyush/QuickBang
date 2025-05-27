import { bangs } from "../bang";
import "./global.css";

// Define type for search engines
interface SearchEngine {
  shortcut: string; 
  domain: string;
  searchUrl: string;
}

// Avoid circular dependency - import webui functions only when needed
let webuiFunctions: any = null;

const getWebUIFunctions = async () => {
  if (!webuiFunctions) {
    const webui = await import('./webui');
    webuiFunctions = webui;
  }
  return webuiFunctions;
};

// Custom bang manager (moved from webui to avoid circular dependency)
const customBangManager = {
  getCustomBangs: (): SearchEngine[] => {
    try {
      const saved = localStorage.getItem("custom-bangs");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load custom bangs:", error);
      return [];
    }
  },

  saveCustomBangs: (bangs: SearchEngine[]): void => {
    try {
      localStorage.setItem("custom-bangs", JSON.stringify(bangs));
      sessionStorage.setItem('refresh-bangs-cache', 'true');
      buildSearchEngineMap(); // Refresh immediately
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Failed to save custom bangs:", error);
    }
  }
};

// Create a map for O(1) search engine lookup
const searchEngineMap = new Map<string, SearchEngine>();

// Function to build the search engine map
const buildSearchEngineMap = () => {
  searchEngineMap.clear();
  
  // First add standard bangs
  bangs.forEach(engine => {
    searchEngineMap.set(engine.t, { 
      shortcut: engine.t, 
      domain: engine.d, 
      searchUrl: engine.u 
    });
  });
  
  // Then override with custom bangs
  const userDefinedEngines = customBangManager.getCustomBangs();
  userDefinedEngines.forEach(engine => {
    searchEngineMap.set(engine.shortcut, engine);
  });
};

// Initialize the engine map
buildSearchEngineMap();

// Create a function to update the fallback engine
const updateFallbackEngine = () => {
  const engineKey = localStorage.getItem("default-bang") ?? "brave";
  return searchEngineMap.get(engineKey);
};

// Initialize with current default
let fallbackEngine = updateFallbackEngine();

// Function to get search engine (with proper fallback handling)
const getSearchEngine = (engineKey?: string) => {
  if (!engineKey) return fallbackEngine;
  return searchEngineMap.get(engineKey) || fallbackEngine;
};

// Add window event listener for storage changes
window.addEventListener('storage', (event) => {
  if (event.key === 'custom-bangs') {
    buildSearchEngineMap();
  }
  
  if (event.key === 'default-bang') {
    fallbackEngine = updateFallbackEngine();
  }
});

// Check for refresh cache flag
const checkRefreshCacheFlag = () => {
  const refreshCacheFlag = sessionStorage.getItem('refresh-bangs-cache');
  if (refreshCacheFlag) {
    sessionStorage.removeItem('refresh-bangs-cache');
    sessionStorage.setItem('custom-bang-updated', 'true');
    buildSearchEngineMap();
  }
};

function constructRedirectUrl() {
  checkRefreshCacheFlag();
  
  const currentUrl = new URL(window.location.href);
  
  // Check for UI page parameters first
  const page = currentUrl.searchParams.get('page');
  if (page) {
    handleUIRouting();
    return null;
  }
  
  const searchQuery = currentUrl.searchParams.get("q")?.trim() ?? "";
  if (!searchQuery) {
    handleUIRouting();
    return null;
  }

  // Detect search engine triggers (! or :)
  const triggerPattern = searchQuery.match(/([!:])(\S+)/i);
  
  // O(1) lookup with proper fallback
  const engineKeyword = triggerPattern?.[2]?.toLowerCase();
  const targetEngine = getSearchEngine(engineKeyword);

  // Extract actual search terms by removing the trigger
  const searchTerms = searchQuery.replace(/([!:])\S+\s*/i, "").trim();

  // Navigate to domain if no search terms provided
  if (searchTerms === "")
    return targetEngine ? `https://${targetEngine.domain}` : null;

  // Build search URL with encoded query
  const finalUrl = targetEngine?.searchUrl.replace(
    "{{{s}}}",
    encodeURIComponent(searchTerms).replace(/%2F/g, "/")
  );
  
  return finalUrl || null;
}

// Handle UI routing without circular dependency
async function handleUIRouting() {
  try {
    const webui = await getWebUIFunctions();
    webui.handleRouting();
  } catch (error) {
    console.error("Error loading webui:", error);
    // Fallback - render a simple home page
    renderFallbackHomePage();
  }
}

// Simple fallback home page if webui fails to load
function renderFallbackHomePage() {
  const appContainer = document.querySelector<HTMLDivElement>("#app")!;
  appContainer.innerHTML = `
    <div style="text-align: center; padding: 2rem; font-family: system-ui, -apple-system, sans-serif; max-width: 500px; margin: 0 auto;">
      <img src="/favicon.svg" alt="QuickBang logo" style="width: 60px; height: 60px; margin-bottom: 1rem;" />
      <h1 style="font-size: 1.75rem; font-weight: 600; margin-bottom: 1rem;">QuickBang</h1>
      <p style="margin-bottom: 1.5rem; color: #6b7280;">Loading interface...</p>
      <button style="background-color: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; cursor: pointer;" onclick="window.location.reload()">Retry</button>
    </div>
  `;
}

function executeRedirection() {
  const redirectUrl = constructRedirectUrl();
  if (!redirectUrl) return;
  window.location.replace(redirectUrl);
}

// Check if we need to apply settings changes immediately
const applySettingsChanges = () => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Handle setting default engine via URL parameter
  const setDefaultEngine = urlParams.get('set-default');
  if (setDefaultEngine) {
    localStorage.setItem('default-bang', setDefaultEngine);
    fallbackEngine = updateFallbackEngine();
    sessionStorage.setItem('default-engine-changed', 'true');
    
    urlParams.delete('set-default');
    const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
    window.location.replace(newUrl);
    return;
  }
  
  // Check for page routing before redirection
  const page = urlParams.get('page');
  if (page) {
    handleUIRouting();
    return;
  }
  
  executeRedirection();
};

// Export functions for webui
export const mainFunctions = {
  refreshEngines: buildSearchEngineMap,
  getCurrentDefaultEngine: () => localStorage.getItem('default-bang') || 'brave',
  customBangManager
};

// Make functions available globally
// @ts-ignore
window.mainFunctions = mainFunctions;

// Start the application
applySettingsChanges();

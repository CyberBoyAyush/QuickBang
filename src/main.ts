import { bangs } from "../bang";
import "./global.css";

// Define type for search engines
interface SearchEngine {
  shortcut: string; // trigger keyword
  domain: string; // website domain
  searchUrl: string; // url template for searches
}

// Retrieve user-defined search engines from browser storage
const fetchUserSearchEngines = (): SearchEngine[] => {
  try {
    const savedEngines = localStorage.getItem("custom-bangs");
    
    // Check if we're coming from a custom bang update
    const refreshCacheFlag = sessionStorage.getItem('refresh-bangs-cache');
    if (refreshCacheFlag) {
      // Clear the flag
      sessionStorage.removeItem('refresh-bangs-cache');
      // Set notification flag for next page load
      sessionStorage.setItem('custom-bang-updated', 'true');
    }
    
    return savedEngines ? JSON.parse(savedEngines) : [];
  } catch (error) {
    console.error("Failed to load user search engines:", error);
    return [];
  }
};

function renderHomePage() {
  const appContainer = document.querySelector<HTMLDivElement>("#app")!;
  appContainer.innerHTML = `
    <div class="app-container">
      <div class="content-container">
        <div class="hero-section">
          <div class="logo-container">
            <img src="/favicon.svg" alt="QuickBang logo" class="logo-icon" />
            <h1>QuickBang</h1>
          </div>
          <p class="tagline">Lightning-fast search shortcuts with all DuckDuckGo bangs</p>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2>Quick Setup</h2>
          </div>
          <div class="card-body">
            <p>Add the following URL as a custom search engine to your browser for instant access to <a href="https://duckduckgo.com/bang.html" target="_blank">all DuckDuckGo bangs</a> with improved speed.</p>
            
            <div class="url-container"> 
              <input 
                type="text" 
                class="url-input"
                value="https://quickbang.vercel.app/?q=%s"
                readonly 
              />
              <button class="copy-button tooltip" data-tooltip="Copy to clipboard">
                <img src="/clipboard.svg" alt="Copy" />
              </button>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2>Popular Bangs</h2>
          </div>
          <div class="card-body">
            <ul class="feature-list">
              <li>
                <div class="feature-icon">🔍</div>
                <div class="feature-content">
                  <span class="shortcut">!g quantum computing</span> - Search Google
                </div>
              </li>
              <li>
                <div class="feature-icon">🤖</div>
                <div class="feature-content">
                  <span class="shortcut">!p how do black holes work</span> - Search Perplexity AI
                </div>
              </li>
              <li>
                <div class="feature-icon">💬</div>
                <div class="feature-content">
                  <span class="shortcut">!c javascript tips</span> - Search ChatGPT
                </div>
              </li>
              <li>
                <div class="feature-icon">📺</div>
                <div class="feature-content">
                  <span class="shortcut">!yt beginner coding tutorial</span> - Search YouTube
                </div>
              </li>
              <li>
                <div class="feature-icon">🖼️</div>
                <div class="feature-content">
                  <span class="shortcut">!gi northern lights</span> - Search Google Images
                </div>
              </li>
              <li>
                <div class="feature-icon">💻</div>
                <div class="feature-content">
                  <span class="shortcut">!gh react hooks</span> - Search GitHub
                </div>
              </li>
              <li>
                <div class="feature-icon">📂</div>
                <div class="feature-content">
                  <span class="shortcut">!ghr cyberboyayush/quickbang</span> - Go directly to GitHub repository
                </div>
              </li>
            </ul>
            
            <div class="note">
              <p><strong>Change Default Engine:</strong> Select a new default search engine:</p>
              <div class="default-engine-selector">
                <select id="default-engine-select">
                  <option value="brave" selected>Brave</option>
                  <option value="g">Google</option>
                  <option value="p">Perplexity</option>
                  <option value="c">ChatGPT</option>
                  <option value="yt">YouTube</option>
                  <option value="gi">Google Images</option>
                  <option value="gh">GitHub</option>
                </select>
                <button id="set-default-engine" class="set-default-button">Set Default</button>
              </div>
              <p class="examples">Current default: <code id="current-default-engine">brave</code></p>
            </div>
            
            <p class="learn-more"><a href="https://duckduckgo.com/bang.html" target="_blank">Browse all available shortcuts →</a></p>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2>Custom Bangs</h2>
          </div>
          <div class="card-body">
            <p>Create your own custom search bangs by adding them to your browser's local storage:</p>
            
            <div class="code-container">
              <code>
const customBangs = JSON.parse(localStorage.getItem('custom-bangs') || '[]');
customBangs.push({
  t: "myshort",  // The shortcut (e.g., !myshort)
  d: "example.com",  // The domain
  u: "https://example.com/search?q={{{s}}}"  // The search URL with {{{s}}} as the query placeholder
});
localStorage.setItem('custom-bangs', JSON.stringify(customBangs));
// Force reload the search engine map to apply changes immediately
window.location.reload();
              </code>
              <button class="copy-custom-bang-button tooltip" data-tooltip="Copy to clipboard">
                <img src="/clipboard.svg" alt="Copy" />
              </button>
            </div>
            
            <div class="note">
              <p><strong>Note:</strong> Custom bangs can override existing bangs. If you define a custom bang with the same shortcut as an existing one, your custom bang will be used.</p>
              <p><strong>Example:</strong> Add a custom search for DEV.to:</p>
              <div class="code-container">
                <code>
const customBangs = JSON.parse(localStorage.getItem('custom-bangs') || '[]');
customBangs.push({
  t: "dev",
  d: "dev.to", 
  u: "https://dev.to/search?q={{{s}}}"
});
localStorage.setItem('custom-bangs', JSON.stringify(customBangs));
// Force reload the search engine map to apply changes immediately
window.location.reload();
                </code>
                <button class="copy-devto-example tooltip" data-tooltip="Copy to clipboard">
                  <img src="/clipboard.svg" alt="Copy" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card setup-guide">
          <div class="card-header">
            <h2>Browser Setup Guide</h2>
          </div>
          <div class="card-body">
            <div class="device-tabs">
              <button class="device-tab active" data-device="desktop">Desktop</button>
              <button class="device-tab" data-device="mobile">Mobile</button>
            </div>
            
            <div class="device-content active" id="desktop-content">
              <div class="browser-tabs">
                <button class="tab-button active" data-browser="chrome">Chrome</button>
                <button class="tab-button" data-browser="brave">Brave</button>
                <button class="tab-button" data-browser="firefox">Firefox</button>
                <button class="tab-button" data-browser="edge">Edge</button>
              </div>
              
              <div class="tab-content active" id="chrome-instructions">
                <ol class="setup-steps">
                  <li>Click the three dots menu <span class="icon">⋮</span> in the top right</li>
                  <li>Select <strong>Settings</strong></li>
                  <li>Scroll down to <strong>Search engine</strong></li>
                  <li>Click <strong>Manage search engines and site search</strong></li>
                  <li>Under "Site search", click <strong>Add</strong></li>
                  <li>Enter <strong>QuickBang</strong> as the name</li>
                  <li>Enter a keyword like <strong>qb</strong> (optional)</li>
                  <li>Enter <code>https://quickbang.vercel.app/?q=%s</code> as the URL</li>
                  <li>Click <strong>Add</strong></li>
                  <li>Find QuickBang in the list, click the three dots, and select <strong>Make default</strong></li>
                </ol>
              </div>
              
              <div class="tab-content" id="brave-instructions">
                <ol class="setup-steps">
                  <li>Click the menu button <span class="icon">⋮</span> in the top right</li>
                  <li>Select <strong>Settings</strong></li>
                  <li>Click <strong>Search engines</strong> in the left sidebar</li>
                  <li>Scroll down to <strong>Site search</strong></li>
                  <li>Click <strong>Add</strong> button</li>
                  <li>Enter <strong>QuickBang</strong> as the search engine</li>
                  <li>Enter a keyword like <strong>qb</strong> (optional)</li>
                  <li>Enter <code>https://quickbang.vercel.app/?q=%s</code> as the URL</li>
                  <li>Click <strong>Add</strong></li>
                  <li>To set as default, find QuickBang in the list and click <strong>Make default</strong></li>
                </ol>
              </div>
              
              <div class="tab-content" id="firefox-instructions">
                <ol class="setup-steps">
                  <li>Click the three-line menu <span class="icon">☰</span> and select <strong>Settings</strong></li>
                  <li>Go to <strong>Search</strong> in the left sidebar</li>
                  <li>Scroll down to <strong>One-Click Search Engines</strong></li>
                  <li>Click <strong>Add</strong></li>
                  <li>Enter <strong>QuickBang</strong> as the name</li>
                  <li>Enter <code>https://quickbang.vercel.app/?q=%s</code> as the URL</li>
                  <li>Enter a keyword like <strong>qb</strong> (optional)</li>
                  <li>Click <strong>Add</strong></li>
                  <li>To set as default, click <strong>Search</strong> at the top and select <strong>QuickBang</strong></li>
                </ol>
              </div>
              
              <div class="tab-content" id="edge-instructions">
                <ol class="setup-steps">
                  <li>Click the three dots menu <span class="icon">⋯</span> in the top right</li>
                  <li>Select <strong>Settings</strong></li>
                  <li>Go to <strong>Privacy, search, and services</strong></li>
                  <li>Scroll down to <strong>Address bar and search</strong></li>
                  <li>Click <strong>Manage search engines</strong></li>
                  <li>Click <strong>Add</strong></li>
                  <li>Enter <strong>QuickBang</strong> as the search engine</li>
                  <li>Enter a nickname like <strong>qb</strong> (optional)</li>
                  <li>Enter <code>https://quickbang.vercel.app/?q=%s</code> as the URL</li>
                  <li>Click <strong>Add</strong></li>
                  <li>Find QuickBang in the list, click the three dots, and select <strong>Make default</strong></li>
                </ol>
              </div>
            </div>
            
            <div class="device-content" id="mobile-content">
              <div class="mobile-guide">
                <h3>Brave Mobile (Recommended)</h3>
                <ol class="setup-steps">
                  <li>Tap the menu button <span class="icon">⋮</span> in the bottom right</li>
                  <li>Select <strong>Settings</strong></li>
                  <li>Tap <strong>Search engines</strong></li>
                  <li>Tap <strong>Add search engine</strong></li>
                  <li>Enter <strong>QuickBang</strong> as the name</li>
                  <li>Enter <code>https://quickbang.vercel.app/?q=%s</code> as the URL</li>
                  <li>Enter a shortcut like <strong>qb</strong> (optional)</li>
                  <li>Tap <strong>Save</strong></li>
                  <li>To set as default, tap QuickBang and select <strong>Set as default</strong></li>
                </ol>
                
                <div class="note mobile-note">
                  <p><strong>Note:</strong> For the best mobile experience, we recommend using Brave browser which fully supports custom search engines.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer class="footer">
        <a href="https://github.com/cyberboyayush" target="_blank">GitHub</a>
        •
        <a href="https://x.com/cyberboyayush" target="_blank">X.com</a>
        •
        <a href="https://cyberboyayush.in" target="_blank">Website</a>
      </footer>
    </div>
  `;

  // Add notification functionality
  const showNotification = (message: string, type = 'success') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span class="notification-icon">✓</span>
      <span>${message}</span>
      <button class="close-notification">×</button>
    `;
    
    // Add to DOM
    appContainer.appendChild(notification);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.close-notification');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        notification.classList.add('hiding');
        setTimeout(() => notification.remove(), 300);
      });
    }
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      notification.classList.add('hiding');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  };
  
  // Check for notifications
  const checkNotifications = () => {
    // Check if this page load is due to a custom bang update
    const bangUpdated = sessionStorage.getItem('custom-bang-updated');
    if (bangUpdated) {
      // Clear the flag
      sessionStorage.removeItem('custom-bang-updated');
      showNotification('Custom bang was successfully added!');
    }
    
    // Check if default engine was changed
    const engineChanged = sessionStorage.getItem('default-engine-changed');
    if (engineChanged) {
      // Clear the flag
      sessionStorage.removeItem('default-engine-changed');
      const newEngine = localStorage.getItem('default-bang') || 'brave';
      showNotification(`Default search engine changed to "${newEngine}"!`);
    }
  };
  
  // Call notification check when page loads
  checkNotifications();

  // Setup default engine selector
  const defaultEngineSelect = appContainer.querySelector<HTMLSelectElement>('#default-engine-select');
  const currentDefaultDisplay = appContainer.querySelector<HTMLElement>('#current-default-engine');
  const setDefaultBtn = appContainer.querySelector<HTMLButtonElement>('#set-default-engine');
  
  // Set the current default in the dropdown
  const currentDefault = localStorage.getItem('default-bang') || 'brave';
  if (defaultEngineSelect && currentDefaultDisplay) {
    defaultEngineSelect.value = currentDefault;
    currentDefaultDisplay.textContent = currentDefault;
  }
  
  // Handle setting default engine
  if (setDefaultBtn) {
    setDefaultBtn.addEventListener('click', () => {
      if (defaultEngineSelect) {
        const newDefault = defaultEngineSelect.value;
        localStorage.setItem('default-bang', newDefault);
        
        // Update UI
        if (currentDefaultDisplay) {
          currentDefaultDisplay.textContent = newDefault;
        }
        
        // Update engine immediately without reload
        fallbackEngine = updateFallbackEngine();
        
        // Show confirmation
        showNotification(`Default search engine changed to "${newDefault}"!`);
      }
    });
  }

  // Helper function to handle copy button clicks
  const setupCopyButton = (buttonSelector: string, textSelector: string, getTextFn?: () => string) => {
    const copyBtn = appContainer.querySelector<HTMLButtonElement>(buttonSelector);
    if (!copyBtn) return;
    
    const copyIcon = copyBtn.querySelector("img");
    if (!copyIcon) return;
    
    copyBtn.addEventListener("click", async () => {
      try {
        let textToCopy = '';
        if (getTextFn) {
          textToCopy = getTextFn();
        } else {
          const element = typeof textSelector === 'string' ? 
            appContainer.querySelector(textSelector) : textSelector;
            
          if (element instanceof HTMLInputElement) {
            textToCopy = element.value;
          } else if (element) {
            textToCopy = element.textContent?.trim() || "";
          }
        }
        
        await navigator.clipboard.writeText(textToCopy);
        copyIcon.src = "/clipboard-check.svg";
        copyBtn.setAttribute('data-tooltip', 'Copied!');
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
          copyIcon.src = "/clipboard.svg";
          copyBtn.setAttribute('data-tooltip', 'Copy to clipboard');
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Copy operation failed: ', err);
      }
    });
  };

  // Setup all copy buttons
  setupCopyButton(".copy-button", ".url-input");
  setupCopyButton(".copy-code-button", ".code-container code");
  
  // Handle copying of example code blocks
  const exampleCodeButtons = [
    ".copy-custom-bang-button",
    ".copy-devto-example"
  ];
  
  exampleCodeButtons.forEach(selector => {
    setupCopyButton(selector, '', () => {
      const copyBtn = appContainer.querySelector(selector);
      const codeBlock = copyBtn?.closest('.code-container')?.querySelector('code');
      return codeBlock?.textContent?.trim() || "";
    });
  });

  // Platform selection tabs (desktop/mobile)
  const platformSelectors = appContainer.querySelectorAll<HTMLButtonElement>('.device-tab');
  const platformPanels = appContainer.querySelectorAll<HTMLDivElement>('.device-content');

  platformSelectors.forEach(selector => {
    selector.addEventListener('click', () => {
      // Clear all active states
      platformSelectors.forEach(btn => btn.classList.remove('active'));
      platformPanels.forEach(panel => panel.classList.remove('active'));
      
      // Activate selected platform
      selector.classList.add('active');
      
      // Show corresponding content panel
      const platformType = selector.getAttribute('data-device');
      const targetPanel = appContainer.querySelector(`#${platformType}-content`);
      targetPanel?.classList.add('active');
    });
  });

  // Browser instruction tabs
  const browserSelectors = appContainer.querySelectorAll<HTMLButtonElement>('.tab-button');
  const instructionPanels = appContainer.querySelectorAll<HTMLDivElement>('.tab-content');

  browserSelectors.forEach(selector => {
    selector.addEventListener('click', () => {
      // Clear all active states
      browserSelectors.forEach(btn => btn.classList.remove('active'));
      instructionPanels.forEach(panel => panel.classList.remove('active'));
      
      // Activate selected browser
      selector.classList.add('active');
      
      // Show corresponding instructions
      const browserType = selector.getAttribute('data-browser');
      const targetInstructions = appContainer.querySelector(`#${browserType}-instructions`);
      targetInstructions?.classList.add('active');
    });
  });
}

const userDefinedEngines = fetchUserSearchEngines();

// Create a map for O(1) search engine lookup
const searchEngineMap = new Map<string, SearchEngine>();

// First add standard bangs
bangs.forEach(engine => {
  searchEngineMap.set(engine.t, { 
    shortcut: engine.t, 
    domain: engine.d, 
    searchUrl: engine.u 
  });
});

// Then override with user-defined engines (these take priority)
userDefinedEngines.forEach(engine => {
  searchEngineMap.set(engine.shortcut, engine);
});

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
    // Set flag to refresh cache
    sessionStorage.setItem('refresh-bangs-cache', 'true');
    // Refresh the engine map
    refreshEngineMap();
  }
  
  // If default engine changed
  if (event.key === 'default-bang') {
    // Update fallback engine immediately
    fallbackEngine = updateFallbackEngine();
    // Set notification flag for next page load
    sessionStorage.setItem('default-engine-changed', 'true');
  }
});

// Add a function to refresh the engine map when custom bangs change
const refreshEngineMap = () => {
  // Clear existing map
  searchEngineMap.clear();
  
  // Re-populate with standard bangs
  bangs.forEach(engine => {
    searchEngineMap.set(engine.t, { 
      shortcut: engine.t, 
      domain: engine.d, 
      searchUrl: engine.u 
    });
  });
  
  // Override with user-defined engines
  const userEngines = fetchUserSearchEngines();
  userEngines.forEach(engine => {
    searchEngineMap.set(engine.shortcut, engine);
  });
  
  // Update fallback engine after refresh
  fallbackEngine = updateFallbackEngine();
};

function constructRedirectUrl() {
  const currentUrl = new URL(window.location.href);
  const searchQuery = currentUrl.searchParams.get("q")?.trim() ?? "";
  
  if (!searchQuery) {
    renderHomePage();
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
    // Preserve forward slashes for repository-style searches
    encodeURIComponent(searchTerms).replace(/%2F/g, "/")
  );
  
  return finalUrl || null;
}

function executeRedirection() {
  const redirectUrl = constructRedirectUrl();
  if (!redirectUrl) return;
  window.location.replace(redirectUrl);
}

// Check if we need to apply settings changes immediately
const applySettingsChanges = () => {
  // Check URL for special params
  const urlParams = new URLSearchParams(window.location.search);
  
  // Handle setting default engine via URL parameter
  const setDefaultEngine = urlParams.get('set-default');
  if (setDefaultEngine) {
    localStorage.setItem('default-bang', setDefaultEngine);
    sessionStorage.setItem('default-engine-changed', 'true');
    // Remove the parameter and reload
    urlParams.delete('set-default');
    const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
    window.location.replace(newUrl);
    return;
  }
  
  // Normal execution
  executeRedirection();
};

// Start the application
applySettingsChanges();

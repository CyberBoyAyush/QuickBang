import { bangs } from "./bang";
import "./global.css";

function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div class="app-container">
      <div class="content-container">
        <div class="hero-section">
          <div class="logo-container">
            <img src="/search.svg" alt="QuickBang logo" class="logo-icon" />
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
              <p><strong>Change Default Engine:</strong> Brave is the default search engine, but you can change it by running this in your browser console:</p>
              <div class="code-container">
                <code>localStorage.setItem("default-bang", "p")</code>
                <button class="copy-code-button tooltip" data-tooltip="Copy to clipboard">
                  <img src="/clipboard.svg" alt="Copy" />
                </button>
              </div>
              <p class="examples">Examples: <code>g</code> (Google), <code>p</code> (Perplexity), <code>yt</code> (YouTube), <code>c</code> (ChatGPT)</p>
            </div>
            
            <p class="learn-more"><a href="https://duckduckgo.com/bang.html" target="_blank">Browse all available shortcuts →</a></p>
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

  // Copy button for URL functionality
  const copyButton = app.querySelector<HTMLButtonElement>(".copy-button")!;
  const copyIcon = copyButton.querySelector("img")!;
  const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(urlInput.value);
      copyIcon.src = "/clipboard-check.svg";
      copyButton.setAttribute('data-tooltip', 'Copied!');
      copyButton.classList.add('copied');
      
      setTimeout(() => {
        copyIcon.src = "/clipboard.svg";
        copyButton.setAttribute('data-tooltip', 'Copy to clipboard');
        copyButton.classList.remove('copied');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  });

  // Add copy functionality for the localStorage code
  const copyCodeButton = app.querySelector<HTMLButtonElement>(".copy-code-button")!;
  const copyCodeIcon = copyCodeButton.querySelector("img")!;
  const codeText = app.querySelector<HTMLElement>(".code-container code")!;

  copyCodeButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(codeText.textContent || "");
      copyCodeIcon.src = "/clipboard-check.svg";
      copyCodeButton.setAttribute('data-tooltip', 'Copied!');
      copyCodeButton.classList.add('copied');
      
      setTimeout(() => {
        copyCodeIcon.src = "/clipboard.svg";
        copyCodeButton.setAttribute('data-tooltip', 'Copy to clipboard');
        copyCodeButton.classList.remove('copied');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  });

  // Desktop/mobile tab switching
  const deviceTabs = app.querySelectorAll<HTMLButtonElement>('.device-tab');
  const deviceContents = app.querySelectorAll<HTMLDivElement>('.device-content');

  deviceTabs.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      deviceTabs.forEach(btn => btn.classList.remove('active'));
      deviceContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Add active class to corresponding content
      const device = button.getAttribute('data-device');
      const content = app.querySelector(`#${device}-content`);
      content?.classList.add('active');
    });
  });

  // Browser tab switching
  const tabButtons = app.querySelectorAll<HTMLButtonElement>('.tab-button');
  const tabContents = app.querySelectorAll<HTMLDivElement>('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Add active class to corresponding content
      const browser = button.getAttribute('data-browser');
      const content = app.querySelector(`#${browser}-instructions`);
      content?.classList.add('active');
    });
  });
}

const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "brave";
const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);

function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  // Allow ! and : as bang shortcuts
  const match = query.match(/([!:])(\S+)/i);

  const bangCandidate = match?.[2]?.toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang;

  // Remove the first bang from the query (either ! or :)
  const cleanQuery = query.replace(/([!:])\S+\s*/i, "").trim();

  // If the query is just a bang, use the domain directly
  if (cleanQuery === "")
    return selectedBang ? `https://${selectedBang.d}` : null;

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = selectedBang?.u.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+cyberboyayush/quickbang"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/"),
  );
  if (!searchUrl) return null;

  return searchUrl;
}

function doRedirect() {
  const searchUrl = getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

doRedirect();

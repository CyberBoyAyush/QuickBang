import "./global.css";

// Define type for search engines
interface SearchEngine {
  shortcut: string;
  domain: string;
  searchUrl: string;
}

// Get main functions without circular dependency
const getMainFunctions = () => {
  // @ts-ignore
  return window.mainFunctions || null;
};

// Use the custom bang manager from main
const getCustomBangManager = () => {
  const mainFunctions = getMainFunctions();
  return mainFunctions?.customBangManager || {
    getCustomBangs: () => [],
    saveCustomBangs: () => {},
    addCustomBang: () => false,
    updateCustomBang: () => false,
    deleteCustomBang: () => false
  };
};

// Enhanced custom bang manager with additional methods
const customBangManager = {
  ...getCustomBangManager(),

  addCustomBang: (bang: SearchEngine): boolean => {
    try {
      console.log("Adding new custom bang:", bang);
      const mainFunctions = getMainFunctions();
      if (!mainFunctions?.customBangManager) {
        console.error("Main functions not available");
        return false;
      }

      const existing = mainFunctions.customBangManager.getCustomBangs();

      // Check if bang already exists
      const existingIndex = existing.findIndex((b: SearchEngine) => b.shortcut === bang.shortcut);
      if (existingIndex >= 0) {
        existing[existingIndex] = bang;
      } else {
        existing.push(bang);
      }

      mainFunctions.customBangManager.saveCustomBangs(existing);
      return true;
    } catch (error) {
      console.error("Failed to add custom bang:", error);
      return false;
    }
  },

  updateCustomBang: (index: number, bang: SearchEngine): boolean => {
    try {
      const mainFunctions = getMainFunctions();
      if (!mainFunctions?.customBangManager) return false;

      const existing = mainFunctions.customBangManager.getCustomBangs();
      if (index >= 0 && index < existing.length) {
        existing[index] = bang;
        mainFunctions.customBangManager.saveCustomBangs(existing);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update custom bang:", error);
      return false;
    }
  },

  deleteCustomBang: (index: number): boolean => {
    try {
      const mainFunctions = getMainFunctions();
      if (!mainFunctions?.customBangManager) return false;

      const existing = mainFunctions.customBangManager.getCustomBangs();
      if (index >= 0 && index < existing.length) {
        existing.splice(index, 1);
        mainFunctions.customBangManager.saveCustomBangs(existing);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete custom bang:", error);
      return false;
    }
  },

  getCustomBangs: (): SearchEngine[] => {
    const mainFunctions = getMainFunctions();
    return mainFunctions?.customBangManager?.getCustomBangs() || [];
  }
};

// Notification system
const showNotification = (message: string, type = 'success') => {
  const appContainer = document.querySelector<HTMLDivElement>("#app")!;

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
    <span>${message}</span>
    <button class="close-notification">×</button>
  `;

  appContainer.appendChild(notification);

  const closeBtn = notification.querySelector('.close-notification');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      notification.classList.add('hiding');
      setTimeout(() => notification.remove(), 300);
    });
  }

  setTimeout(() => {
    notification.classList.add('hiding');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};

// Custom bangs management page
export function renderCustomBangsPage() {
  console.log("Rendering custom bangs page");
  const appContainer = document.querySelector<HTMLDivElement>("#app")!;

  const customBangs = customBangManager.getCustomBangs();
  console.log("Current custom bangs:", customBangs);

  appContainer.innerHTML = `
    <div class="app-container">
      <div class="content-container">
        <div class="hero-section">
          <div class="logo-container">
            <img src="/favicon.svg" alt="QuickBang logo" class="logo-icon" />
            <h1>Custom Bangs</h1>
          </div>
          <p class="tagline">Create and manage your custom search shortcuts</p>
          <button class="back-home-btn">← Back to Home</button>
        </div>

        <div class="card">
          <div class="card-header">
            <h2>Add New Bang</h2>
          </div>
          <div class="card-body">
            <form id="add-bang-form" class="bang-form">
              <div class="form-group">
                <label for="shortcut">Shortcut (without !)</label>
                <input type="text" id="shortcut" name="shortcut" placeholder="e.g., dev" required>
                <small>This will be used as !dev in searches</small>
              </div>

              <div class="form-group">
                <label for="domain">Domain</label>
                <input type="text" id="domain" name="domain" placeholder="e.g., dev.to" required>
              </div>

              <div class="form-group">
                <label for="searchUrl">Search URL</label>
                <input type="text" id="searchUrl" name="searchUrl" placeholder="https://dev.to/search?q={{{s}}}" required>
                <small>Use {{{s}}} as the placeholder for search terms</small>
              </div>

              <button type="submit" class="add-bang-btn">Add Bang</button>
            </form>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2>Your Bangs ${customBangs.length > 0 ? `(${customBangs.length})` : ''}</h2>
          </div>
          <div class="card-body">
            <div id="custom-bangs-list">
              ${customBangs.length === 0 ?
                '<p class="no-bangs">No custom bangs created yet. Add one above!</p>' :
                customBangs.map((bang: SearchEngine, index: number) => `
                  <div class="bang-item" data-index="${index}">
                    <div class="bang-info">
                      <div class="bang-shortcut">!${bang.shortcut}</div>
                      <div class="bang-details">
                        <div class="bang-domain">${bang.domain}</div>
                        <div class="bang-url">${bang.searchUrl}</div>
                      </div>
                    </div>
                    <div class="bang-actions">
                      <button class="edit-bang-btn" data-index="${index}">Edit</button>
                      <button class="delete-bang-btn" data-index="${index}">Delete</button>
                    </div>
                  </div>
                `).join('')
              }
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div id="edit-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit Bang</h3>
          <button class="close-modal">&times;</button>
        </div>
        <form id="edit-bang-form" class="bang-form">
          <div class="form-group">
            <label for="edit-shortcut">Shortcut (without !)</label>
            <input type="text" id="edit-shortcut" name="shortcut" placeholder="e.g., dev" required>
            <small>This will be used as !dev in searches</small>
          </div>

          <div class="form-group">
            <label for="edit-domain">Domain</label>
            <input type="text" id="edit-domain" name="domain" placeholder="e.g., dev.to" required>
          </div>

          <div class="form-group">
            <label for="edit-searchUrl">Search URL</label>
            <input type="text" id="edit-searchUrl" name="searchUrl" placeholder="https://dev.to/search?q={{{s}}}" required>
            <small>Use {{{s}}} as the placeholder for search terms</small>
          </div>

          <div class="modal-actions">
            <button type="button" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;

  setupCustomBangsEventListeners();
}

function setupCustomBangsEventListeners() {
  console.log("Setting up custom bangs event listeners");

  // Back to home
  const backBtn = document.querySelector('.back-home-btn');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("Back button clicked");
      window.history.pushState({}, '', '/');
      renderHomePage();
    });
  }

  // Add custom bang form
  const addForm = document.querySelector('#add-bang-form') as HTMLFormElement;

  if (!addForm) {
    console.error("Could not find add-bang-form element");
    return;
  }

  console.log("Form found, adding event listener");

  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log("Form submitted");

    try {
      const formData = new FormData(addForm);

      const shortcutValue = formData.get('shortcut');
      const domainValue = formData.get('domain');
      const searchUrlValue = formData.get('searchUrl');

      console.log("Form values:", { shortcutValue, domainValue, searchUrlValue });

      if (!shortcutValue || !domainValue || !searchUrlValue) {
        showNotification('Please fill in all fields', 'error');
        return;
      }

      const newBang: SearchEngine = {
        shortcut: String(shortcutValue).toLowerCase().trim(),
        domain: String(domainValue).trim(),
        searchUrl: String(searchUrlValue).trim()
      };

      console.log("Processed bang:", newBang);

      // Validation
      if (!newBang.searchUrl.includes('{{{s}}}')) {
        showNotification('Search URL must contain {{{s}}} placeholder', 'error');
        return;
      }

      // Add the bang
      const success = customBangManager.addCustomBang(newBang);
      console.log("Add result:", success);

      if (success) {
        showNotification('Custom bang added successfully!');
        addForm.reset();

        // Refresh the page content
        setTimeout(() => {
          renderCustomBangsPage();
        }, 1000);
      } else {
        showNotification('Failed to add custom bang', 'error');
      }
    } catch (error) {
      console.error("Error adding custom bang:", error);
      showNotification('An error occurred while adding the custom bang', 'error');
    }
  });

  // Delete buttons
  document.querySelectorAll('.delete-bang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0');
      if (confirm('Are you sure you want to delete this custom bang?')) {
        if (customBangManager.deleteCustomBang(index)) {
          showNotification('Custom bang deleted successfully!');
          setTimeout(() => renderCustomBangsPage(), 1000);
        } else {
          showNotification('Failed to delete custom bang', 'error');
        }
      }
    });
  });

  // Edit buttons and modal
  const modal = document.querySelector('#edit-modal') as HTMLElement;
  const editForm = document.querySelector('#edit-bang-form') as HTMLFormElement;
  let editingIndex = -1;

  if (!modal || !editForm) {
    console.error("Could not find edit modal elements");
    return;
  }

  document.querySelectorAll('.edit-bang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0');
      const customBangs = customBangManager.getCustomBangs();
      const bang = customBangs[index];

      if (bang) {
        editingIndex = index;
        (document.querySelector('#edit-shortcut') as HTMLInputElement).value = bang.shortcut;
        (document.querySelector('#edit-domain') as HTMLInputElement).value = bang.domain;
        (document.querySelector('#edit-searchUrl') as HTMLInputElement).value = bang.searchUrl;
        modal.style.display = 'flex';
      }
    });
  });

  // Modal close
  document.querySelectorAll('.close-modal, .cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  });

  // Edit form submit - fix validation and error handling
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      try {
        const formData = new FormData(editForm);

        const shortcut = String(formData.get('shortcut') || '').toLowerCase().trim();
        const domain = String(formData.get('domain') || '').trim();
        const searchUrl = String(formData.get('searchUrl') || '').trim();

        // Validate
        if (!shortcut || !domain || !searchUrl) {
          showNotification('Please fill in all fields', 'error');
          return;
        }

        if (!searchUrl.includes('{{{s}}}')) {
          showNotification('Search URL must contain {{{s}}} placeholder', 'error');
          return;
        }

        const updatedBang: SearchEngine = { shortcut, domain, searchUrl };

        // Check if shortcut already exists (except for the current one being edited)
        const existing = customBangManager.getCustomBangs();
        if (existing.some((bang: SearchEngine, i: number) => i !== editingIndex && bang.shortcut === shortcut)) {
          showNotification('A custom bang with this shortcut already exists', 'error');
          return;
        }

        if (customBangManager.updateCustomBang(editingIndex, updatedBang)) {
          showNotification('Custom bang updated successfully!');
          modal.style.display = 'none';

          // Refresh the page content
          setTimeout(() => {
            renderCustomBangsPage();
          }, 1000);
        } else {
          showNotification('Failed to update custom bang', 'error');
        }
      } catch (error) {
        console.error("Error updating custom bang:", error);
        showNotification('An error occurred while updating the custom bang', 'error');
      }
    });
  }
}

// Home page rendering
export function renderHomePage() {
  console.log("Rendering home page");
  const appContainer = document.querySelector<HTMLDivElement>("#app")!;

  const customBangs = customBangManager.getCustomBangs();
  const currentDefault = localStorage.getItem('default-bang') || 'brave';


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
            <h2>Setup QuickBang</h2>
          </div>
          <div class="card-body">
            <p>Add QuickBang to your browser by following these steps:</p>

            <ol class="setup-steps">
              <li>Copy this URL:</li>
            </ol>

            <div class="url-container">
              <input type="text" class="url-input" value="https://quickbang.aysh.me/?q=%s" readonly />
              <button class="copy-button tooltip" data-tooltip="Copy to clipboard">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>

            <ol class="setup-steps" start="2">
              <li>In your browser settings, add a new search engine</li>
              <li>Set the URL above as the search engine address</li>
              <li>Set a keyword like "q" or "qb" for quick access</li>
              <li>Now you can use it like: <code>q !g search term</code> or just <code>q search term</code></li>
            </ol>

            <div class="note">
              <strong>Tip:</strong> Make QuickBang your default search engine for the best experience.
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2>Custom Bangs</h2>
            <button class="manage-bangs-btn">Manage Bangs</button>
          </div>
          <div class="card-body">
            <p>Create and manage your own custom search shortcuts:</p>

            <div class="custom-bangs-preview">
              ${customBangs.length === 0 ?
                '<p class="no-custom-bangs">No custom bangs created yet. <a href="javascript:void(0)" class="create-first-bang">Create your first one!</a></p>' :
                `
                  <div class="custom-bangs-summary">
                    <p>You have <strong>${customBangs.length}</strong> custom bang${customBangs.length === 1 ? '' : 's'}:</p>
                    <ul class="custom-bangs-list">
                      ${customBangs.slice(0, 3).map((bang: SearchEngine) => `
                        <li><strong>!${bang.shortcut}</strong> - ${bang.domain}</li>
                      `).join('')}
                      ${customBangs.length > 3 ? `<li><em>and ${customBangs.length - 3} more...</em></li>` : ''}
                    </ul>
                  </div>
                `
              }
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2>Default Search Engine</h2>
          </div>
          <div class="card-body">
            <p>Current default engine: <strong id="current-default-engine">${currentDefault}</strong></p>
            <p>This engine is used when no bang is specified.</p>

            <div class="default-engine-selector">
              <select id="default-engine-select">
                <option value="brave">Brave</option>
                <option value="g">Google</option>
                <option value="p">Perplexity</option>
                <option value="c">ChatGPT</option>
                <option value="yt">YouTube</option>
                <option value="gi">Google Images</option>
                <option value="gh">GitHub</option>
                <option value="ddg">DuckDuckGo</option>
                <option value="b">Bing</option>
              </select>
              <button id="set-default-engine" class="set-default-button">Set Default</button>
            </div>
          </div>
        </div>

        <div class="card suggested-bangs-card">
          <div class="card-header">
            <h2>🚀 Popular Search Bangs</h2>
            <p class="card-subtitle">Quick shortcuts to your favorite search engines</p>
          </div>
          <div class="card-body">
            <div class="bangs-table-container">
              <table class="bangs-table">
                <thead>
                  <tr>
                    <th class="service-column">
                      <span class="column-icon">🌐</span>
                      Search Engine
                    </th>
                    <th class="bang-column">
                      <span class="column-icon">⚡</span>
                      Bang Shortcut
                    </th>
                    <th class="example-column">
                      <span class="column-icon">💡</span>
                      Example Usage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bang-row" data-bang="p">
                    <td class="service-cell">
                      <div class="service-info">
                        <span class="service-icon">🧠</span>
                        <span class="service-name">Perplexity</span>
                      </div>
                    </td>
                    <td class="bang-cell">
                      <code class="bang-code">!p</code>
                    </td>
                    <td class="example-cell">
                      <code class="example-code">!p AI trends 2024</code>
                    </td>
                  </tr>
                  <tr class="bang-row" data-bang="c">
                    <td class="service-cell">
                      <div class="service-info">
                        <span class="service-icon">💬</span>
                        <span class="service-name">ChatGPT</span>
                      </div>
                    </td>
                    <td class="bang-cell">
                      <code class="bang-code">!c</code>
                    </td>
                    <td class="example-cell">
                      <code class="example-code">!c explain quantum computing</code>
                    </td>
                  </tr>
                  <tr class="bang-row" data-bang="g">
                    <td class="service-cell">
                      <div class="service-info">
                        <span class="service-icon">🔍</span>
                        <span class="service-name">Google</span>
                      </div>
                    </td>
                    <td class="bang-cell">
                      <code class="bang-code">!g</code>
                    </td>
                    <td class="example-cell">
                      <code class="example-code">!g best restaurants near me</code>
                    </td>
                  </tr>
                  <tr class="bang-row" data-bang="brave">
                    <td class="service-cell">
                      <div class="service-info">
                        <span class="service-icon">🦁</span>
                        <span class="service-name">Brave Search</span>
                      </div>
                    </td>
                    <td class="bang-cell">
                      <code class="bang-code">!brave</code>
                    </td>
                    <td class="example-cell">
                      <code class="example-code">!brave privacy tools</code>
                    </td>
                  </tr>
                  <tr class="bang-row" data-bang="b">
                    <td class="service-cell">
                      <div class="service-info">
                        <span class="service-icon">🌐</span>
                        <span class="service-name">Bing</span>
                      </div>
                    </td>
                    <td class="bang-cell">
                      <code class="bang-code">!b</code>
                    </td>
                    <td class="example-cell">
                      <code class="example-code">!b weather forecast</code>
                    </td>
                  </tr>
                  <tr class="bang-row" data-bang="ddg">
                    <td class="service-cell">
                      <div class="service-info">
                        <span class="service-icon">🦆</span>
                        <span class="service-name">DuckDuckGo</span>
                      </div>
                    </td>
                    <td class="bang-cell">
                      <code class="bang-code">!ddg</code>
                    </td>
                    <td class="example-cell">
                      <code class="example-code">!ddg secure messaging</code>
                    </td>
                  </tr>
                  <tr class="bang-row" data-bang="github">
                    <td class="service-cell">
                      <div class="service-info">
                        <span class="service-icon">🐙</span>
                        <span class="service-name">GitHub</span>
                      </div>
                    </td>
                    <td class="bang-cell">
                      <code class="bang-code">!github</code>
                    </td>
                    <td class="example-cell">
                      <code class="example-code">!github react hooks</code>
                    </td>
                  </tr>
                  <tr class="bang-row" data-bang="ghr">
                    <td class="service-cell">
                      <div class="service-info">
                        <span class="service-icon">📦</span>
                        <span class="service-name">GitHub Repos</span>
                      </div>
                    </td>
                    <td class="bang-cell">
                      <code class="bang-code">!ghr</code>
                    </td>
                    <td class="example-cell">
                      <code class="example-code">!ghr awesome-python</code>
                    </td>
                  </tr>
                  <tr class="bang-row" data-bang="gi">
                    <td class="service-cell">
                      <div class="service-info">
                        <span class="service-icon">🖼️</span>
                        <span class="service-name">Google Images</span>
                      </div>
                    </td>
                    <td class="bang-cell">
                      <code class="bang-code">!gi</code>
                    </td>
                    <td class="example-cell">
                      <code class="example-code">!gi sunset wallpaper</code>
                    </td>
                  </tr>
                  <tr class="bang-row" data-bang="li">
                    <td class="service-cell">
                      <div class="service-info">
                        <span class="service-icon">💼</span>
                        <span class="service-name">LinkedIn</span>
                      </div>
                    </td>
                    <td class="bang-cell">
                      <code class="bang-code">!li</code>
                    </td>
                    <td class="example-cell">
                      <code class="example-code">!li software engineer jobs</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="bang-usage-tip">
              <div class="tip-content">
                <span class="tip-icon">💡</span>
                <div class="tip-text">
                  <strong>Pro Tip:</strong> Just type the bang followed by your search term.
                  Example: <code>!p what is machine learning</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-section" style="text-align: center; padding: 2rem 0;">
          <div class="footer-content" style="display: flex; flex-direction: column; align-items: center; max-width: 800px; margin: 0 auto;">
            <div class="footer-text" style="text-align: center; margin-bottom: 1.5rem;">
              <p class="footer-attribution" style="margin: 0 0 0.5rem 0;">Made with ❤️ by <strong>@cyberboyayush</strong></p>
              <p class="footer-tagline" style="margin: 0; opacity: 0.8;">Lightning-fast search shortcuts for everyone</p>
            </div>
            <div class="footer-buttons" style="display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <button onclick="window.open('https://github.com/cyberboyayush', '_blank')" class="footer-btn github-btn" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; border: 1px solid #333; background: transparent; color: inherit; border-radius: 6px; cursor: pointer; transition: all 0.2s;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </button>

              <button onclick="window.open('https://x.com/cyberboyayush', '_blank')" class="footer-btn twitter-btn" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; border: 1px solid #333; background: transparent; color: inherit; border-radius: 6px; cursor: pointer; transition: all 0.2s;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X.com</span>
              </button>

              <button onclick="window.open('https://cyberboyayush.in', '_blank')" class="footer-btn website-btn" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; border: 1px solid #333; background: transparent; color: inherit; border-radius: 6px; cursor: pointer; transition: all 0.2s;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm5.99 6H16a8.5 8.5 0 00-1.05-2.05L16.99 4.05A9.5 9.5 0 0117.99 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.74 2h2.95a8.5 8.5 0 001.05 2.05L7.01 19.95A9.5 9.5 0 015.01 16zm2.95-8H5.01a9.5 9.5 0 012-3.95L9 5.95A8.5 8.5 0 007.95 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.95A8.5 8.5 0 0015.64 16h2.95a9.5 9.5 0 01-2 3.95zm1.41-9.95c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
                </svg>
                <span>Website</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  setupHomePageEventListeners();
}

function setupHomePageEventListeners() {
  // Manage bangs button
  const manageBangsBtn = document.querySelector('.manage-bangs-btn');
  if (manageBangsBtn) {
    manageBangsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("Manage bangs button clicked");
      window.history.pushState({}, '', '/?page=custom-bangs');
      renderCustomBangsPage();
    });
  }

  // Create first bang link
  const createFirstBangLink = document.querySelector('.create-first-bang');
  if (createFirstBangLink) {
    createFirstBangLink.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("Create first bang link clicked");
      window.history.pushState({}, '', '/?page=custom-bangs');
      renderCustomBangsPage();
    });
  }

  // Copy button functionality
  const copyBtn = document.querySelector('.copy-button');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        const urlInput = document.querySelector('.url-input') as HTMLInputElement;
        await navigator.clipboard.writeText(urlInput.value);

        copyBtn.setAttribute('data-tooltip', 'Copied!');
        copyBtn.classList.add('copied');

        setTimeout(() => {
          copyBtn.setAttribute('data-tooltip', 'Copy to clipboard');
          copyBtn.classList.remove('copied');
        }, 2000);

        showNotification('URL copied to clipboard');
      } catch (err) {
        console.error('Copy operation failed: ', err);
        showNotification('Failed to copy URL', 'error');
      }
    });
  }

  // Default engine functionality
  const defaultEngineSelect = document.querySelector<HTMLSelectElement>('#default-engine-select');
  const currentDefaultDisplay = document.querySelector<HTMLElement>('#current-default-engine');
  const setDefaultBtn = document.querySelector<HTMLButtonElement>('#set-default-engine');

  // Use a more reliable way to get the current default
  const currentDefault = localStorage.getItem('default-bang') || 'brave';

  if (defaultEngineSelect && currentDefaultDisplay) {
    defaultEngineSelect.value = currentDefault;
    currentDefaultDisplay.textContent = currentDefault;
  }

  if (setDefaultBtn) {
    setDefaultBtn.addEventListener('click', () => {
      if (defaultEngineSelect) {
        const newDefault = defaultEngineSelect.value;
        localStorage.setItem('default-bang', newDefault);

        if (currentDefaultDisplay) {
          currentDefaultDisplay.textContent = newDefault;
        }

        // Signal that default engine changed
        sessionStorage.setItem('default-engine-changed', 'true');

        // Try to refresh engines immediately if possible
        const mainFunctions = getMainFunctions();
        if (mainFunctions && typeof mainFunctions.refreshEngines === 'function') {
          mainFunctions.refreshEngines();
        }

        showNotification(`Default search engine changed to "${newDefault}"`);
      }
    });
  }
}

// Simple router
export function handleRouting() {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');

  console.log("Routing to page:", page);

  try {
    switch (page) {
      case 'custom-bangs':
        console.log("Rendering custom bangs page");
        renderCustomBangsPage();
        break;
      default:
        console.log("Rendering home page");
        renderHomePage();
        break;
    }

    checkNotifications();
  } catch (error) {
    console.error("Error in routing:", error);
    renderHomePage();
  }
}

// Add notification check function
function checkNotifications() {
  // Check if custom bang was updated
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
}

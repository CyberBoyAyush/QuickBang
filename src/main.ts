import { bangs } from "./bang";
import "./global.css";

function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div class="app-container">
      <div class="content-container">
        <div class="logo-container">
          <img src="/search.svg" alt="QuickBang logo" class="logo-icon" />
          <h1>QuickBang</h1>
        </div>
        <p class="tagline">Lightning-fast search shortcuts with all DuckDuckGo bangs</p>
        
        <div class="description">
          <p>Add the following URL as a custom search engine to your browser for instant access to <a href="https://duckduckgo.com/bang.html" target="_blank">all DuckDuckGo bangs</a> with improved speed.</p>
        </div>
        
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
        
        <div class="usage-guide">
          <h2>How to use:</h2>
          <ul>
            <li><span class="shortcut">!g search term</span> - Search Google</li>
            <li><span class="shortcut">!yt search term</span> - Search YouTube</li>
            <li><span class="shortcut">!w search term</span> - Search Wikipedia</li>
          </ul>
          <p class="learn-more"><a href="https://duckduckgo.com/bang.html" target="_blank">Browse all available shortcuts →</a></p>
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
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
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

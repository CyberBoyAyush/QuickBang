# QuickBang

QuickBang provides lightning-fast search shortcuts using DuckDuckGo's bang syntax. Add the following URL as a custom search engine to your browser for instant access to hundreds of search shortcuts.

```
https://quickbang.vercel.app/?q=%s
```

## Features

- ⚡ **Lightning Fast**: All redirects happen client-side for instant search access
- 🌐 **Hundreds of Shortcuts**: Access all DuckDuckGo's bang shortcuts (!g, !yt, !w, etc.)
- 🔄 **Client-Side Processing**: No server delays - your device handles the redirects
- 🌙 **Dark Mode Support**: Automatically adapts to your system preferences
- 🔧 **Customizable Default**: Change your default search engine using localStorage
- 📱 **Mobile Support**: Works great on mobile browsers including Brave and Chrome

## How to Use

1. Add QuickBang as a custom search engine in your browser
2. Use bang shortcuts to search directly:
   - `!g search term` or `:g search term` - Search Google
   - `!yt search term` or `:yt search term` - Search YouTube
   - `!w search term` or `:w search term` - Search Wikipedia
   - And hundreds more!

## Default Search Engine

Brave is set as the default search engine. If you type a query without a bang prefix, it will search using Brave.

You can change your default search engine by setting a value in localStorage:

```javascript
localStorage.setItem("default-bang", "your-preferred-bang")
```

Examples:
- `g` for Google
- `ddg` for DuckDuckGo
- `yt` for YouTube
- `w` for Wikipedia

## Browser Setup Instructions

### Desktop Browsers

#### Chrome
1. Click the three dots menu ⋮ in the top right
2. Select **Settings**
3. Scroll down to **Search engine**
4. Click **Manage search engines and site search**
5. Under "Site search", click **Add**
6. Enter "QuickBang" as the name
7. Enter a keyword like "qb" (optional)
8. Enter `https://quickbang.vercel.app/?q=%s` as the URL
9. Click **Add**
10. Find QuickBang in the list, click the three dots, and select **Make default**

#### Brave
1. Click the menu button ⋮ in the top right
2. Select **Settings**
3. Click **Search engines** in the left sidebar
4. Scroll down to **Site search**
5. Click **Add** button
6. Enter "QuickBang" as the search engine
7. Enter a keyword like "qb" (optional)
8. Enter `https://quickbang.vercel.app/?q=%s` as the URL
9. Click **Add**
10. To set as default, find QuickBang in the list and click **Make default**

#### Firefox
1. Click the three-line menu ☰ and select **Preferences**
2. Go to **Search** in the left sidebar
3. Scroll down to **One-Click Search Engines**
4. Click **Add**
5. Enter "QuickBang" as the name
6. Enter `https://quickbang.vercel.app/?q=%s` as the URL
7. Enter a keyword like "qb" (optional)
8. Click **Add**
9. To set as default, click **Search** at the top and select QuickBang

#### Edge
1. Click the three dots menu ... in the top right
2. Select **Settings**
3. Go to **Privacy, search, and services**
4. Scroll down to **Address bar and search**
5. Click **Manage search engines**
6. Click **Add**
7. Enter "QuickBang" as the search engine
8. Enter a nickname like "qb" (optional)
9. Enter `https://quickbang.vercel.app/?q=%s` as the URL
10. Click **Add**
11. Find QuickBang in the list, click the three dots, and select **Make default**

### Mobile Browsers

#### Brave Mobile (only one that supports)
1. Tap the menu button ⋮ in the bottom right
2. Select **Settings**
3. Tap **Search engines**
4. Tap **Add search engine**
5. Enter "QuickBang" as the name
6. Enter `https://quickbang.vercel.app/?q=%s` as the URL
7. Enter a shortcut like "qb" (optional)
8. Tap **Save**
9. To set as default, tap QuickBang and select **Set as default**


## Why It's Faster

DuckDuckGo processes bang redirects server-side, which can be slow due to DNS resolution and server processing. QuickBang moves all processing to the client side. After your first visit, the JS is cached and redirects happen almost instantly from your device.

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

## Author

[CyberBoyAyush](https://github.com/cyberboyayush)


#### Thanks to Duck Duck Go for their [bangs](https://duckduckgo.com/bang.html) and Theo for Unduck.

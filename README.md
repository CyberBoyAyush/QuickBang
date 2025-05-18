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

## How to Use

1. Add QuickBang as a custom search engine in your browser
2. Use bang shortcuts to search directly:
   - `!g search term` - Search Google
   - `!yt search term` - Search YouTube
   - `!w search term` - Search Wikipedia
   - And hundreds more!

## Why It's Faster

DuckDuckGo processes bang redirects server-side, which can be slow due to DNS resolution and server processing. QuickBang moves all processing to the client side. After your first visit, the JS is cached and redirects happen almost instantly from your device.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Author

[CyberBoyAyush](https://github.com/cyberboyayush)

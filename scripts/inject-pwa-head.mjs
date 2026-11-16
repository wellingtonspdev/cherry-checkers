import fs from 'node:fs';
import path from 'node:path';

const indexPath = path.join(process.cwd(), 'dist', 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html não encontrado.');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

html = html.replace('<html lang="en">', '<html lang="pt-BR">');

const pwaHeadTags = `
    <meta name="theme-color" content="#4A1022" />
    <meta name="description" content="Cherry Checkers — Damas Brasileiras contra a CPU ou 2 jogadores locais." />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Cherry Checkers" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />`;

if (!html.includes('rel="manifest"')) {
  html = html.replace('</head>', `${pwaHeadTags}\n  </head>`);
}

const swRegisterScript = `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').catch(function () {});
        });
      }
    </script>`;

if (!html.includes("register('/sw.js')")) {
  html = html.replace('</body>', `${swRegisterScript}\n  </body>`);
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('PWA head tags e Service Worker injetados em dist/index.html.');

import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'win12-code');
const target = path.join(root, 'www');

const copiedEntries = [
  '404.html',
  'apps',
  'base.css',
  'bg-dark.svg',
  'bg.svg',
  'bios.html',
  'bluescreen.html',
  'boot.html',
  'bootstrap-icons.css',
  'data',
  'desktop.css',
  'desktop.html',
  'desktop.js',
  'fonts',
  'games',
  'icon',
  'img',
  'index.html',
  'lang',
  'mainpage.html',
  'media',
  'module',
  'pwa',
  'reload.html',
  'scripts',
  'shutdown.html',
  'sw.js',
  'tauri'
];

async function assertSubmoduleReady() {
  const entries = await readdir(source).catch(() => []);
  if (!entries.includes('index.html')) {
    throw new Error('win12-code is empty. Run: git submodule update --init --recursive');
  }
}

async function copyWeb() {
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });

  for (const entry of copiedEntries) {
    await cp(path.join(source, entry), path.join(target, entry), {
      recursive: true,
      force: true,
      dereference: true
    });
  }

  await cp(path.join(root, 'mobile'), path.join(target, 'mobile'), {
    recursive: true,
    force: true
  });

  await writeMobileIndex();
  await rewriteAbsoluteUrls();
  await injectMobileAssets();
}

async function writeMobileIndex() {
  await cp(path.join(target, 'index.html'), path.join(target, 'landing.html'), {
    force: true
  });

  await writeFile(
    path.join(target, 'index.html'),
    [
      '<!doctype html>',
      '<html lang="zh-CN">',
      '<head>',
      '  <meta charset="utf-8">',
      '  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">',
      '  <title>Win12 Mobile</title>',
      '  <link rel="stylesheet" href="./mobile/mobile.css">',
      '  <style>',
      '    html, body { height: 100%; margin: 0; background: #000; color: #fff; }',
      '    body { display: grid; place-items: center; font: 14px system-ui, sans-serif; }',
      '  </style>',
      '</head>',
      '<body>',
      '  <span>Starting Win12...</span>',
      '  <script type="module" src="./mobile/mobile-bridge.js"></script>',
      '  <script>location.replace("./boot.html");</script>',
      '</body>',
      '</html>',
      ''
    ].join('\n')
  );
}

async function rewriteAbsoluteUrls() {
  const replacements = [
    {
      file: 'module/apps.js',
      from: 'https://win12-online.github.io/win12/games/minesweeper.html',
      to: './games/minesweeper.html'
    },
    {
      file: 'desktop.html',
      from: 'https://win12-online.github.io/win12/desktop.html',
      to: './desktop.html'
    },
    {
      file: 'landing.html',
      from: 'https://win12-online.github.io/win12/boot.html',
      to: './boot.html'
    }
  ];

  for (const replacement of replacements) {
    const filePath = path.join(target, replacement.file);
    const text = await readFile(filePath, 'utf8');
    await writeFile(filePath, text.split(replacement.from).join(replacement.to));
  }
}

async function injectMobileAssets() {
  const htmlFiles = [
    '404.html',
    'bios.html',
    'bluescreen.html',
    'boot.html',
    'desktop.html',
    'index.html',
    'landing.html',
    'mainpage.html',
    'reload.html',
    'shutdown.html'
  ];

  for (const file of htmlFiles) {
    const htmlPath = path.join(target, file);
    let html = await readFile(htmlPath, 'utf8');

    if (!html.includes('mobile/mobile.css')) {
      html = html.replace(
        /<\/head>/i,
        '  <link rel="stylesheet" href="./mobile/mobile.css">\n</head>'
      );
    }

    if (!html.includes('mobile/mobile-bridge.js')) {
      html = html.replace(
        /<\/body>/i,
        '  <script type="module" src="./mobile/mobile-bridge.js"></script>\n</body>'
      );
    }

    await writeFile(htmlPath, html);
  }
}

await assertSubmoduleReady();
await copyWeb();

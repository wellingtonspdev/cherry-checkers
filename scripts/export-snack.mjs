import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET = path.join(ROOT, 'snack-sdk54');

const FILES_TO_COPY = [
  'App.js',
  'tela1.js',
  'tela2.js',
  'tela3.js',
  'tela4.js',
];

const DIRS_TO_COPY = ['src'];

function copyRecursive(srcPath, destPath) {
  const stat = fs.statSync(srcPath);
  if (stat.isDirectory()) {
    if (path.basename(srcPath) === '__tests__') {
      return;
    }
    fs.mkdirSync(destPath, { recursive: true });
    for (const entry of fs.readdirSync(srcPath)) {
      copyRecursive(path.join(srcPath, entry), path.join(destPath, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
  }
}

if (fs.existsSync(TARGET)) {
  fs.rmSync(TARGET, { recursive: true, force: true });
}
fs.mkdirSync(TARGET, { recursive: true });

for (const file of FILES_TO_COPY) {
  const srcFile = path.join(ROOT, file);
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, path.join(TARGET, file));
  }
}

for (const dir of DIRS_TO_COPY) {
  const srcDir = path.join(ROOT, dir);
  if (fs.existsSync(srcDir)) {
    copyRecursive(srcDir, path.join(TARGET, dir));
  }
}

const snackPackageJson = {
  name: 'cherry-checkers',
  version: '1.0.0',
  main: 'App.js',
  dependencies: {
    expo: '~54.0.0',
    'expo-status-bar': '~3.0.8',
    react: '19.1.0',
    'react-native': '0.81.5',
    '@react-navigation/native': '^7.1.0',
    '@react-navigation/native-stack': '^7.2.0',
    'react-native-screens': '~4.16.0',
    'react-native-safe-area-context': '~5.6.0',
  },
  private: true,
};

fs.writeFileSync(
  path.join(TARGET, 'package.json'),
  `${JSON.stringify(snackPackageJson, null, 2)}\n`,
  'utf8'
);

const snackAppJson = {
  expo: {
    name: 'Cherry Checkers',
    slug: 'cherry-checkers',
    version: '1.0.0',
    orientation: 'portrait',
    backgroundColor: '#4A1022',
  },
};

fs.writeFileSync(
  path.join(TARGET, 'app.json'),
  `${JSON.stringify(snackAppJson, null, 2)}\n`,
  'utf8'
);

const manifestDoc = `# SNACK_MANIFEST — Cherry Checkers (Expo SDK 54)

- **Destino:** https://snack.expo.dev/@wellingtonsp.de/cherry-checkers
- **SDK:** Expo ~54.0.0
- **Arquivos incluídos:** \`App.js\`, \`tela1.js\`, \`tela2.js\`, \`tela3.js\`, \`tela4.js\`, \`src/\`
- **Dependências:**
  - \`@react-navigation/native\`
  - \`@react-navigation/native-stack\`
  - \`react-native-screens\`
  - \`react-native-safe-area-context\`
  - \`expo-status-bar\`
`;

fs.writeFileSync(path.join(TARGET, 'SNACK_MANIFEST.md'), manifestDoc, 'utf8');

console.log('snack-sdk54 gerado com sucesso.');

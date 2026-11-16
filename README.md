# Cherry Checkers

Jogo de damas brasileiras (8×8, 12 peças por jogador) desenvolvido em React Native + Expo, com identidade visual da família Cherry.

## Funcionalidades

- **4 telas com React Navigation (`@react-navigation/native-stack`):**
  - `tela1.js` — Boas-vindas
  - `tela2.js` — Instruções ilustradas das regras brasileiras
  - `tela3.js` — Partida local para dois jogadores
  - `tela4.js` — Créditos
- **Motor de regras brasileiras puro (`src/game/`):**
  - Movimento diagonal e dama voadora
  - Captura obrigatória (inclusive para trás por pedras comuns)
  - Capturas múltiplas com remoção apenas ao término da sequência
  - Lei da Maioria global
  - Coroação apenas ao finalizar o lance na última fileira
  - Vitória por eliminação, bloqueio ou desistência; empates por repetição tripla, regra de 20 lances (40 meios-lances) e finais reduzidos (CODEX CBD)
- **Experiência:** cronômetro, placar de capturas e vitórias na sessão, efeitos sonoros Web Audio / feedback tátil opcional, modais de confirmação e acessibilidade.

## Versões Expo

- **Principal (GitHub / Web):** Expo SDK 58 (`~58.0.25`), React 19.3, React Native 0.88.1
- **Espelho acadêmico (`snack-sdk54/`):** Expo SDK 54 (`~54.0.0`), React 19.1, React Native 0.81.5

## Como executar

```bash
npm ci
npx expo start
```

### Build Web (produção)

```bash
npm run export:web
```

### Testes unitários

```bash
npm test -- --runInBand
```

### Sincronizar espelho Snack SDK 54

```bash
npm run export:snack
```

import { CPU_DIFFICULTIES } from '../constants';
import { searchBestSequence } from './search';

export const DIFFICULTY_PROFILES = {
  [CPU_DIFFICULTIES.EASY]: {
    id: CPU_DIFFICULTIES.EASY,
    label: 'Fácil',
    description: 'Ideal para aprender as regras.',
    maxDepth: 2,
    timeBudgetMs: 60,
    useQuiescence: false,
    useTT: false,
    simpleEval: true,
    topKRandom: 3,
    randomTolerance: 120,
  },
  [CPU_DIFFICULTIES.MEDIUM]: {
    id: CPU_DIFFICULTIES.MEDIUM,
    label: 'Médio',
    description: 'Equilíbrio entre tática e acessibilidade.',
    maxDepth: 4,
    timeBudgetMs: 180,
    useQuiescence: false,
    useTT: false,
    simpleEval: false,
    topKRandom: 2,
    randomTolerance: 25,
  },
  [CPU_DIFFICULTIES.HARD]: {
    id: CPU_DIFFICULTIES.HARD,
    label: 'Difícil',
    description: 'Calcula capturas e defende a base.',
    maxDepth: 6,
    timeBudgetMs: 600,
    useQuiescence: true,
    useTT: true,
    simpleEval: false,
    topKRandom: 1,
    randomTolerance: 0,
  },
  [CPU_DIFFICULTIES.MASTER]: {
    id: CPU_DIFFICULTIES.MASTER,
    label: 'Mestre',
    description: 'Busca profunda com tabela de transposição.',
    maxDepth: 9,
    timeBudgetMs: 1100,
    useQuiescence: true,
    useTT: true,
    simpleEval: false,
    topKRandom: 1,
    randomTolerance: 0,
  },
};

export function getDifficultyProfile(difficulty) {
  return DIFFICULTY_PROFILES[difficulty] || DIFFICULTY_PROFILES[CPU_DIFFICULTIES.MEDIUM];
}

export function chooseCpuSequence(game, difficulty) {
  const profile = getDifficultyProfile(difficulty || game.cpuConfig?.difficulty);
  return searchBestSequence(game, profile);
}

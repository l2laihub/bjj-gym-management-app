import { BeltRank } from '../utils/beltUtils';

export interface Technique {
  id: string;
  name: string;
  description: string;
  category: 'Guard' | 'Mount' | 'Side Control' | 'Back Control' | 'Takedowns' | 'Submissions';
  beltLevel: BeltRank;
  videoUrl?: string;
  status: 'not_started' | 'learning' | 'mastered';
}

export const mockTechniques: Technique[] = [
  {
    id: '1',
    name: 'Armbar from Guard',
    description: 'Basic armbar submission from closed guard position',
    category: 'Guard',
    beltLevel: 'white',
    videoUrl: 'https://example.com/armbar',
    status: 'mastered'
  },
  {
    id: '2',
    name: 'Triangle Choke',
    description: 'Triangle choke submission from guard',
    category: 'Guard',
    beltLevel: 'white',
    videoUrl: 'https://example.com/triangle',
    status: 'learning'
  },
  {
    id: '3',
    name: 'Kimura from Side Control',
    description: 'Kimura shoulder lock from side control position',
    category: 'Side Control',
    beltLevel: 'white',
    videoUrl: 'https://example.com/kimura',
    status: 'not_started'
  },
  {
    id: '4',
    name: 'Double Leg Takedown',
    description: 'Basic double leg takedown',
    category: 'Takedowns',
    beltLevel: 'white',
    videoUrl: 'https://example.com/doubleleg',
    status: 'learning'
  },
  {
    id: '5',
    name: 'Spider Guard Sweep',
    description: 'Basic spider guard sweep',
    category: 'Guard',
    beltLevel: 'blue',
    videoUrl: 'https://example.com/spiderguard',
    status: 'not_started'
  },
  {
    id: '6',
    name: 'Berimbolo',
    description: 'Advanced guard inversion technique',
    category: 'Guard',
    beltLevel: 'purple',
    videoUrl: 'https://example.com/berimbolo',
    status: 'not_started'
  },
  {
    id: '7',
    name: 'Back Take from Turtle',
    description: 'Taking the back from turtle position',
    category: 'Back Control',
    beltLevel: 'blue',
    videoUrl: 'https://example.com/backtake',
    status: 'learning'
  },
  {
    id: '8',
    name: 'Cross Collar Choke from Mount',
    description: 'Basic cross collar choke from mount position',
    category: 'Mount',
    beltLevel: 'white',
    videoUrl: 'https://example.com/crosscollar',
    status: 'mastered'
  }
];

export interface UserProgress {
  userId: string;
  beltRank: BeltRank;
  stripes: number;
  monthsAtCurrentBelt: number;
  classesAttended: number;
  techniquesLearned: number;
  techniquesInProgress: number;
}

export const mockUserProgress: UserProgress = {
  userId: '1',
  beltRank: 'white',
  stripes: 2,
  monthsAtCurrentBelt: 6,
  classesAttended: 48,
  techniquesLearned: 5,
  techniquesInProgress: 3
};

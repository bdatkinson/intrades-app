export type Trade = 'Electrical' | 'Plumbing' | 'Carpentry' | 'HVAC' | 'Welding'
export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type Week = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type ChallengeType = 'quiz' | 'checklist' | 'upload' | 'game'

export type QuizQuestion = {
  id: string
  prompt: string
  options: string[]
  answer: number // index into options
}

export type Challenge = {
  id: number
  title: string
  summary: string
  trade: Trade
  difficulty: Difficulty
  week?: Week
  type?: ChallengeType
  xp?: number
  badge?: string
  quiz?: { questions: QuizQuestion[] }
  checklist?: { items: { id: string; label: string }[] }
  uploads?: { files: { id: string; label: string; accept?: string }[]; note?: string }
  game?: { kind: 'expense-match' }
}

export const CHALLENGES: Challenge[] = [
  // Existing skill challenges (practice)
  { id: 1, title: 'Wire a 3-way switch', summary: 'Control one light from two switches using 14/3 cable.', trade: 'Electrical', difficulty: 'Medium' },
  { id: 2, title: 'Solder a copper tee', summary: 'Clean, flux, and solder a watertight 1/2" copper tee.', trade: 'Plumbing', difficulty: 'Easy' },
  { id: 3, title: 'Frame a rough opening', summary: 'Frame a door opening with jack and king studs to spec.', trade: 'Carpentry', difficulty: 'Medium' },
  { id: 4, title: 'Brazed HVAC joint', summary: 'Brazing copper tubing with nitrogen purge for clean joints.', trade: 'HVAC', difficulty: 'Hard' },
  { id: 5, title: 'Stick weld lap joint', summary: 'Weld a 3/16" lap joint with E6011, proper penetration.', trade: 'Welding', difficulty: 'Medium' },
  { id: 6, title: 'GFCI outlet install', summary: 'Install and test a GFCI receptacle with line/load.', trade: 'Electrical', difficulty: 'Easy' },

  // Week 1 – Foundations & Legal
  {
    id: 101,
    week: 1,
    type: 'checklist',
    xp: 50,
    badge: 'Name Chosen',
    title: 'Choose a business name',
    summary: 'Pick a unique name and check basic availability.',
    trade: 'Carpentry',
    difficulty: 'Easy',
    checklist: {
      items: [
        { id: 'name-idea', label: 'Brainstorm 3–5 name ideas' },
        { id: 'state-search', label: 'Check state business name availability' },
        { id: 'domain-check', label: 'Check domain availability (e.g. .com)' },
      ],
    },
  },
  {
    id: 102,
    week: 1,
    type: 'upload',
    xp: 100,
    badge: 'LLC Filed',
    title: 'LLC filing proof upload',
    summary: 'Upload your state filing confirmation / receipt.',
    trade: 'Carpentry',
    difficulty: 'Medium',
    uploads: {
      note: 'Upload files only; actual upload pipeline to S3 coming soon.',
      files: [
        { id: 'llc-confirm', label: 'LLC confirmation PDF (or screenshot)', accept: '.pdf,.png,.jpg' },
        { id: 'state-receipt', label: 'State payment receipt', accept: '.pdf,.png,.jpg' },
      ],
    },
  },
  {
    id: 103,
    week: 1,
    type: 'upload',
    xp: 80,
    badge: 'EIN Obtained',
    title: 'EIN proof upload',
    summary: 'Upload your IRS EIN assignment letter.',
    trade: 'Carpentry',
    difficulty: 'Easy',
    uploads: {
      files: [{ id: 'ein-letter', label: 'IRS EIN letter (CP 575)', accept: '.pdf,.png,.jpg' }],
    },
  },
  {
    id: 104,
    week: 1,
    type: 'quiz',
    xp: 60,
    badge: 'Foundations Ready',
    title: 'Foundations quiz',
    summary: 'Quick check on legal basics (LLC, EIN, DBA).',
    trade: 'Carpentry',
    difficulty: 'Easy',
    quiz: {
      questions: [
        { id: 'q1', prompt: 'What does EIN stand for?', options: ['Employer Identification Number', 'Estimated Income Number', 'Entity ID Number', 'Employment Insurance Number'], answer: 0 },
        { id: 'q2', prompt: 'Which is a common legal structure for small trades businesses?', options: ['C‑Corp', 'LLC', 'S‑Corp only', 'Nonprofit'], answer: 1 },
      ],
    },
  },

  // Week 2 – Banking & Finance
  {
    id: 201,
    week: 2,
    type: 'checklist',
    xp: 60,
    badge: 'Banked',
    title: 'Open business checking',
    summary: 'Gather docs and open a business checking account.',
    trade: 'Carpentry',
    difficulty: 'Easy',
    checklist: {
      items: [
        { id: 'docs', label: 'Gather LLC docs + EIN letter' },
        { id: 'appointment', label: 'Schedule opening appointment or apply online' },
        { id: 'debit', label: 'Get debit card + online access' },
      ],
    },
  },
  {
    id: 202,
    week: 2,
    type: 'checklist',
    xp: 60,
    badge: 'Books Ready',
    title: 'Bookkeeping setup',
    summary: 'Create a bookkeeping account and connect bank feeds.',
    trade: 'Carpentry',
    difficulty: 'Medium',
    checklist: {
      items: [
        { id: 'tool', label: 'Choose a bookkeeping tool' },
        { id: 'connect', label: 'Connect bank feeds' },
        { id: 'chart', label: 'Review starter chart of accounts' },
      ],
    },
  },
  {
    id: 203,
    week: 2,
    type: 'game',
    xp: 50,
    badge: 'Expense Ace',
    title: 'Expense Category Match',
    summary: 'Drag‑and‑drop expenses into the right categories (stub).',
    trade: 'Carpentry',
    difficulty: 'Easy',
    game: { kind: 'expense-match' },
  },
]

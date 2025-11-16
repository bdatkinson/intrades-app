export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type Category = 'Foundation' | 'Technical' | 'Marketing' | 'Operations' | 'Mastery'

export type Submission =
  | { type: 'upload'; accept?: string }

export type Challenge = {
  id: number
  title: string
  summary: string
  difficulty: Difficulty
  category?: Category
  submission?: Submission
}

// Unified real-world milestone challenges (no trade distinctions)
export const CHALLENGES: Challenge[] = [
  {
    id: 101,
    title: 'Form your LLC',
    summary: 'Register a legal business entity (LLC or equivalent) in your state.',
    difficulty: 'Medium',
    category: 'Foundation',
    submission: { type: 'upload', accept: 'application/pdf,image/*' },
  },
  {
    id: 102,
    title: 'Register a domain',
    summary: 'Choose and register a professional domain for your business.',
    difficulty: 'Easy',
    category: 'Marketing',
    submission: { type: 'upload', accept: 'image/*,application/pdf' },
  },
  {
    id: 103,
    title: 'Launch a simple website',
    summary: 'Publish a one-page site with services, contact, and brand basics.',
    difficulty: 'Medium',
    category: 'Marketing',
    submission: { type: 'upload', accept: 'image/*,application/pdf' },
  },
  {
    id: 104,
    title: 'Obtain insurance quotes',
    summary: 'Get at least two quotes for general liability (and workers’ comp if needed).',
    difficulty: 'Easy',
    category: 'Operations',
    submission: { type: 'upload', accept: 'application/pdf,image/*' },
  },
  {
    id: 105,
    title: 'Estimate your first job',
    summary: 'Prepare a professional estimate including scope, materials, and labor.',
    difficulty: 'Medium',
    category: 'Operations',
    submission: { type: 'upload', accept: 'application/pdf,image/*' },
  },
  {
    id: 106,
    title: 'Create your first SOP',
    summary: 'Document a repeatable process (e.g., site walkthrough or cleanup checklist).',
    difficulty: 'Easy',
    category: 'Mastery',
    submission: { type: 'upload', accept: 'application/pdf' },
  },
]

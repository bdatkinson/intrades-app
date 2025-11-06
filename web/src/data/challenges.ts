export type Trade = 'Electrical' | 'Plumbing' | 'Carpentry' | 'HVAC' | 'Welding'
export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type Challenge = {
  id: number
  title: string
  summary: string
  trade: Trade
  difficulty: Difficulty
}

export const CHALLENGES: Challenge[] = [
  { id: 1, title: 'Wire a 3-way switch', summary: 'Control one light from two switches using 14/3 cable.', trade: 'Electrical', difficulty: 'Medium' },
  { id: 2, title: 'Solder a copper tee', summary: 'Clean, flux, and solder a watertight 1/2" copper tee.', trade: 'Plumbing', difficulty: 'Easy' },
  { id: 3, title: 'Frame a rough opening', summary: 'Frame a door opening with jack and king studs to spec.', trade: 'Carpentry', difficulty: 'Medium' },
  { id: 4, title: 'Brazed HVAC joint', summary: 'Brazing copper tubing with nitrogen purge for clean joints.', trade: 'HVAC', difficulty: 'Hard' },
  { id: 5, title: 'Stick weld lap joint', summary: 'Weld a 3/16" lap joint with E6011, proper penetration.', trade: 'Welding', difficulty: 'Medium' },
  { id: 6, title: 'GFCI outlet install', summary: 'Install and test a GFCI receptacle with line/load.', trade: 'Electrical', difficulty: 'Easy' },
]

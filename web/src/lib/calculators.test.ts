import { describe, it, expect } from 'vitest'
import { calcLaborBurden, toPercent, markupFromMargin, marginFromMarkup, round2 } from './calculators'

describe('calculators', () => {
  it('labor burden basic', () => {
    const res = calcLaborBurden({
      baseWage: 25,
      fica: toPercent(7.65),
      futa: toPercent(0.6),
      suta: toPercent(1.5),
      workersComp: toPercent(3),
      benefits: toPercent(10),
      overhead: toPercent(15),
    })
    expect(res.baseWage).toBe(25)
    expect(res.total).toBeGreaterThan(25)
    expect(res.burdenPerHour).toBeCloseTo(res.total - 25, 2)
  })

  it('markup/margin round-trip', () => {
    const m = 0.3
    const u = markupFromMargin(m)
    const back = marginFromMarkup(u)
    expect(round2(back)).toBe(round2(m))
  })
})

export type Percent = number // e.g. 0.0765 for 7.65%

export function toPercent(val: number): Percent {
  // If user passes 7.65 assume percent, convert to 0.0765
  return val > 1 ? val / 100 : val
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}

// Labor burden calculator (simplified):
// total = baseWage + baseWage * (fica + futa + suta + workersComp + benefits + overhead)
export function calcLaborBurden(params: {
  baseWage: number // hourly
  fica: Percent
  futa: Percent
  suta: Percent
  workersComp: Percent
  benefits: Percent
  overhead: Percent
}) {
  const { baseWage } = params
  const loadPct =
    params.fica +
    params.futa +
    params.suta +
    params.workersComp +
    params.benefits +
    params.overhead

  const burdenPerHour = baseWage * loadPct
  const total = baseWage + burdenPerHour
  return {
    baseWage: round2(baseWage),
    burdenPerHour: round2(burdenPerHour),
    total: round2(total),
    loadPct: round2(loadPct),
  }
}

// Markup/Margin conversions
// margin = profit / price, markup = profit / cost
// Given margin m, markup = m / (1 - m)
// Given markup u, margin = u / (1 + u)
export function markupFromMargin(margin: Percent): number {
  if (margin >= 1) return Infinity
  return margin / (1 - margin)
}

export function marginFromMarkup(markup: number): Percent {
  return markup / (1 + markup)
}

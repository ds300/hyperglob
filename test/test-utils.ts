export class Random {
  constructor(private _seed: number) {}

  random(n: number = Number.MAX_SAFE_INTEGER) {
    this._seed = (this._seed * 9301 + 49297) % 233280
    // float is a number between 0 and 1
    const float = this._seed / 233280
    return Math.floor(float * n)
  }

  execOneOf<Result>(choices: Array<(() => any) | { weight: number; do: () => any }>): Result {
    type Choice = (typeof choices)[number]
    const getWeightFromChoice = (choice: Choice) => ('weight' in choice ? choice.weight : 1)
    const totalWeight = Object.values(choices).reduce(
      (total, choice) => total + getWeightFromChoice(choice),
      0,
    )
    const randomWeight = this.random(totalWeight)
    let weight = 0
    for (const choice of Object.values(choices)) {
      weight += getWeightFromChoice(choice)
      if (randomWeight < weight) {
        return 'do' in choice ? choice.do() : choice()
      }
    }
    throw new Error('unreachable')
  }

  useOneOf<Elem>(items: readonly Elem[]): Elem {
    return items[this.random(items.length)]
  }
}

export type Dir = { [fileName: string]: File }
export type File = string | Dir | undefined

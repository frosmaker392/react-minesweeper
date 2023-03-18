// https://www.petermorlion.com/iterating-a-typescript-enum/
function enumKeys<O extends Record<string, unknown>, K extends keyof O = keyof O> (obj: O): K[] {
  return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[]
}

export default enumKeys

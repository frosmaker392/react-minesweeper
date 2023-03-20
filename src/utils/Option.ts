export type Option<T> = T | undefined

export const mapOption = <A, B>(option: Option<A>, mapper: (t: A) => B): Option<B> => {
  if (option === undefined) return undefined

  return mapper(option)
}

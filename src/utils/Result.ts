export interface OkResult<T> {
  ok: true
  value: T
}

export interface ErrorResult {
  ok: false
  error: string
}

export type Result<T> = OkResult<T> | ErrorResult

export const okResult = <T>(value: T): OkResult<T> => ({
  ok: true,
  value
})

export const errorResult = (error: string): ErrorResult => ({
  ok: false,
  error
})

export const mapResult = <A, B>(result: Result<A>, mapper: (value: A) => B): Result<B> => {
  if (!result.ok) return result

  return {
    ok: true,
    value: mapper(result.value)
  }
}

export const getResultValue = <T>(result: Result<T>): T => (result as OkResult<T>).value

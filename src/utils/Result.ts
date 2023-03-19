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

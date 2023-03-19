export type Result<T> = {
  ok: true
  value: T
} | {
  ok: false
  error: string
}

export const resultOk = <T>(value: T): Result<T> => ({
  ok: true,
  value
})

export const resultError = <T>(error: string): Result<T> => ({
  ok: false,
  error
})

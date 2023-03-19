import { describe, expect, test } from 'vitest'
import { type OkResult, okResult, errorResult, type ErrorResult } from './Result'

describe('Result', () => {
  describe('okResult', () => {
    test('returns an OkResult<T> object', () => {
      const value = 'test'
      expect(okResult(value)).toEqual<OkResult<string>>({
        ok: true,
        value
      })
    })
  })

  describe('errorResult', () => {
    test('returns an ErrorResult object', () => {
      const error = 'error message'
      expect(errorResult(error)).toEqual<ErrorResult>({
        ok: false,
        error
      })
    })
  })
})

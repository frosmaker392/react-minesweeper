import { describe, expect, test } from 'vitest'
import { mapOption } from './Option'

describe('Option', () => {
  describe('mapOption', () => {
    test('returns undefined for an undefined', () => {
      expect(mapOption<string, string>(undefined, () => 'test')).toBeUndefined()
    })

    test('returns mapped option', () => {
      expect(mapOption('test', message => message.length)).toBe(4)
    })
  })
})

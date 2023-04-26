import { describe, expect, test } from 'vitest'
import { determineDifficulty } from './boardPresets'
import type { BoardPresets } from './types'
import type { BoardParams } from '../types'

const presetFactory = (value: number): BoardParams => ({
  width: value,
  height: value,
  mineCount: value,
})

const boardPresets: BoardPresets = {
  beginner: presetFactory(0),
  intermediate: presetFactory(1),
  advanced: presetFactory(2),
}

describe('Menu functions', () => {
  describe('determineDifficulty', () => {
    test('returns matching difficulty for a board preset', () => {
      expect(determineDifficulty(boardPresets.beginner, boardPresets)).toEqual(
        'beginner'
      )
      expect(
        determineDifficulty(boardPresets.intermediate, boardPresets)
      ).toEqual('intermediate')
      expect(determineDifficulty(boardPresets.advanced, boardPresets)).toEqual(
        'advanced'
      )
    })

    test('returns "custom" if no board preset matches', () => {
      expect(determineDifficulty(presetFactory(8), boardPresets)).toEqual(
        'custom'
      )
    })
  })
})

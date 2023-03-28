import { describe, expect, test } from 'vitest'
import type { BoardParams } from '../board/types'
import { determineDifficulty, getBoardParams } from './boardPresetsFunctions'
import type { BoardPresets } from './types'

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

describe('Board presets functions', () => {
  describe('getBoardParams', () => {
    test('returns corresponding board params from board presets object', () => {
      expect(getBoardParams('beginner', boardPresets)).toEqual(
        boardPresets.beginner
      )
      expect(getBoardParams('intermediate', boardPresets)).toEqual(
        boardPresets.intermediate
      )
      expect(getBoardParams('advanced', boardPresets)).toEqual(
        boardPresets.advanced
      )
    })
  })

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

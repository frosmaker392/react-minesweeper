import { describe, expect, test } from 'vitest'
import type { BoardParams } from '../board/types'
import boardSetupReducer, {
  boardPresets,
  cacheCustomPreset,
  setDifficulty,
  updateBoardParams,
} from './boardSetupSlice'
import type { BoardSetup } from './types'

const boardSetup: BoardSetup = {
  currentDifficulty: 'intermediate',
  currentParams: boardPresets.intermediate,
  lastCustomPreset: {
    width: 10,
    height: 5,
    mineCount: 20,
  },
}

describe('boardSetupSlice actions', () => {
  describe('cacheCustomPreset', () => {
    test('caches given board preset in lastCustomPreset', () => {
      const toCache: BoardParams = {
        width: 12,
        height: 12,
        mineCount: 15,
      }
      const result = boardSetupReducer(boardSetup, cacheCustomPreset(toCache))
      expect(result).toEqual({
        ...boardSetup,
        lastCustomPreset: toCache,
      })
    })
  })

  describe('setDifficulty', () => {
    test('sets currentParams to the correct board preset given by difficulty', () => {
      const resultBeginner = boardSetupReducer(
        boardSetup,
        setDifficulty('beginner')
      )
      const resultIntermediate = boardSetupReducer(
        boardSetup,
        setDifficulty('intermediate')
      )
      const resultAdvanced = boardSetupReducer(
        boardSetup,
        setDifficulty('advanced')
      )

      expect(resultBeginner).toEqual({
        ...boardSetup,
        currentDifficulty: 'beginner',
        currentParams: boardPresets.beginner,
      })
      expect(resultIntermediate).toEqual({
        ...boardSetup,
        currentDifficulty: 'intermediate',
        currentParams: boardPresets.intermediate,
      })
      expect(resultAdvanced).toEqual({
        ...boardSetup,
        currentDifficulty: 'advanced',
        currentParams: boardPresets.advanced,
      })
    })

    test('sets currentParams as lastCustomPreset with "custom" difficulty', () => {
      expect(boardSetupReducer(boardSetup, setDifficulty('custom'))).toEqual({
        ...boardSetup,
        currentDifficulty: 'custom',
        currentParams: boardSetup.lastCustomPreset,
      })
    })
  })

  describe('updateBoardParams', () => {
    test('sets currentDifficulty to "custom" and updates other params', () => {
      const boardParams: BoardParams = {
        width: 80,
        height: 80,
        mineCount: 12,
      }

      expect(
        boardSetupReducer(boardSetup, updateBoardParams(boardParams))
      ).toEqual({
        currentDifficulty: 'custom',
        currentParams: boardParams,
        lastCustomPreset: boardParams,
      })
    })
  })
})

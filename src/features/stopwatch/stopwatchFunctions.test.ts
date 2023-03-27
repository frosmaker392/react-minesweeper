import { describe, expect, test } from 'vitest'
import { createStopwatch, togglePause, update } from './stopwatchFunctions'
import type { Stopwatch } from './types'

const stopwatch: Stopwatch = {
  referenceTimestamp: 1680000000000,
  elapsedMs: 0,
  isPaused: true,
}

describe('Stopwatch functions', () => {
  describe('createStopwatch', () => {
    test('returns initial state of a stopwatch', () => {
      expect(createStopwatch(stopwatch.referenceTimestamp)).toEqual(stopwatch)
    })
  })

  describe('update', () => {
    test('returns same stopwatch state if paused', () => {
      expect(update(stopwatch.referenceTimestamp + 1000)(stopwatch)).toEqual(
        stopwatch
      )
    })

    test('returns updated stopwatch state if not paused', () => {
      const duration = 1000
      const getTimestamp = stopwatch.referenceTimestamp + duration
      const runningStopwatch: Stopwatch = {
        ...stopwatch,
        isPaused: false,
        elapsedMs: 2000,
      }

      expect(update(getTimestamp)(runningStopwatch)).toEqual<Stopwatch>({
        referenceTimestamp: getTimestamp,
        elapsedMs: runningStopwatch.elapsedMs + duration,
        isPaused: false,
      })
    })
  })

  describe('togglePause', () => {
    const toggleTimestamp = stopwatch.referenceTimestamp + 1000
    const toggle = togglePause(toggleTimestamp)

    test('returns paused stopwatch with updated timestamp and elapsedMs if unpaused', () => {
      const runningStopwatch: Stopwatch = { ...stopwatch, isPaused: false }
      expect(toggle(runningStopwatch)).toEqual<Stopwatch>({
        referenceTimestamp: toggleTimestamp,
        elapsedMs: 1000,
        isPaused: true,
      })
    })

    test('returns unpaused stopwatch if paused', () => {
      expect(toggle(stopwatch)).toEqual<Stopwatch>({
        referenceTimestamp: toggleTimestamp,
        elapsedMs: 0,
        isPaused: false,
      })
    })
  })
})

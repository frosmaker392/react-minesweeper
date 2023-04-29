import { describe, expect, test } from 'vitest'
import { create, setIsPaused, update } from './stopwatchFunctions'
import type { Stopwatch } from './types'

const stopwatch: Stopwatch = {
  referenceTimestamp: 1680000000000,
  elapsedMs: 0,
  isPaused: true,
}

describe('Stopwatch functions', () => {
  describe('create', () => {
    test('returns initial state of a stopwatch', () => {
      expect(create(() => stopwatch.referenceTimestamp)).toEqual(stopwatch)
    })
  })

  describe('update', () => {
    test('returns same stopwatch state if paused', () => {
      expect(
        update(() => stopwatch.referenceTimestamp + 1000)(stopwatch)
      ).toEqual(stopwatch)
    })

    test('returns updated stopwatch state if not paused', () => {
      const duration = 1000
      const updateTimestamp = stopwatch.referenceTimestamp + duration
      const runningStopwatch: Stopwatch = {
        ...stopwatch,
        isPaused: false,
        elapsedMs: 2000,
      }

      expect(
        update(() => updateTimestamp)(runningStopwatch)
      ).toEqual<Stopwatch>({
        referenceTimestamp: updateTimestamp,
        elapsedMs: runningStopwatch.elapsedMs + duration,
        isPaused: false,
      })
    })
  })

  describe('setPause', () => {
    const when = () => stopwatch.referenceTimestamp + 1000
    const pause = setIsPaused(when)

    describe('if current stopwatch is paused', () => {
      test('returns same paused stopwatch if isPaused is true', () => {
        expect(pause(true)(stopwatch)).toEqual<Stopwatch>(stopwatch)
      })

      test('returns unpaused stopwatch with updated referenceTimestamp otherwise', () => {
        expect(pause(false)(stopwatch)).toEqual<Stopwatch>({
          referenceTimestamp: when(),
          elapsedMs: stopwatch.elapsedMs,
          isPaused: false,
        })
      })
    })

    describe('if current stopwatch is unpaused', () => {
      const runningStopwatch: Stopwatch = { ...stopwatch, isPaused: false }

      test('returns paused stopwatch with updated timestamp and elapsedMs if isPaused is true', () => {
        expect(pause(true)(runningStopwatch)).toEqual<Stopwatch>({
          referenceTimestamp: when(),
          elapsedMs: when() - runningStopwatch.referenceTimestamp,
          isPaused: true,
        })
      })

      test('returns same unpaused stopwatch otherwise', () => {
        expect(pause(false)(runningStopwatch)).toEqual<Stopwatch>(
          runningStopwatch
        )
      })
    })
  })
})

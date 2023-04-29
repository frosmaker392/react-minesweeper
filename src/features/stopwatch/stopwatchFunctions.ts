import * as B from 'fp-ts/lib/boolean'
import { pipe } from 'fp-ts/lib/function'
import type { Stopwatch } from './types'

export const create = (when: () => number): Stopwatch => ({
  referenceTimestamp: when(),
  elapsedMs: 0,
  isPaused: true,
})

export const update =
  (when: () => number) =>
  (stopwatch: Stopwatch): Stopwatch => {
    const now = when()
    return pipe(
      stopwatch.isPaused,
      B.match(
        () =>
          ({
            referenceTimestamp: now,
            elapsedMs:
              stopwatch.elapsedMs + (now - stopwatch.referenceTimestamp),
            isPaused: false,
          } satisfies Stopwatch),
        () => stopwatch
      )
    )
  }

export const setIsPaused =
  (when: () => number) =>
  (isPaused: boolean) =>
  (stopwatch: Stopwatch): Stopwatch => {
    const previouslyPaused = stopwatch.isPaused
    const now = when()

    const referenceTimestamp = B.match(
      () => stopwatch.referenceTimestamp,
      () => now
    )((isPaused && !previouslyPaused) || (!isPaused && previouslyPaused))

    const elapsedMs = B.match(
      () => stopwatch.elapsedMs,
      () => stopwatch.elapsedMs + (now - stopwatch.referenceTimestamp)
    )(isPaused && !previouslyPaused)

    return {
      referenceTimestamp,
      elapsedMs,
      isPaused,
    }
  }

import * as B from 'fp-ts/lib/boolean'
import { pipe } from 'fp-ts/lib/function'
import type { Stopwatch } from './types'

export const createStopwatch = (creationTimestamp: number): Stopwatch => ({
  referenceTimestamp: creationTimestamp,
  elapsedMs: 0,
  isPaused: true,
})

export const update =
  (updateTimestamp: number) =>
  (stopwatch: Stopwatch): Stopwatch =>
    pipe(
      stopwatch.isPaused,
      B.match(
        () =>
          ({
            referenceTimestamp: updateTimestamp,
            elapsedMs:
              stopwatch.elapsedMs +
              (updateTimestamp - stopwatch.referenceTimestamp),
            isPaused: false,
          } satisfies Stopwatch),
        () => stopwatch
      )
    )

export const togglePause =
  (toggleTimestamp: number) =>
  (stopwatch: Stopwatch): Stopwatch =>
    pipe(
      stopwatch.isPaused,
      B.match<Stopwatch>(
        // Pause
        () => ({
          referenceTimestamp: toggleTimestamp,
          elapsedMs:
            stopwatch.elapsedMs +
            (toggleTimestamp - stopwatch.referenceTimestamp),
          isPaused: true,
        }),
        // Unpause
        () => ({
          referenceTimestamp: toggleTimestamp,
          elapsedMs: stopwatch.elapsedMs,
          isPaused: false,
        })
      )
    )

import React, { useRef, useEffect, useState } from 'react'
import { BoardLogic, type IBoard, type BoardState } from '../utils/BoardLogic'
import enumKeys from '../utils/enumKeys'

import { Cell, Corner } from './Cell'

import '../styles/Board.css'

type Coord = [number, number]

interface IBoardProps extends IBoard {
  resetCounter: number
  onUpdate: (state: BoardState, flagCount: number) => void
}

function isRevealedAt(board: BoardLogic, [x, y]: [number, number]): boolean {
  if (x < 0 || y < 0 || x >= board.width || y >= board.height) {
    return false
  }

  return board.at([x, y]).state === 'revealed'
}

const cornerOffsetMap: Record<Corner, Coord> = {
  [Corner.TopLeft]: [-1, -1],
  [Corner.TopRight]: [1, -1],
  [Corner.BottomLeft]: [-1, 1],
  [Corner.BottomRight]: [1, 1],
}

const Board: React.FC<IBoardProps> = (props) => {
  const { width, height, numMines } = props
  const { resetCounter, onUpdate } = props

  const ref = useRef<HTMLDivElement>(null)

  const [elemWidth, setElemWidth] = useState(0)
  const [board, setBoard] = useState(
    () => new BoardLogic(width, height, numMines)
  )
  const [isLost, setIsLost] = useState(false)

  // Creates a routine which updates elemWidth of the ref
  // every 100 ms
  useEffect(() => {
    const resizeRoutine = setInterval(() => {
      if (ref.current != null) {
        setElemWidth(ref.current.offsetWidth)
      }
    }, 100)
    return () => {
      clearInterval(resizeRoutine)
    }
  }, [])

  // Run onUpdate on each board change, passing board state
  useEffect(() => {
    setIsLost(board.state() === 'lost')
    onUpdate(board.state(), board.flagCount())
  }, [board, onUpdate])

  // Reset board if any of the params change
  useEffect(() => {
    setBoard(new BoardLogic(width, height, numMines))
  }, [resetCounter, width, height, numMines])

  const rows = board.cells.map((rowCells, y) => {
    const row = rowCells.map((cell, x) => {
      const cornersToRound = enumKeys(Corner)
        .filter((c) => {
          if (c === undefined) return false
          const [xOff, yOff] = cornerOffsetMap[Corner[c]]

          return (
            isRevealedAt(board, [x + xOff, y]) &&
            isRevealedAt(board, [x, y + yOff])
          )
        })
        .reduce((acc, corner) => acc | Corner[corner], 0)

      return (
        <Cell
          cellParams={cell}
          revealMine={isLost}
          fontSize={(elemWidth / board.width) * 0.5}
          key={x}
          roundCorners={cornersToRound}
          onClick={() => {
            setBoard(board.reveal([x, y]))
          }}
          onRightClick={() => {
            setBoard(board.mark([x, y]))
          }}
        />
      )
    })

    return (
      <div key={y} className="board-row">
        {row}
      </div>
    )
  })

  return (
    <div ref={ref} className="board">
      {rows}
    </div>
  )
}

export default Board

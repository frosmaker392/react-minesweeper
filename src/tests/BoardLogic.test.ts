import { BoardLogic } from '../utils/BoardLogic'

describe('Board', () => {
  describe('constructor', () => {
    it('creates a board with the right dimensions', () => {
      const board = new BoardLogic(10, 7, 5)

      expect(board.width).toBe(10)
      expect(board.height).toBe(7)
      expect(board.numMines).toBe(5)
      expect(board.initialized).toBe(false)

      expect(board.cells.length).toBe(7)
      expect(board.cells[0].length).toBe(10)
      board.cells.forEach((row) => {
        expect(row.length).toBe(10)
      })
    })

    it('limits numMines to half the total number of squares', () => {
      const board = new BoardLogic(4, 5, 19)

      expect(board.numMines).toBe(10)
    })
  })

  describe('mark', () => {
    it('does nothing if board is uninitialized', () => {
      const board = new BoardLogic(10, 7, 5).mark([2, 3])

      expect(board.at([2,2]).state).toBe('hidden')
    })

    it('cycles through all the states for an unrevealed cell', () => {
      let board = new BoardLogic(10, 7, 5)

      board.initialized = true

      const toEval = ['flagged', 'unknown', 'hidden']
      for (let i = 0; i < 4; i++) {
        const expectedState = toEval[i % 3]
        board = board.mark([1,1])
        expect(board.at([1,1]).state).toBe(expectedState)
      }
      
      expect(board.at([1,2]).state).toBe('hidden')
    })

    it('does not change the state of revealed cells', () => {
      let board = new BoardLogic(10, 7, 5)

      board.initialized = true

      board.at([3,1]).state = 'revealed'
      for (let i = 0; i < 4; i++) {
        board = board.mark([1,3])
        expect(board.at([3,1]).state).toBe('revealed')
      }
    })
  })

  describe('reveal', () => {
    describe('init', () => {
      const checkRevealed = (board: BoardLogic, coords: [number, number]) => {
        const cell = board.at(coords)
        expect(cell.hasMine).toBe(false)
        expect(cell.state).toBe('revealed')
      }

      it('randomly installs mines to all except the cell and its neighbors, then reveals it', () => {
        const board = new BoardLogic(5, 5, 5).reveal([2,2])
        
        expect(board.initialized).toBe(true)
        const coordsToEval: [number, number][] = [
          [1,1], [2,1], [3,1],
          [1,2], [2,2], [3,2],
          [1,3], [2,3], [3,3],
        ]

        // Neighboring cells must be revealed
        coordsToEval.forEach(coords => checkRevealed(board, coords))
      })

      it('works on the edges', () => {
        const board = new BoardLogic(5,5,5).reveal([4,4])

        expect(board.initialized).toBe(true)
        const coordsToEval: [number, number][] = [
          [3,3], [3,4], [4,3], [4,4]
        ]

        coordsToEval.forEach(coords => checkRevealed(board, coords))
      })
    })

    describe('post-init', () => {
      let board: BoardLogic

      beforeEach(() => {
        board = new BoardLogic(5, 5, 5)
        board.initialized = true
      })

      it('does not reveal flagged cells', () => {
        board = board.mark([2, 2]).reveal([2,2])
        expect(board.at([2,2]).state).toBe('flagged')
      })

      it('reveals a normal cell and sets the number of neighboring mines', () => {
        board.at([1,1]).hasMine = true
        board.at([1,2]).hasMine = true
        board.at([1,3]).hasMine = true
        
        board = board.reveal([2,2])
        expect(board.at([2,2]).state).toBe('revealed')
        expect(board.at([2,2]).neighboringMines).toBe(3)
      })

      it('propagationally reveals cells with n. mines == n. flags', () => {
        board.at([2,2]).hasMine = true
        board.at([3,2]).hasMine = true

        board = board.mark([2,2]).mark([3,2]).reveal([0,0])
        for (let x = 0; x < 5; x++) {
          for (let y = 0; y < 5; y++) {
            if ((x === 2 || x === 3) && y === 2) continue

            expect(board.at([x,y]).state).toBe('revealed')
            expect(board.at([x,y]).neighboringMines).toBeLessThanOrEqual(2)
          }
        }
      })
  
      it('reveals a cell with a mine', () => {
        board.at([2,2]).hasMine = true
  
        board = board.reveal([2,2])
        expect(board.cells[2][2].state).toBe('revealed')
      })
    })
  })

  describe('state', () => {
    let board: BoardLogic

    beforeEach(() => {
      board = new BoardLogic(5,5,5)

      board.initialized = true
      for (let x = 0; x < 5; x++)
        board.at([x,2]).hasMine = true
    })

    it('starts "uninitialized"', () => {
      const board = new BoardLogic(5,5,5)
      expect(board.state()).toEqual('uninitialized')
    })

    it('is "won" when all mines are flagged and other cells are revealed', () => {
      // Flag all cells with mines and reveal those without
      for (let x = 0; x < 5; x++)
        board = board.mark([x,2])
      
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          if (y === 2) continue
          board = board.reveal([x,y])
        }
      }
      
      expect(board.state()).toBe('won')
    })

    it('is "lost" when at least one mine is revealed', () => {
      board = board.reveal([1,2])
      expect(board.state()).toBe('lost')
    })

    it('is "in-progress" when otherwise', () => {
      board = board.reveal([0,1])
      expect(board.state()).toBe('in-progress')

      // Incorrectly placed flags
      board = board.mark([0,2]).mark([1,2]).mark([2,4])
                .mark([3,2]).mark([4,2])
      expect(board.state()).toBe('in-progress')
    })
  })

  describe('flagCount', () => {
    it('returns the correct amount of flags', () => {
      let board = new BoardLogic(5,5,5)
      board.initialized = true

      expect(board.flagCount()).toBe(0)

      board = board.mark([1,2]).mark([2,3]).mark([3,4])
      expect(board.flagCount()).toBe(3)

      // Not limited by number of mines
      board = board.mark([1,0]).mark([2,0]).mark([3,0]).mark([4,0])
      expect(board.flagCount()).toBe(7)

      // 'Unknown' cells are not counted
      board = board.mark([1,0]).mark([2,0])
      expect(board.flagCount()).toBe(5)
    })
  })
})

export {}
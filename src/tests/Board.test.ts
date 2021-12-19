import { BoardLogic } from '../utils/BoardLogic'

describe("Board", () => {
  describe("constructor", () => {
    it("creates a board with the right dimensions", () => {
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

    it("limits numMines to half the total number of squares", () => {
      const board = new BoardLogic(4, 5, 19)

      expect(board.numMines).toBe(10)
    })
  })

  describe("mark", () => {
    it("does nothing if board is uninitialized", () => {
      let board = new BoardLogic(10, 7, 5).mark([2, 3])

      expect(board.at([2,2]).state).toBe("hidden")
    })

    it("cycles through all the states for an unrevealed cell", () => {
      let board = new BoardLogic(10, 7, 5)

      board.initialized = true

      const toEval = ["flagged", "unknown", "hidden"]
      for (let i = 0; i < 4; i++) {
        const expectedState = toEval[i % 3]
        board = board.mark([1,1])
        expect(board.at([1,1]).state).toBe(expectedState)
      }
      
      expect(board.at([1,2]).state).toBe("hidden")
    })

    it("does not change the state of revealed cells", () => {
      let board = new BoardLogic(10, 7, 5)

      board.initialized = true

      board.at([3,1]).state = "revealed"
      for (let i = 0; i < 4; i++) {
        board = board.mark([1,3])
        expect(board.at([3,1]).state).toBe("revealed")
      }
    })
  })

  describe("reveal", () => {
    describe("init", () => {
      it("randomly installs mines to all except the cell and its neighbours, then reveals it", () => {
        let board = new BoardLogic(5, 5, 5).reveal([2,2])
        
        expect(board.initialized).toBe(true)
        const coordsToEval: [number, number][] = [
          [1,1], [2,1], [3,1],
          [1,2], [2,2], [3,2],
          [1,3], [2,3], [3,3],
        ]

        // Cell neighbours must be revealed
        coordsToEval.forEach(coords => {
          const cell = board.at(coords)
          expect(cell.hasMine).toBe(false)
          expect(cell.state).toBe("revealed")
        });
      })

      it("works on the edges", () => {
        let board = new BoardLogic(5,5,5).reveal([4,4])

        expect(board.initialized).toBe(true)
        const coordsToEval: [number, number][] = [
          [3,3], [3,4], [4,3], [4,4]
        ]

        coordsToEval.forEach(coords => {
          const cell = board.at(coords)
          expect(cell.hasMine).toBe(false)
          expect(cell.state).toBe("revealed")
        });
      })
    })

    describe("post-init", () => {
      it("does not reveal flagged cells", () => {
        let board = new BoardLogic(5, 5, 5)
        board.initialized = true

        board = board.mark([2, 2]).reveal([2,2])
        expect(board.at([2,2]).state).toBe("flagged")
      })

      it("reveals a normal cell and sets the number of neighbouring mines", () => {
        let board = new BoardLogic(5, 5, 5)

        board.initialized = true
        board.at([1,1]).hasMine = true
        board.at([1,2]).hasMine = true
        board.at([1,3]).hasMine = true
        
        board = board.reveal([2,2])
        expect(board.at([2,2]).state).toBe("revealed")
        expect(board.at([2,2]).neighboringMines).toBe(3)
      })
  
      it("reveals a cell with a mine", () => {
        let board = new BoardLogic(5, 5, 5)
  
        board.initialized = true
        board.at([2,2]).hasMine = true
  
        board = board.reveal([2,2])
        expect(board.cells[2][2].state).toBe("revealed")
      })
    })
  })
})

export {}
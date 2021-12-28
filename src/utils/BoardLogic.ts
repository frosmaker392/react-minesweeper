type Coords = [number, number]
type CellState = "hidden" | "revealed" | "flagged" | "unknown"
type BoardState = "uninitialized" | "in-progress" | "won" | "lost"

interface ICell {
  state: CellState
  hasMine: boolean
  neighboringMines: number
}

interface IBoard {
  width: number
  height: number
  numMines: number
}

class BoardLogic implements IBoard {
  width: number
  height: number
  numMines: number
  cells: ICell[][]
  initialized: boolean

  /**
   * Creates a new Minesweeper board with the specified sizes.
   * @param width Width of the board
   * @param height Height of the board
   * @param numMines Number of mines 
   */
  constructor(width: number, height: number, numMines: number) {
    this.width = width
    this.height = height
    this.numMines = Math.min(width * height / 2, numMines)
    this.initialized = false

    // Initialize cells array
    this.cells = []
    for (let y = 0; y < height; y++) {
      const row: ICell[] = []
      for (let x = 0; x < width; x++) {
        row.push({ 
          state: "hidden",
          hasMine: false,
          neighboringMines: -1
        })
      }
      this.cells.push(row)
    }
  }

  public copy(): BoardLogic {
    const board = new BoardLogic(this.width, this.height, this.numMines)

    board.cells = this.cells.map((row) => {
      return row.map((cell) => { return {...cell} })
    })
    board.initialized = this.initialized

    return board
  }

  public at([x, y]: Coords): ICell {
    return this.cells[y][x]
  }

  /**
   * Marks the cell by cycling through the states
   * (hidden -> flagged -> unknown -> hidden).
   * 
   * Does nothing if board is not initialized
   * @param coords Coordinates of the cell to be marked
   */
  public mark(coords: Coords): BoardLogic {
    if (!this.initialized || this.at(coords).state === "revealed") 
      return this
    let newBoard = this.copy()

    const cell = newBoard.at(coords)
    switch (cell.state) {
      case "hidden":
        cell.state = "flagged"
        break
      case "flagged":
        cell.state = "unknown"
        break
      case "unknown":
        cell.state = "hidden"
        break
      default:
        break
    }

    return newBoard
  }

  /**
   * Reveals the cell. If the board is uninitialized, then
   * mines are installed (except the current cell) before revealing.
   * 
   * If the cell is already revealed and the number of flagged cells
   * match the number of mines surrounding it, then it reveals the rest
   * of the neighbours.
   * @param coords Coordinates of the cell to be revealed
   */
  public reveal(coords: Coords): BoardLogic {
    if (this.at(coords).state === "flagged") return this
    let newBoard = this.copy()
    
    if (!newBoard.initialized) { 
      newBoard.installMines(coords)
      newBoard.initialized = true
    }

    // BFS
    const queue = [coords]
    while (queue.length > 0) {
      const next = queue.pop() ?? coords
      const neighbors = newBoard.getNeighbors(next)

      const nMines = neighbors
        .filter(nCoords => newBoard.at(nCoords).hasMine)
        .length
      const nFlags = neighbors
        .filter(nCoords => newBoard.at(nCoords).state === "flagged")
        .length

      newBoard.at(next).state = "revealed"
      newBoard.at(next).neighboringMines = nMines

      if (nFlags === nMines) {
        neighbors
          .filter(nCoords => newBoard.at(nCoords).state === "hidden")
          .forEach(nCoords => {
            queue.push(nCoords)
          })
      }
    }
    newBoard.at(coords).state = "revealed"

    return newBoard
  }

  /**
   * Checks whether the win or lose condition is met
   * @returns board state enumerated as BoardState
   */
  public state(): BoardState {
    if (!this.initialized) return "uninitialized"
      
    let hasWon = true
    let hasLost = false

    for (const row of this.cells) {
      for (const cell of row) {
        hasWon = hasWon && (cell.hasMine ? 
                  cell.state === "flagged" : cell.state === "revealed")
        hasLost = hasLost || (cell.hasMine && cell.state === "revealed")
      }
    }

    if (hasWon) return "won"
    if (hasLost) return "lost"
    return "in-progress"
  }

  /**
   * Counts the number of cells marked as flagged
   * @returns number of flagged cells, not limited by number of mines
   */
  public flagCount(): number {
    return this.cells.reduce((cnt, row) => (
      cnt + row.reduce((rowCnt, cell) => (
        rowCnt + (+(cell.state === "flagged"))
      ), 0)
    ), 0)
  }

  private installMines(except: Coords) {
    const toIgnore = [except, ...this.getNeighbors(except)]
    const rndIndex = (n: number) => Math.floor(Math.random() * n)

    let n = 0
    while (n < this.numMines) {
      const [xr, yr] = [rndIndex(this.width), rndIndex(this.height)]

      if (toIgnore.some(([x, y]) => x === xr && y === yr)) continue

      this.at([xr, yr]).hasMine = true
      toIgnore.push([xr, yr])
      n++
    }
  }

  private getNeighbors([x, y]: Coords): Coords[] {
    if (this.outOfRange([x, y])) return []

    const offsets = [
      [-1,-1],  [0,-1], [1,-1],
      [-1,0],           [1,0],  
      [-1,1],   [0,1],  [1,1]]

    return offsets
      .map(([x_off, y_off]) => [x + x_off, y + y_off] as Coords)
      .filter((coords) => !this.outOfRange(coords))
  }

  private outOfRange([x, y]: Coords) {
    return x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1
  }

  public debug() {
    console.log(
      this.cells.map(row => 
        row.map(cell => `${cell.state === "revealed" ? 'X' : 'O'}`).join(" "))
      .join("\n")
    )
  }
}

export { BoardLogic }
export type { ICell, IBoard, BoardState }
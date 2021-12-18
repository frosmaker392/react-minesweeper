type Coords = [number, number]
type CellState = "hidden" | "revealed" | "flagged" | "unknown"

interface ICell {
  state: CellState
  hasMine: boolean
  neighbouringMines: number
}

class BoardLogic {
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
          neighbouringMines: -1
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

  /**
   * Marks the cell by cycling through the states
   * (hidden -> flagged -> unknown -> hidden).
   * 
   * Does nothing if board is not initialized
   * @param coords Coordinates of the cell to be marked
   */
  public mark([x, y]: Coords): BoardLogic {
    if (!this.initialized || this.cells[y][x].state === "revealed") 
      return this
    let newBoard = this.copy()

    const cell = newBoard.cells[y][x]
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
  public reveal([x, y]: Coords): BoardLogic {
    let newBoard = this.copy()
    
    if (!newBoard.initialized) { 
      newBoard.installMines([x, y])
      newBoard.initialized = true
    }

    // BFS
    const queue = [[x,y]]
    while (queue.length > 0) {
      const [xi, yi] = queue.pop() ?? [x, y]
      const neighbours = newBoard.getNeighbours([xi, yi])

      const nMines = neighbours
        .filter(([xn, yn]) => newBoard.cells[yn][xn].hasMine)
        .length
      const nFlags = neighbours
        .filter(([xn, yn]) => newBoard.cells[yn][xn].state === "flagged")
        .length

      newBoard.cells[yi][xi].state = "revealed"
      newBoard.cells[yi][xi].neighbouringMines = nMines

      if (nFlags === nMines) {
        neighbours
          .filter(([xn, yn]) => newBoard.cells[yn][xn].state === "hidden")
          .forEach(([xn, yn]) => {
            queue.push([xn, yn])
          })
      }
    }
    newBoard.cells[y][x].state = "revealed"

    return newBoard
  }

  private installMines(except: Coords) {
    const toIgnore = [except, ...this.getNeighbours(except)]
    let n = 0
    while (n < this.numMines) {
      const rndIndex = (n: number) => Math.floor(Math.random() * n)
      const [xr, yr] = [rndIndex(this.width), rndIndex(this.height)]

      if (toIgnore.some(([x, y]) => x === xr && y === yr)) continue

      this.cells[yr][xr].hasMine = true
      toIgnore.push([xr, yr])
      n++
    }
  }

  private getNeighbours([x, y]: Coords): Coords[] {
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
      this.cells.map((row) => 
        row.map((cell) => `${cell.state === "revealed" ? 'X' : 'O'}`).join(" "))
      .join("\n")
    )
  }
}

export { BoardLogic }
export type { ICell }
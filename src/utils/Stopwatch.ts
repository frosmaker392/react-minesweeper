class Stopwatch {
  private lastRefTime = Date.now()
  private runningMs = 0
  private isPaused = true

  public get elapsedMs(): number {
    if (!this.isPaused) {
      this.runningMs += Date.now() - this.lastRefTime
      this.lastRefTime = Date.now()
    }

    return this.runningMs
  }
  
  public pause(): void {
    this.runningMs += Date.now() - this.lastRefTime
    this.isPaused = true
  }

  public startOrResume(): void {
    this.lastRefTime = Date.now()
    this.isPaused = false
  }

  public reset(): void {
    this.lastRefTime = Date.now()
    this.runningMs = 0
    this.isPaused = true
  }
}

export default Stopwatch
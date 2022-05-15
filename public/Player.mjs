class Player {
  id = "";
  currentPosition = [0, 0];
  score = 0;

  constructor({ x, y, score, id }) {
    this.id = id;
    this.currentPosition = [x, y];
    this.score = score;
  }

  movePlayer(dir, speed) {
    if (dir) {
      const [x, y] = this.currentPosition;
      if (dir === "up") {
        this.currentPosition = [x, y - 1];
      }
      if (dir === "down") {
        this.currentPosition = [x, y + 1];
      }
      if (dir === "left") {
        this.currentPosition = [x - 1, y];
      }
      if (dir === "right") {
        this.currentPosition = [x + 1, y];
      }
    }
  }

  collision(item) {}

  calculateRank(arr) {}

  position() {
    return this.currentPosition;
  }
}

export default Player;

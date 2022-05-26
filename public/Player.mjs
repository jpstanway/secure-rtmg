class Player {
  id = "";
  x = 0;
  y = 0;
  score = 0;

  constructor({ x, y, score, id }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.score = score;
  }

  movePlayer(dir, speed) {
    if (dir) {
      if (dir === "up") {
        this.y -= speed;
      }
      if (dir === "down") {
        this.y += speed;
      }
      if (dir === "left") {
        this.x -= speed;
      }
      if (dir === "right") {
        this.x += speed;
      }
    }
  }

  collision(item) {
    this.score += item.value;
  }

  calculateRank(arr) {
    arr.sort((a, b) => a.score - b.score);
    const rank = arr.findIndex((m) => m.id === this.id) + 1;
    return rank;
  }
}

export default Player;

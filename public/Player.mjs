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
    if (dir.size > 0) {
      const cmd = Array.from(dir).join(" ");

      if (cmd === "up") {
        this.y -= speed;
      }
      if (cmd === "down") {
        this.y += speed;
      }
      if (cmd === "left") {
        this.x -= speed;
      }
      if (cmd === "right") {
        this.x += speed;
      }
      if (cmd === "up right" || cmd === "right up") {
        this.y -= speed;
        this.x += speed;
      }
      if (cmd === "up left" || cmd === "left up") {
        this.y -= speed;
        this.x -= speed;
      }
      if (cmd === "down right" || cmd === "right down") {
        this.y += speed;
        this.x += speed;
      }
      if (cmd === "down left" || cmd === "left down") {
        this.y += speed;
        this.x -= speed;
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

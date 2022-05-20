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

  collision(item) {}

  calculateRank(arr) {}
}

export default Player;

class Player {
  constructor({ x, y, score, id }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.score = score;
  }

  movePlayer(dir, speed) {
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
    if (dir === "up right" || dir === "right up") {
      this.y -= speed;
      this.x += speed;
    }
    if (dir === "up left" || dir === "left up") {
      this.y -= speed;
      this.x -= speed;
    }
    if (dir === "down right" || dir === "right down") {
      this.y += speed;
      this.x += speed;
    }
    if (dir === "down left" || dir === "left down") {
      this.y += speed;
      this.x -= speed;
    }
  }

  collision(item) {
    this.score += item.value;
    return true;
  }

  calculateRank(arr) {
    arr.sort((a, b) => b.score - a.score);
    const rank = arr.findIndex((m) => m.id === this.id) + 1;

    return `Rank: ${rank} / ${arr.length}`;
  }
}

export default Player;

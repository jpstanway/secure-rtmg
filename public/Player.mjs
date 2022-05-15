class Player {
  id = "";
  currentPosition = [0, 0];
  score = 0;

  constructor({ x, y, score, id }) {
    this.id = id;
    this.currentPosition = [x, y];
    this.score = score;
  }

  movePlayer(dir, speed) {}

  collision(item) {}

  calculateRank(arr) {}
}

export default Player;

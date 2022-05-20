class Collectible {
  id = "";
  x = 0;
  y = 0;
  value = 0;

  constructor({ x, y, value, id }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
  }
}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch (e) {}

export default Collectible;

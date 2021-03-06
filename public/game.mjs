import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";
import { generateCrypto } from "./utils.mjs";

const PADDING = 40;
const HEADER_HEIGHT = 70;
const MINER_SIZE = 20;
const MINER_COLOR = "green";
const HELMET_COLOR = "yellow";
const CRYPTO_SIZE = 10;
const CRYPTO_COLOR = "orange";
const DIRECTIONS = {
  87: "up", // w
  65: "left", // a
  83: "down", // s
  68: "right", // d
};
const BASE_SPEED = 7;

const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

const maxX = canvas.width - MINER_SIZE;
const minX = MINER_SIZE;
const maxY = canvas.height - MINER_SIZE;
const minY = HEADER_HEIGHT + MINER_SIZE;
const x = Math.floor(Math.random() * (maxX - minX) + minX);
const y = Math.floor(Math.random() * (maxY - minY) + minY);
const cryptoMaxX = canvas.width - CRYPTO_SIZE;
const cryptoMinX = CRYPTO_SIZE;
const cryptoMaxY = canvas.height - CRYPTO_SIZE;
const cryptoMinY = HEADER_HEIGHT + CRYPTO_SIZE;
let miners = [];
let dir = new Set();
let collected = false;
let miner = null;
let rank = "Rank: N/A";
let crypto = null;

// socket events
const sendCrypto = (stats) => socket.emit("crypto-update", stats);
socket.on("player-connected", (id) => {
  const score = 0;
  miner = new Player({ x, y, score, id });
  // send player data to server
  socket.emit("player-update", { x, y, score, id });
});

socket.on("generate-initial-crypto", () => {
  crypto = new Collectible({
    ...generateCrypto(cryptoMaxX, cryptoMinX, cryptoMaxY, cryptoMinY),
  });
  const { x, y, id, value } = crypto;
  sendCrypto({ x, y, id, value });
});

socket.on("players-stats", (players) => {
  miners = players;
  if (miner) {
    rank = miner.calculateRank(players);
  }
});

// event handlers
const movementHandler = (e) => {
  dir.add(DIRECTIONS[e.which]);

  let speed;

  // wall collision
  if (
    (dir.has("up") && miner.y - MINER_SIZE - BASE_SPEED < HEADER_HEIGHT) ||
    (dir.has("down") && miner.y + MINER_SIZE + BASE_SPEED > canvas.height) ||
    (dir.has("left") && miner.x - MINER_SIZE - BASE_SPEED < 0) ||
    (dir.has("right") && miner.x + MINER_SIZE + BASE_SPEED > canvas.width)
  ) {
    speed = 0;
  } else {
    speed = BASE_SPEED;
  }

  if (dir.size > 0) {
    const cmd = Array.from(dir).join(" ");
    miner.movePlayer(cmd, speed);
  }

  // send new coords to server
  socket.emit("player-update", { x: miner.x, y: miner.y, id: miner.id });
};

const stopHandler = (e) => {
  dir = new Set();
};

const collisionHandler = () => {
  if (miner && crypto && !collected) {
    const touchRight =
      miner.x + MINER_SIZE > crypto.x - CRYPTO_SIZE &&
      miner.x + MINER_SIZE < crypto.x + CRYPTO_SIZE;
    const touchLeft =
      miner.x - MINER_SIZE > crypto.x - CRYPTO_SIZE &&
      miner.x - MINER_SIZE < crypto.x + CRYPTO_SIZE;
    const touchTop =
      miner.y + MINER_SIZE > crypto.y - CRYPTO_SIZE &&
      miner.y + MINER_SIZE < crypto.y + CRYPTO_SIZE;
    const touchBottom =
      miner.y - MINER_SIZE > crypto.y - CRYPTO_SIZE &&
      miner.y - MINER_SIZE < crypto.y + CRYPTO_SIZE;
    const touchQuadrant =
      (touchRight || touchLeft) && (touchTop || touchBottom);
    const touchHorizontal =
      (touchRight || touchLeft) &&
      crypto.y > miner.y - MINER_SIZE &&
      crypto.y < miner.y + MINER_SIZE;
    const touchVertical =
      (touchTop || touchBottom) &&
      crypto.x > miner.x - MINER_SIZE &&
      crypto.x < miner.x + MINER_SIZE;

    if (touchQuadrant || touchHorizontal || touchVertical) {
      collected = true;
      miner.collision(crypto);

      // update server with new score
      socket.emit("player-update", { score: miner.score, id: miner.id });
    }
  }
};

document.addEventListener("keydown", movementHandler, false);
document.addEventListener("keyup", stopHandler, false);

const renderStage = () => {
  // canvas
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // title
  context.fillStyle = "white";
  context.font = "24px sans-serif";
  context.textAlign = "center";
  context.fillText("Crypto Race", canvas.width / 2, PADDING);

  // controls
  context.fillStyle = "white";
  context.font = "18px sans-serif";
  context.textAlign = "left";
  context.fillText("Controls: WASD", PADDING, PADDING);

  // border
  context.strokeStyle = "white";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, 70);
  context.lineTo(canvas.width, HEADER_HEIGHT);
  context.stroke();
  context.closePath();

  // player rank
  context.fillStyle = "white";
  context.font = "18px sans-serif";
  context.textAlign = "right";
  context.fillText(rank, canvas.width - PADDING, PADDING);
};

const renderMiner = () => {
  if (miner) {
    // body
    context.beginPath();
    context.fillStyle = MINER_COLOR;
    context.arc(miner.x, miner.y, MINER_SIZE, 0, Math.PI * 2, true);
    context.fill();
    context.closePath();

    // helmet
    context.beginPath();
    context.strokeStyle = HELMET_COLOR;
    context.moveTo(miner.x - MINER_SIZE - 5, miner.y);
    context.lineTo(miner.x + MINER_SIZE + 5, miner.y);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.fillStyle = HELMET_COLOR;
    context.arc(miner.x, miner.y, MINER_SIZE, 0, Math.PI, true);
    context.fill();
    context.closePath();
  }
};

const renderCrypto = () => {
  if (crypto) {
    if (!collected) {
      context.beginPath();
      context.fillStyle = CRYPTO_COLOR;
      context.arc(crypto.x, crypto.y, CRYPTO_SIZE, 0, Math.PI * 2, true);
      context.fill();
      context.closePath();

      // vertical lines
      context.beginPath();
      context.strokeStyle = CRYPTO_COLOR;

      if (crypto.value === 1) {
        context.moveTo(crypto.x, crypto.y - CRYPTO_SIZE - 5);
        context.lineTo(crypto.x, crypto.y + CRYPTO_SIZE + 5);
      } else if (crypto.value === 2) {
        context.moveTo(crypto.x + 2, crypto.y - CRYPTO_SIZE - 3);
        context.lineTo(crypto.x + 2, crypto.y + CRYPTO_SIZE + 3);
        context.moveTo(crypto.x - 2, crypto.y - CRYPTO_SIZE - 3);
        context.lineTo(crypto.x - 2, crypto.y + CRYPTO_SIZE + 3);
      } else {
        context.moveTo(crypto.x, crypto.y - CRYPTO_SIZE - 5);
        context.lineTo(crypto.x, crypto.y + CRYPTO_SIZE + 5);
        context.moveTo(crypto.x + 5, crypto.y - CRYPTO_SIZE - 3);
        context.lineTo(crypto.x + 5, crypto.y + CRYPTO_SIZE + 3);
        context.moveTo(crypto.x - 5, crypto.y - CRYPTO_SIZE - 3);
        context.lineTo(crypto.x - 5, crypto.y + CRYPTO_SIZE + 3);
      }

      context.stroke();
      context.closePath();
    } else {
      crypto = new Collectible({
        ...generateCrypto(cryptoMaxX, cryptoMinX, cryptoMaxY, cryptoMinY),
      });
      collected = false;
      const { x, y, id, value } = crypto;
      sendCrypto({ x, y, id, value });
    }
  }
};

// main rendering function
const renderer = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  renderStage();
  renderMiner();
  renderCrypto();
  collisionHandler();

  requestAnimationFrame(renderer);
};

renderer();

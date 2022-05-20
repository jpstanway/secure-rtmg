import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";

const PADDING = 40;
const HEADER_HEIGHT = 70;
const MINER_SIZE = 20;
const MINER_COLOR = "green";
const CRYPTO_SIZE = 10;
const CRYPTO_COLOR = "yellow";
const DIRECTIONS = {
  87: "up", // w
  65: "left", // a
  83: "down", // s
  68: "right", // d
};

// const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

const id = String(Math.floor(Math.random() * 100));
const maxX = canvas.width - MINER_SIZE;
const minX = MINER_SIZE;
const maxY = canvas.height - MINER_SIZE;
const minY = HEADER_HEIGHT + MINER_SIZE;
const x = Math.floor(Math.random() * (maxX - minX) + minX);
const y = Math.floor(Math.random() * (maxY - minY) + minY);
const cryptoId = `CR${String(Math.floor(Math.random() * 100))}`;
const cryptoMaxX = canvas.width - CRYPTO_SIZE;
const cryptoMinX = CRYPTO_SIZE;
const cryptoMaxY = canvas.height - CRYPTO_SIZE;
const cryptoMinY = HEADER_HEIGHT + CRYPTO_SIZE;
const cryptoX = Math.floor(
  Math.random() * (cryptoMaxX - cryptoMinX) + cryptoMinX
);
const cryptoY = Math.floor(
  Math.random() * (cryptoMaxY - cryptoMinY) + cryptoMinY
);
let dir = null;
let minerCount = 1;
let score = 1;
let value = 1;
let miner = new Player({ x, y, score, id });
let crypto = new Collectible({ x: cryptoX, y: cryptoY, value, id: cryptoId });

// event handlers
const movementHandler = (e) => {
  dir = DIRECTIONS[e.which];
  miner.movePlayer(dir, 7);
};

const stopHandler = (e) => {
  dir = null;
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
  context.fillText(
    `Rank: ${score} / ${minerCount}`,
    canvas.width - PADDING,
    PADDING
  );
};

const renderMiner = () => {
  context.beginPath();
  context.fillStyle = MINER_COLOR;
  context.arc(miner.x, miner.y, MINER_SIZE, 0, Math.PI * 2, true);
  context.fill();
  context.closePath();
};

const renderCrypto = () => {
  context.beginPath();
  context.fillStyle = CRYPTO_COLOR;
  context.arc(crypto.x, crypto.y, CRYPTO_SIZE, 0, Math.PI * 2, true);
  context.fill();
  context.closePath();
};

// main rendering function
const renderer = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  renderStage();
  renderMiner();
  renderCrypto();

  requestAnimationFrame(renderer);
};

renderer();

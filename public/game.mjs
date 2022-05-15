import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";

const PADDING = 40;
const HEADER_HEIGHT = 70;
const PLAYER_SIZE = 20;
const DIRECTIONS = {
  87: "up", // w
  65: "left", // a
  83: "down", // s
  68: "right", // d
};

// const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

// set canvas styles
context.fillStyle = "black";
context.fillRect(0, 0, canvas.width, canvas.height);

// set text styles
context.fillStyle = "white";

context.font = "24px sans-serif";
context.textAlign = "center";
context.fillText("Crypto Race", canvas.width / 2, PADDING);

context.font = "18px sans-serif";
context.textAlign = "left";
context.fillText("Controls: WASD", PADDING, PADDING);

context.textAlign = "right";
context.fillText("Rank: 2 / 2", canvas.width - PADDING, PADDING);

// create top border
context.strokeStyle = "white";
context.lineWidth = 2;
context.beginPath();
context.moveTo(0, 70);
context.lineTo(canvas.width, HEADER_HEIGHT);
context.stroke();

// spawn character
const spawnPlayer = () => {
  const id = String(Math.floor(Math.random() * 100));
  const maxX = canvas.width - PLAYER_SIZE;
  const minX = PLAYER_SIZE;
  const maxY = canvas.height - PLAYER_SIZE;
  const minY = HEADER_HEIGHT + PLAYER_SIZE;
  const x = Math.floor(Math.random() * (maxX - minX) + minX);
  const y = Math.floor(Math.random() * (maxY - minY) + minY);
  const score = 0;

  // draw new player
  context.beginPath();
  context.arc(x, y, PLAYER_SIZE, 0, Math.PI * 2, true);
  context.stroke();

  return new Player({ x, y, score, id });
};
const player = spawnPlayer();

// player movement
canvas.focus();
const movementHandler = (e) => {
  const dir = DIRECTIONS[e.which];
  player.movePlayer(dir, 1);
  const [x, y] = player.position();
  context.translate(x, y);
  context.strokeStyle = "white";
  context.stroke();

  context.setTransform(1, 0, 0, 1, 0, 0);

  context.strokeStyle = "black";
  context.stroke();
};
canvas.addEventListener("keydown", movementHandler);

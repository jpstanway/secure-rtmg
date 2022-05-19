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

const id = String(Math.floor(Math.random() * 100));
const maxX = canvas.width - PLAYER_SIZE;
const minX = PLAYER_SIZE;
const maxY = canvas.height - PLAYER_SIZE;
const minY = HEADER_HEIGHT + PLAYER_SIZE;
const x = Math.floor(Math.random() * (maxX - minX) + minX);
const y = Math.floor(Math.random() * (maxY - minY) + minY);
let dir = null;
let playerCount = 1;
let score = 1;
let player = new Player({ x, y, score, id });

// event handlers
const movementHandler = (e) => {
  dir = DIRECTIONS[e.which];
  player.movePlayer(dir, 7);
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
    `Rank: ${score} / ${playerCount}`,
    canvas.width - PADDING,
    PADDING
  );
};

const renderPlayer = () => {
  context.beginPath();
  context.arc(player.getX(), player.getY(), PLAYER_SIZE, 0, Math.PI * 2, true);
  context.stroke();
  context.closePath();
};

const renderer = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  renderStage();
  renderPlayer();

  requestAnimationFrame(renderer);
};

renderer();

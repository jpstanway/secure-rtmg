import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";

const PADDING = 40;

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
context.lineTo(canvas.width, 70);
context.stroke();

// spawn character
const spawnPlayer = () => {
  const id = String(Math.floor(Math.random() * 100));
  const x = Math.floor(Math.random() * (canvas.width + 1));
  const y = Math.floor(Math.random() * (canvas.width - 70) + 70);
  const score = 0;
  const player = new Player({ x, y, score, id });

  // draw new player
  context.beginPath();
  context.arc(x, y, 20, 0, Math.PI * 2, true);
  context.stroke();
};

spawnPlayer();

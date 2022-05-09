import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";

// const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

context.fillStyle = "black";
context.fillRect(0, 0, canvas.width, canvas.height);
context.font = "32px sans-serif";
context.fillStyle = "white";
context.fillText("Crypto Race", 220, 40);

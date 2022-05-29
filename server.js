require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expect = require("chai");
const socket = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");

const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");

const app = express();

app.use(helmet.noSniff());
app.use(helmet.noCache());
app.use(helmet.xssFilter());

app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "PHP 7.4.3");
  next();
});

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: "*" }));

// Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log("Tests are not valid:");
        console.error(error);
      }
    }, 1500);
  }
});

// socket config
const io = socket(server);
const collectible = null;
let players = [];

io.sockets.on("connection", (socket) => {
  // generate initial collectible
  if (!collectible) {
    io.emit("generate-initial-crypto");
  }

  players.push({ id: socket.id });

  const sendPlayers = () => {
    io.emit("players-stats", players);
  };

  sendPlayers();

  io.emit("player-connected", socket.id);

  socket.on("player-update", (stats) => {
    let player = players.find((p) => p.id === stats.id);

    player = {
      ...player,
      ...stats,
    };

    players = [...players.filter((n) => n.id !== player.id), player];

    if (stats.score) {
      sendPlayers();
    }
  });

  socket.on("crypto-update", (stats) => {
    crypto = stats;
  });

  socket.on("disconnect", () => {
    players = players.filter((p) => p.id !== socket.id);
  });
});

module.exports = app; // For testing

const path = require("path");

require("dotenv").config();

const express = require("express");
const app = express();
const port = 4000;
const API_KEY = process.env.REACT_APP_API_KEY;

// const cache = new Map();

// get matches info
app.get("/api/match/:id", async (req, res) => {
  const matchId = req.params.id;

  // check if result is in cache
  // if (cache.has(`/api/match/${matchId}`)) {
  //   console.log("Getting result from cache...");
  //   const cachedResult = cache.get(`/api/match/${matchId}`);
  //   return res.send(cachedResult);
  // }

  const response = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`
  );

  const data = await response.json();

  // add result to cache
  // cache.set(`/api/match/${matchId}`, data);

  res.send(data);
});

/////////////////////////////////////////////////////////////////////////////////////////
app.get("/api/:region/:input", async (req, res) => {
  const region = req.params.region;
  const input = req.params.input;
  const resPlayerData = await fetch(
    `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${input}?api_key=${API_KEY}`
  );
  const playerData = await resPlayerData.json();

  // get player rank
  const playerId = playerData.id;
  const resPlayerRank = await fetch(
    `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${playerId}?api_key=${API_KEY}`
  );
  const playerRankData = await resPlayerRank.json();

  // get list of matchesID
  const PUUID = playerData.puuid;
  const resListOfMatchesId = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${PUUID}/ids?api_key=${API_KEY}&count=15`
  );
  const lisOfMatchesIdData = await resListOfMatchesId.json();

  const result = {
    ...playerData,
    rank: playerRankData,
    matches: lisOfMatchesIdData,
  };

  res.send(result);
});

// CLIENT CONTENT
app.use(express.static("public"));

// REACT-ROUTER SETUP
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

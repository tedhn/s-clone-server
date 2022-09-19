const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");

const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3001;

const baseURL = "https://api.spotify.com/v1";

const crendential = {
	redirectUri: "http://127.0.0.1:5173",
	clientId: "fffed6f6f8e0455cb1d56dfeca1f47cd",
	clientSecret: "6a8cec9a3f104cadbd66774d095aab02",
};

let authorized = false;
const spotifyApi = new SpotifyWebApi(crendential);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/login", async (req, res) => {
	
	res.send('aaaaaaaaaaaaaaaaaa login')


});

app.listen(port, () => {
	console.log(`Example app listening on port ${PORT}`);
});

const express = require("express");

const cors = require("cors");
const SpotifyWebApi = require("spotify-web-api-node");

const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3001;

const baseURL = "https://api.spotify.com/v1";

app.use(cors());
app.use(bodyParser());

const crendential = {
	redirectUri: "http://127.0.0.1:5173",
	clientId: "fffed6f6f8e0455cb1d56dfeca1f47cd",
	clientSecret: "6a8cec9a3f104cadbd66774d095aab02",
};

let authorized = false;
let user = {};

const spotifyApi = new SpotifyWebApi(crendential);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/login", async (req, res) => {
	try {
		const { code } = req.body;

		console.log(code);

		const data = await spotifyApi.authorizationCodeGrant(code);

		// localStorage.setItem("SPOTIFY_ACCESS_TOKEN" , data.body['access_token'])
		spotifyApi.setAccessToken(data.body["access_token"]);
		spotifyApi.setRefreshToken(data.body["refresh_token"]);

		console.log(data);

		res.json({ refresh_token: data.body["refresh_token"] });
	} catch (e) {
		console.log(e);
	}
});

app.post("/refreshSession", async (req, res) => {
	try {
		const data = await spotifyApi.refreshAccessToken();

		res.json(data);
	} catch (e) {
		res.json(e);
	}
});

app.get("/me", async (req, res) => {
	const data = await spotifyApi.getMe();
	user = data.body;

	res.json(data.body);
});

app.post("/getUser", async (req, res) => {
	const { userId } = req.body;

	try {
		const { body } = await spotifyApi.getUser(userId);

		res.send(body);
	} catch (e) {
		console.log(e);
	}
});
app.post("/getArtist", async (req, res) => {
	const { artistId } = req.body;

	try {
		const { body } = await spotifyApi.getArtist(artistId);

		res.send(body);
	} catch (e) {
		console.log(e);
	}
});

app.post("/checkTracks", async (req, res) => {
	const { idList } = req.body;

	try {
		const { body } = await spotifyApi.containsMySavedTracks([idList]);

		res.send(body);
	} catch (e) {
		console.log(e);
	}
});

app.post("/search", async (req, res) => {
	const { q } = req.body;

	const { body } = await spotifyApi.search(
		q,
		["album", "artist", "playlist", "track", "show", "episode"],
		{ limit: 5 }
	);

	res.send(body);
});

// PLAYLIST API

app.get("/playlist", async (req, res) => {
	try {
		spotifyApi.getUserPlaylists(user.id).then((data) => {
			res.send(data.body);
		});
	} catch (e) {
		if (e.statusCode === 401) {
			// refreshToken();
		}
	}
});

app.post("/getPlaylistData", async (req, res) => {
	const { playlistId } = req.body;

	const { body } = await spotifyApi.getPlaylist(playlistId);

	res.send(body);
});

app.post("/getPlaylistTracks", async (req, res) => {
	const { playlistId, offset } = req.body;

console.log(req.body)

	const { body } = await spotifyApi.getPlaylistTracks(playlistId, {
		offset: offset,
		limit: 20,
	});

	res.send({ tracks: body.items });
});

app.post("/addToPlaylist", async (req, res) => {
	const { playlistId, song } = req.body;

	try {
		spotifyApi.addTracksToPlaylist(playlistId, [song]);
	} catch (e) {
		console.log(e);
	}
});

// SAVED TRACKS

app.post("/savedTracks", async (req, res) => {
	const { offset } = req.body;

	try {
		const { body } = await spotifyApi.getMySavedTracks({ offset, limit: "20" });

		res.send(body);
	} catch (e) {
		console.log(e);
	}
});

app.post("/removeFromMySavedTracks", async (req, res) => {
	const { id } = req.body;

	try {
		const { body } = await spotifyApi.removeFromMySavedTracks([id]);

		res.json(body);
	} catch (e) {
		console.log(e);
	}
});
app.post("/addToMySavedTracks", async (req, res) => {
	const { id } = req.body;

	try {
		const { body } = await spotifyApi.addToMySavedTracks([id]);

		res.json(body);
	} catch (e) {
		console.log(e);
	}
});

// ALBUMS API

app.post("/getAlbums", async (req, res) => {
	const { id } = req.body;

	try {
		const { body } = await spotifyApi.getAlbum([id]);

		res.json(body);
	} catch (e) {
		console.log(e);
	}
});
app.post("/getAlbumsTracks", async (req, res) => {
	const { id, offset } = req.body;

	try {
		const { body } = await spotifyApi.getAlbumTracks(id, {
			limit: 20,
			offset,
		});

		res.json(body);
	} catch (e) {
		console.log(e);
	}
});

// ARTIST

app.post("/getArtistAlbums", async (req, res) => {
	const { id } = req.body;

	try {
		const { body } = await spotifyApi.getArtistAlbums(id, {
			limit: 5,
		});

		res.json(body);
	} catch (e) {
		console.log(e);
	}
});
app.post("/getArtistTopTracks", async (req, res) => {
	const { id, market } = req.body;

	try {
		const { body } = await spotifyApi.getArtistTopTracks(id, market);

		res.json(body);
	} catch (e) {
		console.log(e);
	}
});
app.post("/getArtistRelatedArtists", async (req, res) => {
	const { id } = req.body;

	try {
		const { body } = await spotifyApi.getArtistRelatedArtists(id);

		res.json(body);
	} catch (e) {
		console.log(e);
	}
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`);
});

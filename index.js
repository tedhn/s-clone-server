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
	const { code } = req.body;

	console.log(code);

	try {
		const data = await spotifyApi.authorizationCodeGrant(code);
		console.log(data);
		spotifyApi.setAccessToken(data.body["access_token"]);
		spotifyApi.setRefreshToken(data.body["refresh_token"]);

		spotifyApi.getMe().then((data) => {
			res.json(data.body);
		});
	} catch (e) {
		console.log(e);
	}
	// try {
	//   if (!authorized) {
	//     authorized = true;
	//     spotifyApi.authorizationCodeGrant(code).then((data) => {
	//       // console.log("The token expires in " + data.body["expires_in"]);
	//       // console.log("The access token is " + data.body["access_token"]);
	//       // console.log("The refresh token is " + data.body["refresh_token"]);

	//       // // Set the access token on the API object to use it in later calls
	//       spotifyApi.setAccessToken(data.body["access_token"]);
	//       spotifyApi.setRefreshToken(data.body["refresh_token"]);

	//       console.log(data.body["access_token"]);

	//       spotifyApi.getMe().then((data) => {
	//         res.json(data.body);
	//       });
	//     });
	//   } else {
	//     spotifyApi.getMe().then((data) => {
	//       res.json(data.body);
	//     });
	//   }
	// } catch (e) {
	//   console.log(e);
	//   if (e.statusCode === 401) refreshToken();
	// }
});

app.listen(port, () => {
	console.log(`Example app listening on port ${PORT}`);
});

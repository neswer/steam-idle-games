const steamUser = require('steam-user');
const steamTotp = require('steam-totp');
const config = require('./config')


if (config.username === "" || config.password === "" || config.gamestoidle === [] || config.status === "" ) {
	console.log("")
	console.log('\x1b[31m[ERROR] \x1b[33mEdit your config.js file before u start the bot!\x1b[37m')
	console.log("")
	process.exit(1)
}

if (config.gamestoidle.length > 32) {
	console.log("")
	console.log('\x1b[31m[ERROR] \x1b[33mYou are only able to idle 32 games at once due to steam limitation... Delete some ID numbers in config to start idling.\x1b[37m')
	console.log("")
	process.exit(1)
}

const username = config.username;
const password = config.password;
const shared_secret = config.shared_secret;
const games = config.gamestoidle;
const status = config.status;

user = new steamUser();
user.logOn({"accountName": username, "password": password, "twoFactorCode": steamTotp.generateAuthCode(shared_secret)});
user.on('loggedOn', () => {
	if (user.steamID != null) console.log(`\n\x1b[32m[SUCCESS] \x1b[37mSuccessfully logged on (${user.steamID})\n`);
	user.setPersona(status);               
	user.gamesPlayed(games);
});

process.on('SIGINT', function () {
	console.log('\x1b[31m[SHUTDOWN] \x1b[37mLogging off and shutting down.')
	process.exit(0)
});
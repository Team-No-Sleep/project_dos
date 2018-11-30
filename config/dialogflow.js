// dependencies
require('dotenv').config()
const dialogflow = require('dialogflow');

// Instantiate a DialogFlow client.
let privateKey = process.env.DIALOGFLOW_PRIVATE_KEY;
let clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL;

let config = {
	credentials: {
		private_key: privateKey,
		client_email: clientEmail
	}
}

module.exports = dialogflow;

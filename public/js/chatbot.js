require('dotenv').config()
var config = require("./config");
const dialogflow = require('dialogflow');

const sessionClient = new dialogflow.SessionsClient(config);
const sessionPath = sessionClient.sessionPath(projectId, sessionId);
const sessionId = '123'; //pull id from mysql?
const languageCode = 'en-US';
const projectId = DIALOGFLOW_PROJECT_ID;
let userQuery = 'I need a job'
const query = userQuery;

// The text query request.
const request = {
	session: sessionPath,
	queryInput: {
		text: {
			text: query,
			languageCode: languageCode,
		},
	},
};

// Send request and log result
sessionClient
	.detectIntent(request)
	.then(responses => {
		console.log('Detected intent');
		const result = responses[0].queryResult;
		console.log(`  Query: ${result.queryText}`);
		console.log(`  Response: ${result.fulfillmentText}`);
		if (result.intent) {
			console.log(`  Intent: ${result.intent.displayName}`);
		} else {
			console.log(`  No intent matched.`);
		}
	})
	.catch(err => {
		console.error('ERROR:', err);
	});
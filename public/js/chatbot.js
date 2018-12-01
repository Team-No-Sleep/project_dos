require('dotenv').config()
const dialogflow = require('dialogflow');


const sessionId = '123'; //pull id from mysql? Needed for a continuous conversation
const languageCode = 'en-US';
let userQuery = 'I need a job'
let queryText=  '';
let fulfillmentText = '';

class DialogFlow {
	constructor (projectId) {
		this.projectId = process.env.DIALOGFLOW_PROJECT_ID
		let privateKey = process.env.DIALOGFLOW_PRIVATE_KEY
		let clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL
		let config = {
			credentials: {
				private_key: privateKey,
				client_email: clientEmail
			}
		}
	
		this.sessionClient = new dialogflow.SessionsClient(config)
	}

	async sendTextMessageToDialogFlow(textMessage, sessionId) {
		const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);
		const request = {
			session: sessionPath,
			queryInput: {
				text: {
					text: textMessage,
					languageCode: languageCode
				}
			}
		}
		try {
			let responses = await this.sessionClient.detectIntent(request)			
			console.log('DialogFlow.sendTextMessageToDialogFlow: Detected intent');
			fulfillmentText = responses[0].queryResult.fulfillmentText;
			queryText = responses[0].queryResult.queryText;
			console.log(`  Query: ${queryText}`);
			console.log(`  Response: ${fulfillmentText}`);
			console.log(responses)
			return responses
		}
		catch(err) {
			console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
			throw err
		}
	}
}
agent = new DialogFlow()
agent.sendTextMessageToDialogFlow(userQuery, sessionId)



// const sessionId = '123'; //pull id from mysql
// const languageCode = 'en-US';
// const projectId = process.env.DIALOGFLOW_PROJECT_ID;
// let query = 'I need a job'

// let config = {
//     credentials: {
//         private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
//         client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
//     }
// }

// const sessionClient = new dialogflow.SessionsClient(config);
// const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// // The text query request.
// const request = {
//     session: sessionPath,
//     queryInput: {
//         text: {
//             text: query,
//             languageCode: languageCode,
//         },
//     },
// };

// // Send request and log result
// sessionClient
//     .detectIntent(request)
//     .then(responses => {
//         console.log('Detected intent');
//         const result = responses[0].queryResult;
//         console.log(` -Query: ${result.queryText}`);
//         console.log(` -Response: ${result.fulfillmentText}`);
//         if (result.intent) {
//             console.log(` -Intent: ${result.intent.displayName}`);
//         } else {
//             console.log(` -No intent matched.`);
//         }
//     })
//     .catch(err => {
//         console.error('ERROR:', err);
//     });
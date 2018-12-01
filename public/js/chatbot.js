require("dotenv").config();
const dialogflow = require("dialogflow");

const sessionId = "123"; //pull id from mysql? Needed for a continuous conversation
const languageCode = "en-US";
let userQuery = "I need a job";
let queryText = "";
let fulfillmentText = "";

class DialogFlow {
  constructor() {
    this.projectId = process.env.DIALOGFLOW_PROJECT_ID;
    let privateKey = process.env.DIALOGFLOW_PRIVATE_KEY;
    let clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL;
    let config = {
      credentials: {
        private_key: privateKey,
        client_email: clientEmail
      }
    };

    this.sessionClient = new dialogflow.SessionsClient(config);
  }

  async sendTextMessageToDialogFlow(textMessage, sessionId) {
    const sessionPath = this.sessionClient.sessionPath(
      this.projectId,
      sessionId
    );
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: textMessage,
          languageCode: languageCode
        }
      }
    };
    try {
      let responses = await this.sessionClient.detectIntent(request);
      fulfillmentText = responses[0].queryResult.fulfillmentText;
      queryText = responses[0].queryResult.queryText;

      console.log("DialogFlow.sendTextMessageToDialogFlow: Detected intent");
      console.log(`  Query: ${queryText}`);
      console.log(`  Response: ${fulfillmentText}`);
      console.log(responses);
      return responses;
    } catch (err) {
      console.error("DialogFlow.sendTextMessageToDialogFlow ERROR:", err);
      throw err;
    }
  }
}

// EXAMPLE USE
// ===========

// Initiate a new clientSession
agent = new DialogFlow();
//userQuery is what the user types in, sessionId is for a continuous conversation
//it will return the var fulfillmentText and var queryText for use in the chatbot ui
agent.sendTextMessageToDialogFlow(userQuery, sessionId);

module.exports = dialogflow;

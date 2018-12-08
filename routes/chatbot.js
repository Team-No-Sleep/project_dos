require("dotenv").config();
const dialogflow = require("dialogflow");
const uuid = require("uuid");
const structJson = require("./structjson");
const clientConfig = {
  credentials: {
    // eslint-disable-next-line camelcase
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    // eslint-disable-next-line camelcase
    client_email: process.env.GOOGLE_CLIENT_EMAIL
  }
};

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function textQuery(input, sessionId) {
  // A unique identifier for the given session
  sessionId = sessionId || uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient(clientConfig);
  const sessionPath = sessionClient.sessionPath(
    process.env.DIALOGFLOW_PROJECT_ID,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: input,
        // The language used by the client (en-US)
        languageCode: "en"
      }
    }
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log("Detected intent");
  const result = responses[0].queryResult;
  console.log(result);
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log("  No intent matched.");
  }
  let jobSearchParams = null;
  if (
    result.intent.displayName === "acknowledge job search - yes" &&
    result.allRequiredParamsPresent === true
  ) {
    jobSearchParams = result.parameters.fields;
  }
  return {
    response: result.fulfillmentText,
    sessionId: sessionId,
    jobSearchParams: jobSearchParams
  };
}

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function eventQuery(input, sessionId, params) {
  // A unique identifier for the given session
  sessionId = sessionId || uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient(clientConfig);
  const sessionPath = sessionClient.sessionPath(
    process.env.DIALOGFLOW_PROJECT_ID,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        // The query to send to the dialogflow agent
        name: input,
        parameters: structJson.jsonToStructProto(params),
        // The language used by the client (en-US)
        languageCode: "en"
      }
    }
  };
  console.log(JSON.stringify(request));

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log("Detected intent");
  const result = responses[0].queryResult;
  console.log(result);
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log("  No intent matched.");
  }
  return {
    response: result.fulfillmentText,
    sessionId: sessionId
  };
}
module.exports = { textQuery, eventQuery };

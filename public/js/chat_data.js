var botui = new BotUI("chat-bot");
registerSocketListener();

fetchBotReply("clientEvent", {
  client: "custom_welcome",
  params: { name: user.name.givenName }
});

//makes call to dialogFlow using socket.io
function registerSocketListener() {
  socket.on("fromServer", function(data) {
    let content =
      data.server !== ""
        ? data.server
        : "We have not set up a response for that intent";
    // receiving a reply from server.
    botui.message
      .update(data.uiMetaData.messageIndex, {
        content: content,
        loading: false
      })
      .then(function() {
        botui.action
          .text({
            delay: 1000,
            action: {
              size: 40,
              placeholder: ""
            }
          })
          .then(function(res) {
            fetchBotReply("fromClient", {
              client: res.value,
              sessionId: data.sessionId
            });
          });
      });
  });
}

//ask dialogFlow to reply
function fetchBotReply(webSocketMessage, messageData) {
  botui.message
    .bot({
      loading: true
    })
    .then(function(index) {
      messageData.uiMetaData = { messageIndex: index };
      socket.emit(webSocketMessage, messageData);
    });
}

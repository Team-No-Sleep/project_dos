var botui = new BotUI("chat-bot");
var socket = io.connect("http://localhost:8010");
registerSocketListener();

botui.message
  .bot({
    loading: true,
    delay: 1000,
    content: `Welcome ${user.name.givenName}!`
  })
  .then(function() {
    socket.emit("clientEvent", {
      client: "custom_welcome",
      params: { name: user.name.givenName }
    });
  });
//makes call to dialogFlow using socket.io
function registerSocketListener() {
  socket.on("fromServer", function(data) {
    let content =
      data.server !== ""
        ? data.server
        : "We have not set up a response for that intent";
    // recieveing a reply from server.
    botui.message
      .add({
        content: content,
        delay: 500
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
            socket.emit("fromClient", {
              client: res.value,
              sessionId: data.sessionId
            });
          });
      });
  });
}

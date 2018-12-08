var botui = new BotUI("chat-bot");
var socket = io.connect("http://localhost:8010");
registerSocketListener();

botui.message
  .bot({
    loading: true,
    delay: 1000,
    content: `Welcome ${user.name.givenName}!`
  })
  // .then(function() {
  //   socket.emit("fromClient", { client: "intiateWelcome" });
  // });
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
        // will be called when a button is clicked.
        console.log(res.value); // will print "one" from 'value'
        botui.message
          .bot({
            loading: true,
            delay: 1000,
            content: "That sounds great!"
          })
          .then(function() {
            // sends the message typed to server
            socket.emit("fromClient", { client: res.value });
          });
      });
  });
//makes call to dialogFlow using socket.io
function registerSocketListener() {
  socket.on("fromServer", function(data) {
    let content =
      data.server !== "" ? data.server : "I am sorry. I don't understand.";
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

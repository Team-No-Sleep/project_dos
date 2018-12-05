var botui = new BotUI('hello-world');
var agent = require("./chatbot");
agent.sendTextMessageToDialogFlow("hello", sessionId);

botui.message.add({
    content: 'Hello World from bot!'
}).then(function () { // wait till previous message has been shown.

    botui.message.add({
        delay: 1000,
        human: true,
        content: 'Hello World from human!'
    });

    botui.message.add({
        type: 'embed', // this is 'text' by default
        content: 'https://www.youtube.com/embed/ZRBH5vHhm4c'
    });

    botui.message.add({
        delay: 3000,
        loading: true
    }).then(function (index) {
        // do some stuff like ajax, etc.

        botui.message.update(index, {
            loading: false,
            content: 'Hello, this is a message.'
        });
    });

    botui.action.button({
        action: [{ // show only one button
            text: 'One',
            value: 'one'
        }, {
            text: 'Two',
            value: 'one'
        }],

    }).then(function (res) { // will be called when a button is clicked.
        console.log(res.value); // will print "one" from 'value'
    });

    botui.message.add({
        content: 'Here is an image [![product image](https://example.com/image.png)](https://example.com/product.html)'
    });

    botui.action.button({
        action: [{
            icon: 'check',
            text: 'Continue',
            value: 'continue'
        }]
    })
});
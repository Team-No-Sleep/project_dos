var botui = new BotUI("chat-bot");

botui.message
  .bot({
    loading: true,
    delay: 1000,
    content: `Welcome ${user.name.givenName}!`
  })
  .then(function() {
    botui.message.bot({
      loading: true,
      delay: 1000,
      content: "What would you like us to talk about today?"
    });
  })
  .then(function() {
    botui.action
      .button({
        delay: 2000,
        action: [
          {
            // show only one button
            text: "Learn more about jobs in my industry",
            value: "learnMore",
            cssClass: "btn-dark"
          },
          {
            // show only one button
            text: "Something Else",
            value: "somethingElse",
            cssClass: "btn-dark"
          },
          {
            // show only one button
            text: "Nothing",
            value: "nothing",
            cssClass: "btn-dark"
          }
        ]
      })
      .then(function(res) {
        // will be called when a button is clicked.
        console.log(res.value); // will print "one" from 'value'
        if (res.value === "learnMore") {
          botui.message
            .bot({
              loading: true,
              delay: 1000,
              content: "That sounds great!"
            })
            .then(function() {
              botui.message.bot({
                loading: true,
                delay: 1000,
                content:
                  "Which industry would you like to explore jobs in today?"
              });
            })
            .then(function() {
              botui.action
                .button({
                  delay: 2000,
                  action: [
                    {
                      // show only one button
                      text: "Computer Science",
                      value: "compScience",
                      cssClass: "btn-dark"
                    },
                    {
                      // show only one button
                      text: "Something Else",
                      value: "somethingElse",
                      cssClass: "btn-dark"
                    },
                    {
                      // show only one button
                      text: "Nothing",
                      value: "nothing",
                      cssClass: "btn-dark"
                    }
                  ]
                })
                .then(function(res) {
                  // will be called when a button is clicked.
                  console.log(res.value); // will print "one" from 'value'
                  if (res.value === "compScience") {
                    botui.message
                      .bot({
                        loading: true,
                        delay: 1000,
                        content: "I can definitely help with that!"
                      })
                      .then(function() {
                        botui.message.bot({
                          loading: true,
                          delay: 1000,
                          content:
                            "This leads me to believe you are a developer. Is that right?"
                        });
                      })
                      .then(function() {
                        botui.action
                          .button({
                            delay: 2000,
                            addMessage: false,
                            action: [
                              {
                                // show only one button
                                icon: "thumbs-up",
                                value: "yes",
                                cssClass: "btn-dark"
                              },
                              {
                                // show only one button
                                icon: "thumbs-down",
                                value: "no",
                                cssClass: "btn-dark"
                              }
                            ]
                          })
                          .then(function(res) {
                            // will be called when a button is clicked.
                            console.log(res.value); // will print "one" from 'value'
                            if (res.value === "yes") {
                              botui.message
                                .bot({
                                  loading: true,
                                  delay: 1000,
                                  content:
                                    "Great is there a particular job you are searching for?"
                                })
                                .then(function() {
                                  botui.action
                                    .button({
                                      delay: 2000,
                                      action: [
                                        {
                                          // show only one button
                                          text: "Javascript Developer",
                                          value: "javascript",
                                          cssClass: "btn-dark"
                                        },
                                        {
                                          // show only one button
                                          text: "Java Developer",
                                          value: "java",
                                          cssClass: "btn-dark"
                                        },
                                        {
                                          // show only one button
                                          text: "Python Developer",
                                          value: "python",
                                          cssClass: "btn-dark"
                                        }
                                      ]
                                    })
                                    .then(function(res) {
                                      // will be called when a button is clicked.
                                      console.log(res.value); // will print "one" from 'value'
                                      if (
                                        res.value === "java" ||
                                        res.value === "javascript" ||
                                        res.value === "python"
                                      ) {
                                        botui.message.bot({
                                          content:
                                            "Nice!!! Let me give you a list of jobs to browse over:"
                                        });
                                      }
                                    });
                                });
                            }
                          });
                      });
                  }
                });
            }); //
        }
      });
  });

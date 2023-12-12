import React, { Component, useEffect } from "react";
import { View, Text, SafeAreaView, AppRegistry } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { Dialogflow_V2 } from "react-native-dialogflow";

import { dialogflowConfig } from "./env";

const botAvatar = require("./assets/images/cat.jpg");

const BOT = {
  _id: 2,
  name: "Mr.Bot",
  avatar: botAvatar,
};
class App extends Component {
  state = {
    messages: [
      {
        _id: 2,
        text: "What can i help you today?",
        createdAt: new Date(),
        user: BOT,
      },
      {
        _id: 1,
        text: "Hi! My name is Catty!",
        createdAt: new Date(),
        user: BOT,
      },
    ],
    id: 1,
    name: "",
  };

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    );
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];

    this.sendBotResponse(text);
  }

  sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT,
    };

    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let message = messages[0].text;

    Dialogflow_V2.requestQuery(message, (result) => {
      this.handleGoogleResponse(result), (error) => console.log(error);
    });
  }

  onQuickReply(quickReply) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, quickReply),
    }));

    let message = quickReply[0].value;

    Dialogflow_V2.requestQuery(message, (result) => {
      this.handleGoogleResponse(result), (error) => console.log(error);
    });
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingHorizontal: 10,
          paddingBottom: 20,
        }}
      >
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          onQuickReply={(quickReply) => this.onQuickReply(quickReply)}
          user={{ _id: 1 }}
        />
      </SafeAreaView>
    );
  }
}

export default App;

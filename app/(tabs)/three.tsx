import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hola! Como debo cuidar mis lechugas?", sender: "user" },
    {
      id: 2,
      text: "Los cuidados que debes tener es mantenerla regada",
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    // Aquí luego puedes conectar el LLM (por ejemplo, API call)
  };

  return (
    <View style={styles.container}>

      <ScrollView style={styles.chatContainer}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageContainer,
              msg.sender === "user"
                ? styles.userMessage
                : styles.botMessage,
            ]}
          >
            <View style={styles.iconContainer}>
              {msg.sender === "user" ? (
                <Ionicons name="person-circle" size={35} color="black" />
              ) : (
                <Ionicons name="map" size={35} color="green" />
              )}
            </View>

            <View
              style={[
                styles.textBubble,
                msg.sender === "user"
                  ? styles.userBubble
                  : styles.botBubble,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Presione para escribir algo..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="arrow-up-circle" size={22} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#001F5B",
    marginBottom: 10,
  },
  chatContainer: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 5,
  },
  iconContainer: {
    marginRight: 10,
  },
  textBubble: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    maxWidth: "70%",
  },
  userMessage: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  botMessage: {
    alignSelf: "flex-start",
  },
  userBubble: {
    backgroundColor: "#e3e3e3",
  },
  botBubble: {
    backgroundColor: "#4CAF50",
  },
  messageText: {
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3e3e3",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 5,
  },
});

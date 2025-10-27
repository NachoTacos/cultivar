import { Ionicons } from "@expo/vector-icons";
import { resolve } from "path";
import React, { useState, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from "react-native";

// API chat completion
async function chatCompletion(){
  const system_prompt = "Eres un agente de apoyo en un sistema de monitoreo de un invernadero hidroponico\
  debes apoyar al usuario con respecto a dudas unicamente sobre hidroponia, dando respuestas cortas y concisas.\
  debes recibir al usuario con la siguiente pregunta: Hola! ¿Con qué te puedo ayudar?";
  console.log(process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY);
  try{
    const response = await fetch("https://api.deepseek.com/chat/completions",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept":'application/json',
        "Authorization": "Bearer " + process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY
      },
      body:JSON.stringify({
        "model":"deepseek-chat",
        "messages":[
          {"role":"system", "content":system_prompt},
          {"role":"user","content":"Hola!"}
        ],
        "stream":true
      })
    });
    console.log(response);
  } catch(error){
    console.error(error);
  }
}

chatCompletion();


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
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (inputText.trim() === "") return;
    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
    };
    setMessages([...messages, newMessage]);
    setInputText("");
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.chatContainer}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
            keyboardShouldPersistTaps="handled" 
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageContainer,
                  msg.sender === "user" ? styles.userMessage : styles.botMessage,
                ]}
              >
                <View style={styles.iconContainer}>
                  {msg.sender === "user" ? (
                    <Ionicons name="person-circle" size={35} color="black" />
                  ) : (
                    <Ionicons name="leaf" size={35} color="green" />
                  )}
                </View>
                <View
                  style={[
                    styles.textBubble,
                    msg.sender === "user" ? styles.userBubble : styles.botBubble,
                  ]}
                >
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Presione para escribir algo..."
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <Ionicons name="arrow-up-circle" size={28} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 15,
    paddingHorizontal: 15,
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
  inputWrapper: {
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3e3e3",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: Platform.OS === "android" ? 25 : 5,
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

import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef, useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  // --- MODIFICADO: Quitar ScrollView ---
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Modal,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
// --- MODIFICADO: Importar FlatList ---
import { FlatList } from "react-native";
import { Button } from "react-native";

// Interfaz para tipar los mensajes
interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function ChatScreen() {
  const navigation = useNavigation();

  // Estados del chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  
  // --- MODIFICADO: Referencia para FlatList ---
  const flatListRef = useRef<FlatList<Message>>(null);

  // Estados de los modales
  const [firstModalVisible, setFirstModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [popupInput, setPopupInput] = useState("");
  const [selectedPlant, setSelectedPlant] = useState("");

  const [ubicacion, setUbicacion] = useState("");
  const [plants, setPlants] = useState<string[]>([]);

  // API fetchs
  async function changeEstado(ubicacion: string, planta: string): Promise<void> {
    try {
      const response = await fetch(
        "https://untwistable-helena-unexpiated.ngrok-free.dev/ai_agent.php",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json", 
          },
          body: JSON.stringify({
            location: ubicacion,
            plant: planta,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const debugText = await response.text();
      console.log("Respuesta de changeEstado (PUT):", debugText);
      
    } catch (error) {
      console.log("Error en changeEstado:", error);
    }
  }

  async function traerPlantas(ubicacion: string) {
    try {
      const response = await fetch(
        "https://untwistable-helena-unexpiated.ngrok-free.dev/ai_agent.php?location=" +
          ubicacion,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const json = await response.json();
      console.log("PETICION GET:", json);
      if (Array.isArray(json.plants)) {
        setPlants(json.plants);
      } else {
        console.warn("Respuesta inesperada:", json);
      }
    } catch (error) {
      console.error("Error al traer plantas:", error);
    }
  }

  async function mensajeBot(mensaje: string): Promise<string> {
    try {
      const response = await fetch(
        "https://untwistable-helena-unexpiated.ngrok-free.dev/ai_agent.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
            "Accept": "text/plain",
          },
          body: mensaje,
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const botReplyText = await response.text();
      console.log("Respuesta (raw text) del bot (POST):", botReplyText);
      return botReplyText;

    } catch (error) {
      console.error("Error en mensajeBot:", error);
      return "Lo siento, algo salió mal al contactar al bot.";
    }
  }

  useEffect(() => {
    setFirstModalVisible(true);
  }, []);

  const handleNext = async () => {
    await traerPlantas(popupInput);
    setFirstModalVisible(false);
    setSecondModalVisible(true);
  };

  const handleGoToIndex = () => {
    navigation.navigate("index" as never);
  };

  // --- MODIFICADO: Se eliminan los setTimeouts para el scroll ---
  const sendMessage = async () => {
    const trimmedInput = inputText.trim();
    if (trimmedInput === "") return;

    const newMessage: Message = {
      id: Date.now(),
      text: trimmedInput,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");

    // El scroll automático ahora se maneja SÓLO por onContentSizeChange del FlatList

    try {
      const botReplyText = await mensajeBot(trimmedInput);

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botReplyText,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error al enviar mensaje y recibir respuesta:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Error al conectar. Intenta de nuevo.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const handleSelectPlant = async (plant: string) => {
    setSelectedPlant(plant);
    console.log(popupInput, plant);

    await changeEstado(popupInput, plant);
    setSecondModalVisible(false);

    try {
      const saludoInicial = await mensajeBot("Hola"); 

      if (saludoInicial) {
        const initialBotMessage: Message = {
          id: Date.now(),
          text: saludoInicial,
          sender: "bot",
        };
        setMessages([initialBotMessage]);
      }
    } catch (error) {
       console.error("Error al obtener saludo inicial:", error);
       const errorMessage: Message = {
        id: Date.now(),
        text: "Error al conectar con el bot. Intenta recargar.",
        sender: "bot",
      };
      setMessages([errorMessage]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          
          {/* --- MODIFICADO: Reemplazado ScrollView con FlatList --- */}
          <FlatList
            ref={flatListRef}
            style={styles.chatContainer}
            data={messages}
            keyExtractor={(item) => item.id.toString()} // Key extractor es requerido
            keyboardShouldPersistTaps="handled"
            
            // Este es el manejador de scroll mejorado
            onContentSizeChange={() =>
              // Añadimos un leve retardo para asegurar que el layout se complete
              setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50)
            }
            
            // Función que renderiza cada item (lo que antes estaba en el .map)
            renderItem={({ item: msg }) => (
              <View
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
                    <Ionicons name="leaf" size={35} color="green" />
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
            )}
          />

          {/* --- INPUT --- */}
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

          {/* --- MODALES (Sin cambios) --- */}
          <Modal visible={firstModalVisible} transparent animationType="slide">
            <View style={styles.modalBackground}>
              <View style={styles.modalBox}>
                <TouchableOpacity
                  style={styles.hiddenButton}
                  onPress={handleGoToIndex}
                >
                  <Text style={styles.hiddenText}>↩️</Text>
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Ingresa donde vives:</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Escribe aquí..."
                  value={popupInput}
                  onChangeText={setPopupInput}
                />
                <Button
                  title="Siguiente"
                  onPress={handleNext}
                  disabled={!popupInput.trim()}
                />
              </View>
            </View>
          </Modal>

          <Modal visible={secondModalVisible} transparent animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.modalBox}>
                <Text style={styles.modalText}>
                  Selecciona una de las plantas recomendadas
                </Text>
                <FlatList
                  data={plants}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.plantItem}
                      onPress={() => handleSelectPlant(item)}
                    >
                      <Text
                        style={styles.plantText}
                        onPress={() => handleSelectPlant(item)}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <Button
                  title="Cerrar"
                  onPress={() => setSecondModalVisible(false)}
                />
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// --- ESTILOS (Sin cambios) ---
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

  // --- ESTILOS DE MODALES ---
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    width: "80%",
    position: "relative",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 10,
  },

  hiddenButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  hiddenText: {
    fontSize: 18,
    color: "transparent",
  },
  plantItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  plantText: { fontSize: 16 },
  selectionText: { marginTop: 20, fontSize: 16, fontWeight: "500" },
});
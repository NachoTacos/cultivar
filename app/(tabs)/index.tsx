import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';


export default function TabOneScreen() {
  // Grid encargada de acomodar temperatura y humedad
  
  return (
    <View style={styles.container}>
      {/* Temperatura y Humedad */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.title}>Temperatura Ambiental</Text>
          <Text style={styles.value}>35°</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Humedad Ambiental</Text>
          <Text style={styles.value}>45%</Text>
        </View>
      </View>

      {/* Irradiación Solar */}
      <View style={styles.cardLarge}>
        <Text style={styles.title}>Irradiación Solar</Text>
        <Text style={styles.value}>20 W/M2</Text>
      </View>

      {/* Mensaje con ícono */}
      <View style={styles.messageContainer}>
      <Image source={require("./plant.png")}
      style={styles.icon}/>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            Tu planta está creciendo de forma correcta.{"\n"}¡Felicidades!!!
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#e3e3e3",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 25,
    margin: 5,
    alignItems: "center",
    width: 160,
  },
  cardLarge: {
    backgroundColor: "#e3e3e3",
    borderRadius: 15,
    paddingVertical: 25,
    paddingHorizontal: 25,
    marginTop: 10,
    alignItems: "center",
    width: 340,
  },
  title: {
    fontSize: 13,
    color: "#333",
    marginBottom: 5,
  },
  value: {
    fontSize: 55,
    fontWeight: "bold",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  messageBox: {
    backgroundColor: "#e3e3e3",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: 280,
  },
  messageText: {
    fontSize: 13,
    color: "#222",
  },
});
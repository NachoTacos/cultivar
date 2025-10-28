import React, { useEffect } from 'react';
import { useState } from 'react';
import { Image, StyleSheet, Text, View,ScrollView } from 'react-native';



export default function TabOneScreen() {
  
  // Variables que se estaran actualizando cada hora
  const[temperatura, setTemperatura] = useState([]);
  const[humedad, setHumedad] = useState([]);
  const[irradiacion, setIrradiacion] = useState([]);
  

// Fetch datos
const traerDatos = async () => {  
  try{
    const response = await fetch('https://untwistable-helena-unexpiated.ngrok-free.dev/',{
      method:"GET",
      headers:{
        "ngrok-skip-browser-warning": "true",
        "Accept": "application/json"
      }
    });
    const json = await response.json();
    setTemperatura(json.temperature);
    setHumedad(json.soil_hum);
    setIrradiacion(json.light);
    

  }catch(error){
    console.error(error);
  }
}

  useEffect(() => {
    traerDatos();
  }, []);
  

  return (
    <ScrollView style={styles.ScrollView}
    contentContainerStyle={styles.scrollContent}>
      {/* Mensaje con ícono */}
      <Image source={require("./plant.png")}
      style={styles.icon}/>      
      <View style={styles.messageContainer}>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            Tu planta está creciendo de forma correcta.{"\n"}¡Felicidades!!!
          </Text>
        </View>
      </View>

      {/* Temperatura y Humedad */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.title}>Temperatura Ambiental</Text>
          <Text style={styles.value}>{temperatura}°</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Humedad del Suelo</Text>
          <Text style={styles.value}>{humedad}%</Text>
        </View>
      </View>

      {/* Irradiación Solar */}
      <View style={styles.cardLarge}>
        <Text style={styles.title}>Irradiación Solar</Text>
        <Text style={styles.value}>{irradiacion}W/M2</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ScrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: theme.spacing.large,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius,
    paddingVertical: 20,
    paddingHorizontal: 25,
    margin: theme.spacing.small,
    alignItems: 'center',
    width: 160,
  },
  cardLarge: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius,
    paddingVertical: 25,
    paddingHorizontal: 25,
    marginBottom: 30,
    marginTop: theme.spacing.medium,
    alignItems: 'center',
    width: 340,
  },
  title: {
    fontSize: 13,
    color: theme.colors.secondaryText,
    marginBottom: 5,
  },
  value: {
    fontSize: 55,
    fontWeight: 'bold',
    color: theme.colors.primaryText,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  icon: {
    width: 150,
    height: 150,
    marginRight: theme.spacing.medium,
  },
  messageBox: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    width: 280,
  },
  messageText: {
    fontSize: 13,
    color: theme.colors.primaryText,
  },
});
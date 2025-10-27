import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Switch, Text, View } from "react-native";

export default function MonitorScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);

  const [illumination, setIllumination] = useState(false);
  const [heat, setHeat] = useState(false);

  // PUT para en el invernadero hacer el cambio
  async function activateSwitch(updatedIllumination: boolean, updatedHeat: boolean) {
    try {
      const response = await fetch("https://untwistable-helena-unexpiated.ngrok-free.dev/activation.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          illumination: updatedIllumination,
          heat: updatedHeat
        })
      });

      console.log("PUT enviado:", { illumination: updatedIllumination, heat: updatedHeat });
      console.log("Respuesta del servidor:", response.status);
    } catch (error) {
      console.error(error);
    }
  }

  // Get para actualizar en la app los switches
  async function updateStatus() {
    try {
      const response = await fetch("https://untwistable-helena-unexpiated.ngrok-free.dev/activation.php", {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Accept": "application/json"
        }
      });

      const json = await response.json();
      console.log("GET recibido:", json);

      if (json.illumination !== undefined) setIsEnabled(json.illumination);
      if (json.heat !== undefined) setIsEnabled2(json.heat);
    } catch (error) {
      console.error(error);
    }
  }

  // Cambio swtich iluminacion
  const toggleSwitch = async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    setIllumination(newValue);
    await activateSwitch(newValue, isEnabled2);
  };

  // Cambio switch de calor
  const toggleSwitch2 = async () => {
    const newValue = !isEnabled2;
    setIsEnabled2(newValue);
    setHeat(newValue);
    await activateSwitch(isEnabled, newValue); 
  };


  useEffect(() => {
    updateStatus();
  }, []);

  return (
    <View style={styles.contentContainer}>

      {/* Switch de iluminación */}
      <View style={[styles.controlCard, isEnabled && styles.activeCard]}>
        <View style={styles.controlContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="bulb" size={32} color="#666" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Encender iluminación</Text>
          </View>
          <Switch
            value={isEnabled}
            onValueChange={toggleSwitch}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#4A90E2" : "#f4f3f4"}
            style={styles.switch}
          />
        </View>
      </View>

      {/* Switch de calor */}
      <View style={[styles.controlCard, isEnabled2 && styles.activeCard]}>
        <View style={styles.controlContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="flame" size={32} color="#666" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Encender calor</Text>
          </View>
          <Switch
            value={isEnabled2}
            onValueChange={toggleSwitch2}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled2 ? "#4A90E2" : "#f4f3f4"}
            style={styles.switch}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 50,
  },
  controlCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeCard: {
    borderColor: "#4A90E2",
    backgroundColor: "#f0f8ff",
  },
  controlContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 50,
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});

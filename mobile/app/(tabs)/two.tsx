import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import VLCPlayer from 'react-native-vlc-media-player';

//Paleta de colores y constantes de estilo
const theme = {
  colors: {
    background: '#e3ffdaff',
    cardBackground: '#a0df87ff',
    primaryText: '#252725ff',
    secondaryText: '#303030ff',
    accent: '#4c87afff',
  },
  spacing: {
    small: 5,
    medium: 10,
    large: 15,
  },
  borderRadius: 15,
  fontSizes: {
    title: 18,
    status: 14,
  },
  fontWeights: {
    medium: '500',
    semiBold: '600',
  } as const,
};

//Agregamos constante para la URL
const RTSP_INFO_URL = 'https://untwistable-helena-unexpiated.ngrok-free.dev/rtsp.php';

export default function MonitorScreen() {
  //Estados para guardar la URL del stream y para saber si estamos cargando
  const [rtspUrl, setRtspUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //se ejecuta una vez cuando el componente se monta
  useEffect(() => {
    const fetchRtspUrl = async () => {
      try {
        console.log("Buscando URL del stream...");
        const response = await fetch(RTSP_INFO_URL);
        const data = await response.json();

        //Dividir array para poder integrar el puerto entre url y /cam
        //data.url original -> 8.tcp.ngrok.io/cam
        const urlParts = data.url.split('/')
        //data.url dividido -> ['8.tcp.ngrok.io', 'cam']


        //URL completa para VLC
        // Ejemplo: rtsp://8.tcp.ngrok.io:16645/cam
        const fullUrl = `rtsp://${urlParts[0]}:${data.port}/${urlParts[1]}`;
        console.log(`Stream encontrado en: ${fullUrl}`);
        setRtspUrl(fullUrl);

      } catch (error) {
        console.error("Error al obtener la URL del stream:", error);
      } finally {
        setIsLoading(false);
      }
    };

    //Array vacio para asegurar que se ejecuta solo una vez
    fetchRtspUrl();
  }, []);

  //UX para mostrar una barrita de carga mientras obtenemos la URL
  if (isLoading) {
    return (
      <View style={styles.contentContainer}>
        <ActivityIndicator size="large" color={theme.colors.primaryText} />
        <Text style={styles.title}>Conectando al stream...</Text>
      </View>
    );
  }

  // se muestra el reproductor si tenemos la URL, o un mensaje de error si no
  return (
    <View style={styles.contentContainer}>
      {rtspUrl ? (
        <VLCPlayer
          style={styles.video}
          source={{ uri: rtspUrl }}
          autoplay={true}
        />
      ) : (
        <Text style={styles.title}>No se pudo conectar al stream.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 50,
  },
  controlCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.large,
    marginBottom: theme.spacing.large,
    shadowColor: theme.colors.primaryText,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent', // Se mantiene ya que es un valor común
  },
  activeCard: {
    borderColor: theme.colors.accent,
    // Se usa un tono más claro del cardBackground para el estado activo
    backgroundColor: '#c8f7b6ff', 
  },
  controlContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 50,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12, // Se mantiene como valor específico del diseño
  },
  title: {
    fontSize: theme.fontSizes.title,
    fontWeight: theme.fontWeights.semiBold,
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.small,
  },
  status: {
    fontSize: theme.fontSizes.status,
    color: theme.colors.secondaryText,
    fontWeight: theme.fontWeights.medium,
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: theme.spacing.medium,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});


import { Ionicons } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useState } from "react";
import { Button, StyleSheet, Switch, Text, View } from "react-native";

// Esto del video se quita, lo use nomas como place holder
const videoSource = 
'https://www.w3schools.com/html/mov_bbb.mp4';

export default function MonitorScreen() {
 // Parte del video tmb es place holder tambien
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
  });


  

  return (
    // donde se genera todo lo visual del vidio es place holder tambien
    <View style={styles.contentContainer}>
      <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
      <View style={styles.controlsContainer}>
      </View>

    </View>
    
  );
}


//aca en los estilos se modifican cosas como el acomodo, tamaño, color y esas weas
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 50,
  },
  controlCard:{
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
  },
      shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
},
  activeCard:{
      borderColor: '#4A90E2',
      backgroundColor: '#f0f8ff',  
  },
  controlContent:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
  iconContainer:{
      width: 50,
      alignItems: 'center',
  },
  textContainer:{
      flex: 1,
      marginLeft: 12,
  },
  title:{
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      marginBottom: 4,
  },
  status:{
      fontSize: 14,
      color: '#666',
      fontWeight: '500',
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
  switch:{
    transform: [{scaleX: 1.1}, {scaleY: 1.1}],
  },
});


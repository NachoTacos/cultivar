import { Ionicons } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useState } from "react";
import { Button, StyleSheet, Switch, Text, View } from "react-native";


const videoSource = 
'https://www.w3schools.com/html/mov_bbb.mp4';

export default function MonitorScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [isEnabled2, setIsEnabled2] = useState(false);
  const toggleSwitch2 = () => setIsEnabled2(previousState2 => !previousState2);


  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  

  return (
    <View style={styles.contentContainer}>
      <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
      <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
        />
      </View>

      {/*Switch de iluminacion*/}
    <View style={[styles.controlCard, isEnabled && styles.activeCard]}>
        <View style={styles.controlContent}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={'bulb'}
              size={32}
              color={'#666'}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Encender iluminación</Text>
          </View>
          <Switch
            value={isEnabled}
            onValueChange={toggleSwitch}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            style={styles.switch}
          />
        </View>
      </View>

      {/* Switch de control de riego */}
      <View style={[styles.controlCard, isEnabled2 && styles.activeCard]}>
        <View style={styles.controlContent}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={'water'}
              size={32}
              color={'#666'}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Encender irrigación</Text>
          </View>
          <Switch
            value={isEnabled2}
            onValueChange={toggleSwitch2}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled2 ? '#4A90E2' : '#f4f3f4'}
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


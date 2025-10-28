import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import React from 'react';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),

        // --- INICIO DE MODIFICACIONES ---

        // 1. Estilos de la barra de tabs (inferior)
        tabBarStyle: {
          backgroundColor: '#4CAF50', // Verde para el fondo de la barra de tabs
        },
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)', // Color inactivo

        // 2. Estilos del Header (superior)
        headerStyle: {
          backgroundColor: '#4CAF50', // Verde para el fondo del header
        },
        headerTintColor: '#FFFFFF', // Blanco para el título del header

        // --- FIN DE MODIFICACIONES ---
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Watch',
          tabBarIcon: ({ color }) => <FontAwesome6 name="plant-wilt" size={24} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="robot-happy" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: 'Status',
          tabBarIcon: ({ color }) => <FontAwesome5 name="oil-can" size={24} color={color}/>
        }}
      />
  
    </Tabs>
  );
}
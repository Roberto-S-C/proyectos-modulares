import Colors from '@/src/constants/Colors';
import { useAuth } from '@/src/contexts/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const { user } = useAuth();

  const roleTabConfig: Record<string, string[]> = {
    ROLE_USUARIO: ['index', 'projects', 'options'],
    ROLE_EVALUADOR: ['index', 'projects', 'options'],
    ROLE_ALUMNO: ['index', 'projects', 'options'],
    ROLE_ADMIN: ['index', 'files', 'projects', 'users', 'options'],
  };

  const userRole = user?.["cognito:groups"][0] || 'ROLE_USUARIO';
  const visibleTabs = roleTabConfig[userRole] || roleTabConfig.ROLE_USUARIO;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'index') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'files') iconName = focused ? 'folder' : 'folder-outline';
          else if (route.name === 'projects') iconName = focused ? 'hammer' : 'hammer-outline';
          else if (route.name === 'users') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'options') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: Colors.selected,
        tabBarInactiveTintColor: Colors.unSelected
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio', href: visibleTabs.includes('index') ? undefined : null, }} />
      <Tabs.Screen name='files' options={{ title: 'Archivos', href: visibleTabs.includes('files') ? undefined : null, }} />
      <Tabs.Screen name='projects' options={{ title: 'Proyectos', href: visibleTabs.includes('projects') ? undefined : null, }} />
      <Tabs.Screen name='users' options={{ title: 'Usuarios', href: visibleTabs.includes('users') ? undefined : null, }} />
      <Tabs.Screen name='options' options={{ title: 'Opciones', href: visibleTabs.includes('options') ? undefined : null, }} />
    </Tabs>
  );
}

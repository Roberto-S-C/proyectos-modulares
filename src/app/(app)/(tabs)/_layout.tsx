import Colors from '@/src/constants/Colors';
import { AuthContext } from '@/src/contexts/AuthContext';
import { UserRoleTabsLayout } from '@/src/types/tabLayout.type';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React, { useContext } from 'react';

export default function TabLayout() {
  const authContext = useContext(AuthContext);

  let visibleTabs: string[] = []
  if (authContext.authState?.user) {
    let role = authContext.authState.user.roles[0];
    console.log('Role', role)
    visibleTabs = UserRoleTabsLayout[role];
  }
  console.log(visibleTabs)

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.selected
    }}>
      <Tabs.Screen name="index" options={{
        title: 'Inicio',
        tabBarIcon: ({ color }) => <Ionicons name='home' size={28} color={color} />,
        href: visibleTabs.includes('index') ? undefined : null,
      }} />
      <Tabs.Screen name='files' options={{
        title: 'Archivos',
        tabBarIcon: ({ color }) => <Ionicons name='folder' size={28} color={color} />,
        href: visibleTabs.includes('files') ? undefined : null,
      }} />
      <Tabs.Screen name='projects' options={{
        title: 'Proyectos',
        tabBarIcon: ({ color }) => <Ionicons name='hammer' size={28} color={color} />,
        href: visibleTabs.includes('projects') ? undefined : null,
      }} />
      <Tabs.Screen name='users' options={{
        title: 'Usuarios',
        tabBarIcon: ({ color }) => <Ionicons name='person' size={28} color={color} />,
        href: visibleTabs.includes('users') ? undefined : null,
      }} />
      <Tabs.Screen name='options' options={{
        title: 'Opciones',
        tabBarIcon: ({ color }) => <Ionicons name='settings' size={28} color={color} />,
        href: visibleTabs.includes('options') ? undefined : null,
      }} />
    </Tabs>
  );
}
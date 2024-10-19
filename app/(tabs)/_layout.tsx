import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from 'react-native-vector-icons';
import { TabBarIconProps } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// تعریف تایپ TabBarIconProps
type TabBarIconProps = {
  name: string;
  color: string;
};

// کامپوننت TabBarIcon با تایپ‌اسکریپت
export function TabBarIcon({ name, color }: TabBarIconProps) {
  return <Ionicons name={name} size={24} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <TabBarIcon name={focused ? 'pencil' : 'pencil-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="note"
        options={{
          title: 'Note',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <TabBarIcon name={focused ? 'document' : 'document-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

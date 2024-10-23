import { Tabs } from 'expo-router';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Animated, Easing } from 'react-native';

type TabBarIconProps = {
  name: string;
  color: string;
  focused: boolean;
};

function AnimatedTabBarIcon({ name, color, focused }: TabBarIconProps) {
  const scaleValue = new Animated.Value(focused ? 1 : 0.8);

  Animated.timing(scaleValue, {
    toValue: focused ? 1.2 : 1,
    duration: 200,
    easing: Easing.bounce,
    useNativeDriver: true,
  }).start();

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Ionicons name={name} size={28} color={color} />
    </Animated.View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const getColor = (focused: boolean) => {
    if (focused) {
      return '#6200ea'; // رنگ بنفش برای آیکون فعال
    } else {
      return 'gray'; // رنگ خاکستری برای آیکون غیرفعال
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false, // مخفی کردن متن زیر آیکون‌ها
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff', // پس‌زمینه سفید یا تیره
          borderTopWidth: 0,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabBarIcon
              name={focused ? 'pencil' : 'pencil-outline'}
              color={getColor(focused)}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="note"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabBarIcon
              name={focused ? 'document' : 'document-outline'}
              color={getColor(focused)}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dayTodo"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabBarIcon
              name={focused ? 'alarm' : 'alarm-outline'}
              color={getColor(focused)}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmployeeLayout() {
  const insets = useSafeAreaInsets();
  const bottomOffset = insets.bottom > 0 ? insets.bottom : 24;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: bottomOffset,
          left: 24,
          right: 24,
          elevation: 0,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.6)',
          borderRadius: 24,
          height: 64,
          backgroundColor: 'transparent',
          // Optional subtle shadow
          shadowColor: '#7b7487',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.08,
          shadowRadius: 32,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarBackground: () => (
          <View className="flex-1 rounded-[24px] overflow-hidden border border-outline-variant/20">
            <BlurView
              intensity={80}
              tint="light"
              style={{ flex: 1, backgroundColor: 'rgba(254, 247, 255, 0.6)' }}
            />
          </View>
        ),
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center rounded-2xl w-20 py-2 ${focused ? 'bg-[#7C3AED]' : 'bg-transparent'}`}>
              <MaterialIcons name="home" size={24} color={focused ? 'white' : 'rgba(29, 26, 36, 0.6)'} />
              <Text className={`font-body font-medium text-[10px] uppercase tracking-widest mt-1 ${focused ? 'text-white' : 'text-[#1D1A24] opacity-60'}`}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center rounded-2xl w-20 py-2 ${focused ? 'bg-[#7C3AED]' : 'bg-transparent'}`}>
              <MaterialIcons name="chat-bubble-outline" size={24} color={focused ? 'white' : 'rgba(29, 26, 36, 0.6)'} />
              <Text className={`font-body font-medium text-[10px] uppercase tracking-widest mt-1 ${focused ? 'text-white' : 'text-[#1D1A24] opacity-60'}`}>
                Chat
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center rounded-2xl w-20 py-2 ${focused ? 'bg-[#7C3AED]' : 'bg-transparent'}`}>
              <MaterialIcons name="person-outline" size={24} color={focused ? 'white' : 'rgba(29, 26, 36, 0.6)'} />
              <Text className={`font-body font-medium text-[10px] uppercase tracking-widest mt-1 ${focused ? 'text-white' : 'text-[#1D1A24] opacity-60'}`}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="trip-details"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}

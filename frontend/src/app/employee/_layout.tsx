import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

type TabIconProps = {
  iconName: keyof typeof MaterialIcons.glyphMap;
  text: string;
  focused: boolean;
};

const TabIcon = ({ iconName, text, focused }: TabIconProps) => {
  const color = focused ? '#630ED4' : 'rgba(3, 3, 3, 0.5)';

  return (
    <View className="w-full h-full justify-center items-center flex-col">
      <MaterialIcons name={iconName} color={color} size={24} />
      {focused && (
        <Text className="text-primary" style={{ fontSize: 8 }}>
          {text}
        </Text>
      )}
    </View>
  );
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          marginTop: 6,
        },
        tabBarStyle: {
          backgroundColor: '#d2cccccc',
          borderRadius: 50,
          marginRight: 30,
          marginLeft: 30,
          marginBottom: 36,
          height: 52,
          position: 'absolute',
          bottom: -5,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#444444',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} text="Home" iconName="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} text="Chat" iconName="chat" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} text="Profile" iconName="person" />
          ),
        }}
      />
      <Tabs.Screen
        name="trip-details"
        options={{
          href: null,
          title: 'Trip Details',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="receipt-processing"
        options={{
          href: null,
          title: 'Processing...',
          headerShown: false,
          tabBarStyle: { display: 'none' }
        }}
      />
    </Tabs>
  );
};

export default _layout;
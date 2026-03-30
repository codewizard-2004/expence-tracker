import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Message = {
  id: string;
  type: 'user' | 'bot';
  text: string;
  time: string;
  compliance?: {
    title: string;
    policyRef: string;
    policyLabel: string;
    items: string[];
  };
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    type: 'user',
    text: 'Can I expense a high-end mechanical keyboard for my home office?',
    time: '10:42 AM',
  },
  {
    id: '2',
    type: 'bot',
    text: 'According to the **Remote Work Hardware Policy (v4.2)**, mechanical keyboards are eligible for reimbursement under the "Ergonomic Peripherals" category.',
    time: 'Just now',
    compliance: {
      title: 'Compliance Check',
      policyRef: 'Remote Work Hardware Policy (v4.2)',
      policyLabel: 'Ergonomic Peripherals',
      items: [
        'Maximum stipend: $250.00 USD.',
        'Receipt must show vendor name and date.',
      ],
    },
  },
];


export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const renderBotText = (text: string) => {
    // Simple bold parsing for **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={i} className="font-semibold text-primary">
            {part.slice(2, -2)}
          </Text>
        );
      }
      return <Text key={i}>{part}</Text>;
    });
  };

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />

      {/* Header */}
      <View
        className="flex-row justify-between items-center w-full px-6 py-4 bg-surface z-40"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-primary-container items-center justify-center overflow-hidden shadow-sm">
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXUwXlVzDeuFjblkYSqAXiAnQ7YSDrrYpLPHs79feNdqCHtAmeXqixaTyaUNpsItXrGlfeybkp82QOSFYmXq75VFBCO93fxLjEH63CidUTtshxWEUVqwsqp2BRWa7jpY6HjzyoW4qz8x6XscHXjK2lEWU9VFlg_o8Ro6wsAJ2DxIiqqOLDgWZV1r6UilO-IP5o4l8WRBWSDyBi-2Xy57R1qR_72lnQ0nDsVJYIv_-gY_akG-UMeOmbWKQDXE6ud_pa9d4dvxhCLdZs',
              }}
              className="w-full h-full"
              contentFit="cover"
            />
          </View>
          <Text className="font-headline font-bold text-2xl tracking-tight text-primary">
            Policy Advisor
          </Text>
        </View>
        <TouchableOpacity className="p-2 rounded-full">
          <MaterialIcons name="notifications-none" size={24} color="#7b7487" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View className="items-center pt-6 mb-8">
            <View className="p-3 mb-4 rounded-2xl bg-surface-container-low">
              <MaterialIcons name="auto-awesome" size={30} color="#630ED4" />
            </View>
            <Text className="text-2xl font-headline font-extrabold text-on-surface tracking-tight mb-2 text-center">
              How can I help with{'\n'}Macrosoft policy?
            </Text>
            <Text className="text-on-surface-variant font-body text-sm text-center max-w-[280px]">
              Ask about travel expenses, hardware stipends, or remote work guidelines.
            </Text>
          </View>

          {/* Chat Messages */}
          <View className="gap-6">
            {messages.map((msg) => {
              if (msg.type === 'user') {
                return (
                  <View key={msg.id} className="items-end">
                    <View
                      className="max-w-[85%] bg-primary px-5 py-3 shadow-sm"
                      style={{
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 4,
                        borderBottomLeftRadius: 16,
                        borderBottomRightRadius: 16,
                      }}
                    >
                      <Text className="text-sm font-body text-white">
                        {msg.text}
                      </Text>
                    </View>
                    <Text className="mt-1 text-[10px] font-label text-outline uppercase tracking-wider">
                      {msg.time}
                    </Text>
                  </View>
                );
              }

              // Bot message
              return (
                <View key={msg.id} className="items-start">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-[10px] font-label text-primary font-bold uppercase tracking-widest">
                      Macrosoft Policy Bot
                    </Text>
                  </View>
                  <View
                    className="max-w-[85%] bg-surface-container px-5 py-4 shadow-sm border border-outline-variant/15"
                    style={{
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 16,
                      borderBottomLeftRadius: 16,
                      borderBottomRightRadius: 16,
                    }}
                  >
                    <Text className="text-sm font-body text-on-surface leading-relaxed mb-3">
                      {renderBotText(msg.text)}
                    </Text>
                  </View>
                  <Text className="mt-1 text-[10px] font-label text-outline uppercase tracking-wider">
                    {msg.time}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Input Section */}
        <View
          className="px-4 pb-4 bg-surface"
          style={{ paddingBottom: Math.max(insets.bottom + 70, 90) }}
        >
          <View className="flex-row items-center bg-surface-container-highest/70 rounded-2xl shadow-lg overflow-hidden">
            <TextInput
              className="flex-1 px-6 py-4 text-on-surface font-body text-sm"
              placeholder="Type your policy question..."
              placeholderTextColor="rgba(74, 68, 85, 0.6)"
              value={inputText}
              onChangeText={setInputText}
              multiline={false}
            />
            <TouchableOpacity
              className="m-2 p-3 bg-primary-container rounded-xl items-center justify-center shadow-md"
              activeOpacity={0.8}
            >
              <MaterialIcons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

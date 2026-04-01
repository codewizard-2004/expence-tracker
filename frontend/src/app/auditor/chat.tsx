import BotMessage from '@/components/BotMessage';
import TopNavigator from '@/components/TopNavigator';
import UserMessage from '@/components/UserMessage';
import { MaterialIcons } from '@expo/vector-icons';
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
    text: 'What is the standard policy for overriding a Lumina insight when a user exceeds the daily dining limit?',
    time: '14:22 PM',
  },
  {
    id: '2',
    type: 'bot',
    text: 'According to the **Auditor Protocol Handbook (v5.1)**, you may override Lumina warnings for dining limits if the employee provides a valid exception justification (e.g., client entertainment, remote location markup).',
    time: 'Just now',
    compliance: {
      title: 'Policy Check',
      policyRef: 'Auditor Protocol Handbook (v5.1)',
      policyLabel: 'Override Conditions',
      items: [
        'Require written justification in the receipt notes.',
        'Overridden transactions must be logged for monthly review.',
      ],
    },
  },
];

export default function AuditorChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  return (
    <View className="flex-1 bg-surface pt-8">
      <StatusBar style="dark" />

      {/* Header */}
      <TopNavigator mode='auditor' />

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
              Auditor Policy{'\n'}Assistant
            </Text>
            <Text className="text-on-surface-variant font-body text-sm text-center max-w-[280px]">
              Ask about compliance rules, limit exceptions, or audit workflows.
            </Text>
          </View>

          {/* Chat Messages */}
          <View className="gap-6">
            {messages.map((msg) => {
              if (msg.type === 'user') {
                return (
                  <UserMessage msg={msg} key={msg.id} />
                );
              }

              // Bot message
              return (
                <BotMessage msg={msg} key={msg.id} />
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
              placeholder="Ask a policy question..."
              placeholderTextColor="rgba(74, 68, 85, 0.6)"
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
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

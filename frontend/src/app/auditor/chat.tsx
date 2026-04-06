import BotMessage from '@/components/BotMessage';
import TopNavigator from '@/components/TopNavigator';
import UserMessage from '@/components/UserMessage';
import { sendPolicyChatMessage, generateId, getOrCreateThreadId } from '@/lib/api';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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

export default function AuditorChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string>('');

  useEffect(() => {
    getOrCreateThreadId().then(setThreadId);
  }, []);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    scrollToBottom();

    try {
      const response = await sendPolicyChatMessage({
        message: userMessage.text,
        thread_id: threadId,
      });

      const botMessage: Message = {
        id: generateId(),
        type: 'bot',
        text: response.response.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        compliance: response.response.pages.length > 0
          ? {
            title: 'Policy Reference',
            policyRef: `Pages ${response.response.pages.join(', ')}`,
            policyLabel: 'Source',
            items: response.response.pages.map(p => `Page ${p}`),
          }
          : undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        type: 'bot',
        text: 'Sorry, I encountered an error while processing your request. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <View className="flex-1 bg-surface pt-8">
      <StatusBar style="dark" />

      {/* Header */}
      <TopNavigator mode='auditor' />

      <KeyboardAvoidingView
        behavior={'padding'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: 20,
            paddingHorizontal: 16,
            paddingTop: 10
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
            {messages.map((msg) => (
              msg.type === 'user' ? <UserMessage msg={msg} key={msg.id} /> : <BotMessage msg={msg} key={msg.id} />
            ))}
            {isLoading && (
              <View className="items-start">
                <View className="bg-surface-container-low rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                  <ActivityIndicator color="#630ED4" />
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Input Section */}
        <View
          className="px-4 bg-surface"
          style={{
            paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 100) : 100,
            paddingTop: 8
          }}
        >
          <View className="flex-row items-center bg-surface-container-highest/70 rounded-2xl shadow-lg overflow-hidden">
            <TextInput
              className="flex-1 px-6 py-3 text-on-surface font-body text-sm max-h-32"
              placeholder="Ask a policy question..."
              placeholderTextColor="rgba(74, 68, 85, 0.6)"
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
            />
            <TouchableOpacity
              className="m-2 p-3 bg-primary-container rounded-xl items-center justify-center shadow-md"
              activeOpacity={0.8}
              onPress={handleSend}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#630ED4" />
              ) : (
                <MaterialIcons name="send" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

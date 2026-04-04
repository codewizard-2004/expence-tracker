import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ReceiptDecision from '@/components/ReceiptDecision';
import VerticalStepper from '@/components/VerticalStepper';

const PROCESSING_STEPS = [
  'Extracting the document',
  'Reading the document',
  'Checking the validity',
  'Checking for policy violations',
  'Finalizing the decision',
];

export default function ReceiptProcessingScreen() {
  const router = useRouter();
  const { file, url } = useLocalSearchParams<{ file?: string; url?: string }>();

  useEffect(() => {
    if (url) {
      console.log('Processing receipt at URL:', url);
    }
  }, [url]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (currentStep < PROCESSING_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1500); // Wait 1.5s per simulated step
      return () => clearTimeout(timer);
    } else {
      setIsProcessing(false);
    }
  }, [currentStep]);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-xl items-center justify-center"
        >
          <MaterialIcons name="close" size={24} color="#1D1A24" />
        </TouchableOpacity>
        <Text className="font-headline font-bold text-lg text-on-surface">
          Lumina Intelligence
        </Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
      >
        <View className="px-6 flex-1 mt-4">
          {file && (
            <View 
              className="flex-row items-center bg-surface-container rounded-2xl p-4 mb-8 border"
              style={{
                borderColor: 'rgba(204, 195, 216, 0.1)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <View 
                className="w-10 h-10 rounded-xl items-center justify-center -ml-1"
                style={{ backgroundColor: 'rgba(99, 14, 212, 0.1)' }}
              >
                <MaterialIcons name="receipt-long" size={20} color="#630ED4" />
              </View>
              <Text
                className="ml-3 font-body text-sm text-on-surface font-semibold max-w-[240px]"
                numberOfLines={1}
              >
                {file}
              </Text>
            </View>
          )}

          {isProcessing ? (
            <VerticalStepper steps={PROCESSING_STEPS} currentStepIndex={currentStep} />
          ) : (
            <ReceiptDecision
              isApproved={false}
              reasons={[
                'Exceeded daily per diem for meals by 35% ($245.00 vs $180.00 allowed).',
                'Receipt is missing the required vendor tax ID.',
              ]}
              onGoBack={() => router.back()}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

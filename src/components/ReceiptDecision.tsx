import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';

type ReceiptDecisionProps = {
  isApproved: boolean;
  reasons?: string[];
  onGoBack: () => void;
};

const ReceiptDecision = ({ isApproved, reasons, onGoBack }: ReceiptDecisionProps) => {
  const [isAppealing, setIsAppealing] = useState(false);
  const [appealText, setAppealText] = useState('');

  if (isAppealing) {
    return (
      <View 
        className="flex-1 bg-surface-container-low rounded-[24px] p-6 border mb-6"
        style={{
          borderColor: 'rgba(204, 195, 216, 0.1)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => setIsAppealing(false)} className="mr-3">
            <MaterialIcons name="arrow-back" size={24} color="#1D1A24" />
          </TouchableOpacity>
          <Text className="font-headline font-bold text-xl text-on-surface">Appeal Decision</Text>
        </View>

        <Text className="text-on-surface-variant font-body text-sm mb-4 leading-relaxed">
          Please explain why this expense should be approved despite the AI flag. 
          Your manager will review this manually.
        </Text>

        <TextInput
          className="bg-surface-container-highest rounded-2xl p-4 font-body text-on-surface text-base mb-6 border-b-2 border-[#630ED4]"
          style={{ minHeight: 120, textAlignVertical: 'top' }}
          placeholder="Describe your reasoning here..."
          placeholderTextColor="#7B7487"
          multiline
          value={appealText}
          onChangeText={setAppealText}
        />

        <TouchableOpacity 
          className="rounded-[24px] overflow-hidden w-full mb-4"
          style={{
            shadowColor: '#630ED4',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <LinearGradient
            colors={['#630ED4', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="flex-row items-center justify-center gap-2 py-4"
            style={{ borderRadius: 24 }}
          >
            <MaterialIcons name="send" size={20} color="white" />
            <Text className="text-white font-headline font-bold text-base">Submit Appeal</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center py-6">
      <View
        className={`w-20 h-20 rounded-full items-center justify-center mb-6`}
        style={{
          backgroundColor: isApproved ? '#630ED4' : '#FE6A34',
          shadowColor: isApproved ? '#630ED4' : '#FE6A34',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <MaterialIcons name={isApproved ? 'check' : 'warning'} size={40} color="white" />
      </View>
      
      <Text className="font-headline font-extrabold text-3xl text-on-surface mb-2 text-center">
        {isApproved ? 'Receipt Approved' : 'Action Required'}
      </Text>
      
      <Text className="text-on-surface-variant font-body text-sm text-center mb-8 max-w-[280px] leading-relaxed">
        {isApproved
          ? "This document complies with all active travel policies and has been logged successfully."
          : "Lumina Intelligence flagged this expense for policy violations that require your attention."}
      </Text>

      {!isApproved && reasons && (
        <View 
          className="bg-surface-container-low w-full rounded-[24px] p-6 mb-8 border"
          style={{
            borderColor: 'rgba(204, 195, 216, 0.1)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Text className="font-headline font-bold text-lg text-on-surface mb-4">
            Flags Detected
          </Text>
          <View className="gap-3">
            {reasons.map((reason, idx) => (
              <View key={idx} className="flex-row items-start gap-3">
                <View className="w-[6px] h-[6px] rounded-full bg-[#AB3500] mt-[6px]" />
                <Text className="font-body text-sm text-on-surface-variant flex-1 leading-relaxed">
                  {reason}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="w-full mt-auto mb-4">
        {!isApproved && (
          <TouchableOpacity
            onPress={() => setIsAppealing(true)}
            className="rounded-[24px] overflow-hidden w-full mb-4"
            style={{
              shadowColor: '#630ED4',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <LinearGradient
              colors={['#630ED4', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="flex-row items-center justify-center gap-2 py-4"
              style={{ borderRadius: 24 }}
            >
              <MaterialIcons name="edit-note" size={22} color="white" />
              <Text className="text-white font-headline font-bold text-base">Write an Appeal</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onGoBack}
          className="rounded-[24px] overflow-hidden w-full items-center justify-center py-4 bg-surface-container border border-outline-variant/30"
        >
          <Text className="text-on-surface font-headline font-bold text-base">
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReceiptDecision;

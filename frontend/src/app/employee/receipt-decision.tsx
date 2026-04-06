import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ReceiptDecisionProps = {
  isApproved: boolean;
  reasons?: string[];
  onGoBack: () => void;
};

const ReceiptDecision = ({ isApproved, reasons, onGoBack }: ReceiptDecisionProps) => {
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
            onPress={() => {
              // Navigate to appeal screen - would need to implement
              alert('Appeal functionality coming soon');
            }}
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

export default function ReceiptDecisionScreen() {
  const router = useRouter();
  const { receiptId, isApproved, reasons } = useLocalSearchParams<{ 
    receiptId?: string; 
    isApproved?: string; 
    reasons?: string | string[] 
  }>();

  const onGoBack = () => router.back();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <StatusBar style="dark" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
      >
        <View className="px-6 flex-1 mt-4">
          <ReceiptDecision
            isApproved={isApproved === 'true'}
            reasons={Array.isArray(reasons) ? reasons : (reasons ? [reasons] : [])}
            onGoBack={onGoBack}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, TextInput, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

type ReceiptDecisionProps = {
  isApproved: boolean;
  reasons?: string[];
  receiptId?: string;
  onGoBack: () => void;
};

const ReceiptDecision = ({ isApproved, reasons, receiptId, onGoBack }: ReceiptDecisionProps) => {
  const [isAppealing, setIsAppealing] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAppeal = async () => {
    if (!receiptId) return;
    if (explanation.trim().length === 0) {
      Alert.alert('Explanation Required', 'Please provide a reason for your appeal.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Insert appeal
      const { error: appealError } = await supabase
        .from('APPEALS')
        .insert({
          receipt_id: Number(receiptId),
          explanation: explanation.trim()
        });

      if (appealError) throw appealError;

      // 2. Update receipt status
      const { error: updateError } = await supabase
        .from('TRIP_RECEIPTS')
        .update({ status: 'appealed' })
        .eq('id', Number(receiptId));

      if (updateError) throw updateError;

      Alert.alert('Appeal Submitted', 'Your appeal has been successfully submitted to the auditor.', [
        { text: 'OK', onPress: onGoBack }
      ]);

    } catch (error) {
      console.error('Error submitting appeal:', error);
      Alert.alert('Error', 'Failed to submit appeal. Please try again.');
      setIsSubmitting(false);
    }
  };

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
          : "AI Intelligence flagged this expense for policy violations that require your attention."}
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
        {!isApproved && !isAppealing && (
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

        {isAppealing && (
          <View className="w-full mb-6 relative">
            <Text className="font-headline font-bold text-sm text-on-surface mb-2 px-1">Appeal Explanation</Text>
            <TextInput
              value={explanation}
              onChangeText={text => {
                if (text.length <= 100) setExplanation(text);
              }}
              placeholder="Explain why this receipt should be approved..."
              placeholderTextColor="#7b748780"
              multiline
              textAlignVertical="top"
              className="bg-surface-container-high rounded-2xl p-4 text-on-surface font-body text-base border border-outline-variant/30 min-h-[120px]"
            />
            <Text className={`text-xs mt-2 px-1 text-right font-label ${explanation.length >= 100 ? 'text-[#BA1A1A]' : 'text-on-surface-variant'}`}>
              {explanation.length}/100
            </Text>

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                onPress={() => setIsAppealing(false)}
                className="flex-1 py-3 items-center"
                disabled={isSubmitting}
              >
                <Text className="text-on-surface-variant font-headline font-bold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmitAppeal}
                disabled={isSubmitting || explanation.trim().length === 0}
                className={`flex-1 py-3 rounded-full items-center flex-row justify-center gap-2 ${explanation.trim().length > 0 ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MaterialIcons name="send" size={16} color={explanation.trim().length > 0 ? "white" : "#7b7487"} />
                    <Text className={`font-headline font-bold ${explanation.trim().length > 0 ? 'text-white' : 'text-on-surface-variant'}`}>
                      Submit
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!isAppealing && (
          <TouchableOpacity
            onPress={onGoBack}
            className="rounded-[24px] overflow-hidden w-full items-center justify-center py-4 bg-surface-container border border-outline-variant/30"
          >
            <Text className="text-on-surface font-headline font-bold text-base">
              Go Back
            </Text>
          </TouchableOpacity>
        )}
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
            receiptId={receiptId}
            onGoBack={onGoBack}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
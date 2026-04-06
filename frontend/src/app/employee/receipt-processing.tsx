import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ReceiptDecision from '@/components/ReceiptDecision';
import VerticalStepper from '@/components/VerticalStepper';
import { supabase } from '@/lib/supabase';
import { processReceipt } from '@/lib/receiptApi';

const PROCESSING_STEPS = [
  'Extracting the document',
  'Reading the document',
  'Checking the validity',
  'Checking for policy violations',
  'Finalizing the decision',
];

export default function ReceiptProcessingScreen() {
  const router = useRouter();
  const { file, url, tripId, userId, receiptId, userDescription } = useLocalSearchParams<{
    file?: string;
    url?: string;
    tripId?: string;
    userId?: string;
    receiptId?: string;
    userDescription?: string;
  }>();

  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [decisionResult, setDecisionResult] = useState<{isApproved: boolean, reasons: string[]} | null>(null);

  useEffect(() => {
    let isMounted = true;

    const runProcessing = async () => {
      if (!url || !tripId || !userId || !receiptId) {
        if (isMounted) setIsProcessing(false);
        return;
      }

      try {
        // Step 1: Getting trip data
        setCurrentStep(0);
        const { data: tripData, error: tripError } = await supabase
          .from('TRIP')
          .select(`
            *,
            TRIPLOCATIONS ( city, country )
          `)
          .eq('id', tripId)
          .single();

        if (tripError) throw tripError;

        const locations = tripData?.TRIPLOCATIONS?.map((loc: any) => `${loc.city}, ${loc.country}`) || [];
        const window = [tripData?.startDate, tripData?.endDate];

        setCurrentStep(1); // Reading Document
        
        const requestPayload = {
          image_url: url,
          user_image_description: userDescription || '',
          trip_metadata: {
            locations: locations,
            window: window as string[],
            budget_limit: `${tripData?.budget || 0} ${tripData?.currency || 'USD'}`,
            description: tripData?.description || ''
          }
        };

        // Step 2 & 3: AI Processing
        setCurrentStep(2);
        const result = await processReceipt(requestPayload);
        
        setCurrentStep(3); // Policy violation checks
        // Wait a small moment for UI to show step 3 before updating DB
        await new Promise(resolve => setTimeout(resolve, 500));

        // Step 4: Finalizing & DB Updates
        setCurrentStep(4);
        
        // Update TRIP_RECEIPTS
        const { error: updateError } = await supabase
          .from('TRIP_RECEIPTS')
          .update({
            merchant_name: result.merchant_name,
            merchant_location: result.merchant_location,
            amount: result.receipt_amount,
            currency: result.currency,
            receipt_date: result.receipt_date,
            extracted_description: result.extracted_description,
            status: result.decision === 'approved' ? 'approved' : 'rejected',
            ai_reason: result.justification?.join('\n') || result.policy_violations?.join('\n'),
          })
          .eq('id', receiptId);
          
        if (updateError) console.error("Error updating receipt", updateError);

        if (result.decision === 'approved' && result.receipt_amount) {
          // Increment expenditure
          const { data: userTrip, error: utError } = await supabase
            .from('USERTRIPS')
            .select('expenditure')
            .eq('user_id', userId)
            .eq('trip_id', tripId)
            .single();

          if (!utError && userTrip) {
            const currentExp = Number(userTrip.expenditure) || 0;
            const newExp = currentExp + Number(result.receipt_amount);
            await supabase
              .from('USERTRIPS')
              .update({ expenditure: newExp })
              .eq('user_id', userId)
              .eq('trip_id', tripId);
          }
        }

        if (isMounted) {
          setDecisionResult({
            isApproved: result.decision === 'approved',
            reasons: result.decision === 'approved' ? [] : (result.justification || result.policy_violations || [])
          });
          setIsProcessing(false);
        }

      } catch (error) {
        console.error("Processing failed:", error);
        if (isMounted) {
          setDecisionResult({
            isApproved: false,
            reasons: ['An error occurred during receipt processing. Please try again.']
          });
          setIsProcessing(false);
        }
      }
    };

    runProcessing();

    return () => { isMounted = false; };
  }, [url, tripId, userId, receiptId, userDescription]);

  // Use string navigation for push
  const handleGoBack = () => {
    router.replace(`/employee/trip-details?id=${tripId}`);
  };

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
              isApproved={decisionResult?.isApproved || false}
              reasons={decisionResult?.reasons || []}
              onGoBack={handleGoBack}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
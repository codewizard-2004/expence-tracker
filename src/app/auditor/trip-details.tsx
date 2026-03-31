import CityImage from "@/assets/images/city.png";
import HeroTripCard from '@/components/HeroTripCard';
import TripBudgetCard from "@/components/TripBudgetCard";
import TripObjectives from "@/components/TripObjectives";
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const purpose = "The annual strategy summit brings together key leadership to finalize the 2024 product roadmap and align on regional expansion goals. This trip involves critical partner networking and team-building sessions at the Macrosoft Global HQ."

const OBJECTIVES = [
  {
    title: 'Finalize Q1-Q2 Roadmap',
    description: 'Reviewing engineering capacity and market trends.',
    color: '#630ED4',
  },
  {
    title: 'Regional Alignment',
    description: 'Syncing goals between North America and EMEA leads.',
    color: '#AB3500',
  },
];

const RECEIPTS = [
  {
    icon: 'restaurant',
    name: 'The Cliff House',
    user: 'Jane Doe',
    date: 'Oct 13, 2023',
    amount: '$245.00',
    policyCheck: 'Warning',
    reason: "Flagged for exceeding the daily dining limit by $45.00 based on the 'SF Per Diem' rule.",
    isAppealed: true,
  },
  {
    icon: 'flight',
    name: 'United Airlines',
    user: 'Alice Smith',
    date: 'Oct 12, 2023',
    amount: '$1120.50',
    policyCheck: 'Approved',
    reason: "Within standard variance limits for early transcontinental bookings.",
    isAppealed: false,
  },
];

const ReceiptAuditModal = ({ visible, onClose, receipt }: any) => {
  if(!receipt) return null;
  return (
    <Modal visible={visible} transparent animationType="slide">
       <View className="flex-1 justify-end bg-[#1D1A24]/60">
        <View className="bg-surface rounded-t-[32px] p-6 max-h-[90%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="font-headline font-bold text-xl text-on-surface tracking-tight">Audit Receipt</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={onClose} className="p-2 bg-surface-container-high rounded-full">
               <MaterialIcons name="close" size={20} color="#4A4455" />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
             {/* Dummy Image */}
             <View className="w-full h-48 bg-surface-container-high rounded-2xl mb-6 items-center justify-center border border-outline-variant/20 overflow-hidden">
                <Text className="text-on-surface-variant font-headline font-bold mb-2">Attached Document.jpg</Text>
                <MaterialIcons name="receipt-long" size={48} color="#4A4455" />
             </View>

             <Text className="font-headline font-bold text-2xl text-on-surface mb-1">{receipt.name}</Text>
             <Text className="font-body text-base text-on-surface-variant mb-6">{receipt.amount} • {receipt.date} • {receipt.user}</Text>
             
             {/* AI Decision Block */}
             <View className={`p-5 rounded-2xl mb-6 border ${receipt.policyCheck === 'Approved' ? 'bg-primary/10 border-primary/20' : 'bg-secondary/10 border-secondary/20'}`}>
                <Text className={`font-headline font-bold text-sm mb-2 uppercase tracking-wide ${receipt.policyCheck === 'Approved' ? 'text-primary' : 'text-secondary'}`}>Lumina AI Decision: {receipt.policyCheck}</Text>
                <Text className="font-body text-sm text-on-surface leading-relaxed">
                   {receipt.reason}
                </Text>
                {receipt.isAppealed && (
                  <View className="bg-[#BA1A1A]/10 p-4 mt-4 rounded-xl border border-[#BA1A1A]/20">
                     <View className="flex-row items-center gap-2 mb-2">
                       <MaterialIcons name="error-outline" size={18} color="#BA1A1A" />
                       <Text className="text-[#BA1A1A] font-bold text-xs uppercase tracking-wider">Employee Appeal</Text>
                     </View>
                     <Text className="text-[#BA1A1A] font-body text-sm italic">"I was dining with a client and this was the only available table. Pre-approved by director."</Text>
                  </View>
                )}
             </View>
             
             {receipt.policyCheck !== 'Approved' && (
               <TouchableOpacity className="bg-primary py-4 rounded-full items-center justify-center shadow-sm mb-4">
                 <Text className="text-white font-headline font-bold text-base">Override AI Decision</Text>
               </TouchableOpacity>
             )}
             <TouchableOpacity activeOpacity={0.8} onPress={onClose} className="bg-surface-container-highest py-4 rounded-full items-center justify-center shadow-sm">
                 <Text className="text-on-surface font-headline font-bold text-base">Close</Text>
             </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

export default function AuditorTripDetailsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'receipts'>('details');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-xl items-center justify-center"
        >
          <MaterialIcons name="arrow-back" size={24} color="#1D1A24" />
        </TouchableOpacity>
        <Text className="font-headline font-bold text-lg text-on-surface tracking-tight">
          Trip Workflow
        </Text>
        <TouchableOpacity className="w-10 h-10 rounded-xl items-center justify-center">
          <MaterialIcons name="more-vert" size={24} color="#1D1A24" />
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View className="flex-row mx-6 mb-6 bg-surface-container-high rounded-full p-1 mt-2">
        <TouchableOpacity
          onPress={() => setActiveTab('details')}
          className={`flex-1 py-2.5 rounded-full items-center transition-colors ${activeTab === 'details' ? 'bg-primary' : 'bg-transparent'}`}
        >
          <Text
            className={`font-body font-semibold text-sm ${activeTab === 'details' ? 'text-white' : 'text-on-surface-variant'}`}
          >
            Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('receipts')}
          className={`flex-1 py-2.5 rounded-full items-center transition-colors ${activeTab === 'receipts' ? 'bg-primary' : 'bg-transparent'}`}
        >
          <Text
            className={`font-body font-semibold text-sm ${activeTab === 'receipts' ? 'text-white' : 'text-on-surface-variant'}`}
          >
            Audit Receipts
          </Text>
        </TouchableOpacity>
      </View>

      <ReceiptAuditModal
        visible={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {activeTab === 'details' ? (
          <View className="px-6">
            <HeroTripCard
              image={CityImage}
              title="Q4 Strategy Summit"
              location="San Francisco, CA"
              dateStart="Oct 12, 2023"
              dateEnd="Oct 15, 2023"
            />

            <TripObjectives OBJECTIVES={OBJECTIVES} purpose={purpose} />

            <TripBudgetCard
              totalBudget={12500}
              currency="$"
              amountSpent={8450.20}
              remaining={4049.80}
              progress={68}
            />

            <View className="bg-surface-container rounded-[24px] p-5 mb-8 flex-row gap-4 mt-8">
              <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                <MaterialIcons name="auto-awesome" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-on-surface font-headline font-bold text-sm mb-2">
                  Lumina Insight
                </Text>
                <Text className="text-on-surface-variant font-body text-xs leading-relaxed">
                  Employees have spent{' '}
                  <Text className="font-bold text-secondary">15% more on dining</Text>{' '}
                  compared to previous San Francisco trips. Budget alert risk is moderate.
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="px-6">
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-on-surface font-headline font-bold text-2xl tracking-tight">
                  Submitted Receipts
                </Text>
              </View>

              <View className="gap-5">
                {RECEIPTS.map((receipt, index) => (
                  <TouchableOpacity 
                    key={index} 
                    activeOpacity={0.8}
                    onPress={() => setSelectedReceipt(receipt)}
                    className={`rounded-3xl overflow-hidden shadow-sm border ${receipt.isAppealed ? 'bg-[#BA1A1A]/10 border-[#BA1A1A]/30' : 'bg-surface-container border-transparent'}`}
                  >
                    <View className="p-5 flex-row items-center gap-4">
                       <View className={`w-12 h-12 rounded-[14px] items-center justify-center ${receipt.policyCheck === 'Warning' ? 'bg-secondary-container' : 'bg-primary-container'} ${receipt.isAppealed && 'bg-[#BA1A1A]/20'}`}>
                         <MaterialIcons
                           name={receipt.icon as any}
                           size={24}
                           color={receipt.isAppealed ? '#BA1A1A' : (receipt.policyCheck === 'Warning' ? '#AB3500' : '#630ED4')}
                         />
                       </View>
                       <View className="flex-1">
                         <View className="flex-row justify-between items-start">
                           <Text className={`font-body font-bold text-base ${receipt.isAppealed ? 'text-[#BA1A1A]' : 'text-on-surface'}`}>
                             {receipt.name}
                           </Text>
                           <Text className="font-headline font-bold text-base text-on-surface">
                             {receipt.amount}
                           </Text>
                         </View>
                         {receipt.isAppealed ? (
                            <Text className="font-label text-[10px] text-[#BA1A1A] font-bold mt-1.5 uppercase tracking-wider">
                              APPEAL PENDING • {receipt.user}
                            </Text>
                         ) : (
                            <Text className="font-label text-[10px] text-on-surface-variant mt-1.5 uppercase tracking-wider">
                              {receipt.policyCheck.toUpperCase()} • {receipt.user}
                            </Text>
                         )}
                       </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

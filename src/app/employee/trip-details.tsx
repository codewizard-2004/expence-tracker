import CityImage from "@/assets/images/city.png";
import FileUpload from '@/components/FileUpload';
import HeroTripCard from '@/components/HeroTripCard';
import TripBudgetCard from "@/components/TripBudgetCard";
import TripObjectives from "@/components/TripObjectives";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
  {
    title: 'Partner Gala',
    description: 'High-level networking with tier-1 enterprise clients.',
    color: '#630ED4',
  },
  {
    title: 'Lumina Integration',
    description: 'Pilot testing the new AI expense tracking module.',
    color: '#7C3AED',
  },
];

const RECEIPTS = [
  {
    icon: 'restaurant',
    name: 'The Cliff House',
    date: 'Oct 13, 2023',
    amount: '$245.00',
  },
  {
    icon: 'flight',
    name: 'United Airlines',
    date: 'Oct 12, 2023',
    amount: '$1120.50',
  },
];

export default function TripDetailsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'receipts'>('details');

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
        <Text className="font-headline font-bold text-lg text-on-surface">
          Trip Details
        </Text>
        <TouchableOpacity className="w-10 h-10 rounded-xl items-center justify-center">
          <MaterialIcons name="more-vert" size={24} color="#1D1A24" />
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View className="flex-row mx-6 mb-6 bg-surface-container-high rounded-full p-1">
        <TouchableOpacity
          onPress={() => setActiveTab('details')}
          className={`flex-1 py-2.5 rounded-full items-center ${activeTab === 'details' ? 'bg-primary' : 'bg-transparent'}`}
        >
          <Text
            className={`font-body font-semibold text-sm ${activeTab === 'details' ? 'text-white' : 'text-on-surface-variant'}`}
          >
            Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('receipts')}
          className={`flex-1 py-2.5 rounded-full items-center ${activeTab === 'receipts' ? 'bg-primary' : 'bg-transparent'}`}
        >
          <Text
            className={`font-body font-semibold text-sm ${activeTab === 'receipts' ? 'text-white' : 'text-on-surface-variant'}`}
          >
            Upload Receipts
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {activeTab === 'details' ? (
          <View className="px-6">
            {/* Hero Trip Card */}
            <HeroTripCard
              image={CityImage}
              title="Q4 Strategy Summit"
              location="San Francisco, CA"
              dateStart="Oct 12, 2023"
              dateEnd="Oct 15, 2023"
            />

            {/* Trip Purpose */}

            <TripObjectives OBJECTIVES={OBJECTIVES} purpose={purpose} />

            {/* Budget Card */}
            <TripBudgetCard
              totalBudget={12500}
              currency="$"
              amountSpent={8450.20}
              remaining={4049.80}
              progress={68}
            />

            {/* Lumina Insight */}
            <View className="bg-surface-container rounded-[24px] p-5 mb-8 flex-row gap-4">
              <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                <MaterialIcons name="auto-awesome" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-on-surface font-headline font-bold text-sm mb-2">
                  Lumina Insight
                </Text>
                <Text className="text-on-surface-variant font-body text-xs leading-relaxed">
                  You've spent{' '}
                  <Text className="font-bold text-secondary">15% more on dining</Text>{' '}
                  compared to previous San Francisco trips. Consider using preferred corporate
                  caterers for the remaining summit days.
                </Text>
              </View>
            </View>

          </View>
        ) : (
          /* Upload Receipts Tab Content */
          <View className="px-6">
            <FileUpload />

            {/* Recent Receipts */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-on-surface font-headline font-bold text-lg">
                  Recent Receipts
                </Text>
                <TouchableOpacity>
                  <Text className="text-primary font-body font-bold text-xs uppercase tracking-widest">
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="gap-3">
                {RECEIPTS.map((receipt, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    className="flex-row items-center bg-surface-container-low rounded-2xl p-4 gap-4"
                  >
                    <View className="w-10 h-10 rounded-xl bg-primary-fixed items-center justify-center">
                      <MaterialIcons
                        name={receipt.icon as any}
                        size={20}
                        color="#630ED4"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="font-body font-bold text-sm text-on-surface">
                        {receipt.name}
                      </Text>
                      <Text className="font-label text-[10px] text-on-surface-variant mt-0.5 uppercase tracking-wider">
                        {receipt.date}
                      </Text>
                    </View>
                    <Text className="font-headline font-bold text-sm text-on-surface">
                      {receipt.amount}
                    </Text>
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

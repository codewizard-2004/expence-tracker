import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import CityImage from "@/assets/images/city.png";

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
            <View
              className="relative rounded-[24px] overflow-hidden mb-8"
              style={{ minHeight: 220 }}
            >
              <Image
                source={CityImage}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
              />
              <BlurView
                intensity={40}
                tint="dark"
                style={StyleSheet.absoluteFillObject}
              />
              <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.2)' }]} />
              <View className="p-6 pt-8 z-10 items-center justify-center" style={{ minHeight: 220 }}>
                <View className="flex-row items-center gap-1 mb-3">
                  <MaterialIcons name="location-on" size={14} color="rgba(255,255,255,0.85)" />
                  <Text className="text-white/85 font-label text-xs uppercase tracking-widest font-bold">
                    San Francisco, CA
                  </Text>
                </View>
                <Text className="font-headline font-extrabold text-3xl text-white text-center mb-4">
                  Q4 Strategy{`\n`}Summit
                </Text>
                <View className="flex-row items-center gap-6">
                  <View className="flex-row items-center gap-1.5">
                    <MaterialIcons name="date-range" size={14} color="rgba(255,255,255,0.7)" />
                    <Text className="text-white/70 font-label text-xs font-medium">
                      Oct 12 - Oct 15
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <MaterialIcons name="group" size={14} color="rgba(255,255,255,0.7)" />
                    <Text className="text-white/70 font-label text-xs font-medium">
                      Corporate Elite
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Trip Purpose */}
            <View className="mb-8">
              <View className="flex-row items-center gap-2 mb-4">
                <Text className="text-on-surface font-headline font-bold text-lg">
                  ✈️ Trip Purpose
                </Text>
              </View>
              <Text className="text-on-surface-variant font-body text-sm leading-relaxed">
                The annual strategy summit brings together key leadership to finalize the 2024
                product roadmap and align on regional expansion goals. This trip involves
                critical partner networking and team-building sessions at the Macrosoft Global HQ.
              </Text>
            </View>

            {/* Key Objectives */}
            <View className="mb-8">
              <Text className="text-on-surface font-headline font-bold text-lg mb-4">
                Key Objectives
              </Text>
              <View className="gap-3">
                {OBJECTIVES.map((obj, index) => (
                  <View
                    key={index}
                    className="flex-row items-start gap-4 bg-surface-container-low rounded-2xl p-4"
                  >
                    <View
                      className="w-1 self-stretch rounded-full mt-0.5"
                      style={{ backgroundColor: obj.color }}
                    />
                    <View className="flex-1">
                      <Text className="font-body font-bold text-sm text-on-surface mb-1">
                        {obj.title}
                      </Text>
                      <Text className="font-body text-xs text-on-surface-variant">
                        {obj.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Budget Card */}
            <View className="rounded-[24px] overflow-hidden mb-8 shadow-lg shadow-primary/10">
              <LinearGradient
                colors={['#630ED4', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-6"
                style={{ borderRadius: 24 }}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-white/70 font-label text-[10px] uppercase tracking-widest font-bold">
                    Total Budget
                  </Text>
                  <View className="w-8 h-8 rounded-xl bg-white/20 items-center justify-center">
                    <MaterialIcons name="account-balance-wallet" size={16} color="white" />
                  </View>
                </View>
                <Text className="font-headline font-extrabold text-3xl text-white mb-5">
                  $12,500.00
                </Text>

                {/* Progress */}
                <View className="mb-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white/80 font-body text-xs font-semibold">
                      Spending Progress
                    </Text>
                    <Text className="text-white font-body text-xs font-bold">
                      68%
                    </Text>
                  </View>
                  <View className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-secondary-container rounded-full"
                      style={{ width: '68%' }}
                    />
                  </View>
                </View>

                {/* Amount Spent / Remaining */}
                <View className="flex-row justify-between pt-2">
                  <View>
                    <Text className="text-white/60 font-label text-[10px] uppercase tracking-widest font-bold mb-1">
                      Amount Spent
                    </Text>
                    <Text className="text-white font-headline font-bold text-lg">
                      $8,450.20
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-white/60 font-label text-[10px] uppercase tracking-widest font-bold mb-1">
                      Remaining
                    </Text>
                    <Text className="text-white font-headline font-bold text-lg">
                      $4,049.80
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

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
            <View className="items-center py-12">
              <View className="w-20 h-20 rounded-full bg-surface-container-high items-center justify-center mb-6">
                <MaterialIcons name="cloud-upload" size={40} color="#630ED4" />
              </View>
              <Text className="font-headline font-bold text-xl text-on-surface mb-2 text-center">
                Upload Receipts
              </Text>
              <Text className="text-on-surface-variant font-body text-sm text-center mb-8 max-w-xs leading-relaxed">
                Drag & drop receipts or tap below to scan and add expenses to this trip.
              </Text>
              <TouchableOpacity className="rounded-[24px] overflow-hidden shadow-lg shadow-primary/20 w-full">
                <LinearGradient
                  colors={['#630ED4', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="flex-row items-center justify-center gap-3 py-4"
                  style={{ borderRadius: 24 }}
                >
                  <MaterialIcons name="add-a-photo" size={22} color="white" />
                  <Text className="text-white font-headline font-bold text-base">
                    Scan Receipt
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

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

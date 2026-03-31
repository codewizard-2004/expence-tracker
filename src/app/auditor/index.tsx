import CityImage from "@/assets/images/city.png";
import ActiveTripCard from '@/components/ActiveTripCard';
import TopNavigator from '@/components/TopNavigator';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function AuditorHome() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface pt-8">
      <StatusBar style="dark" />
      <TopNavigator mode='auditor' />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 flex-1 mt-6">
          
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={() => router.push('/auditor/create-trip')}
            className="mb-10 bg-surface-container rounded-3xl p-6 shadow-sm border border-outline-variant/15 flex-row items-center gap-4"
          >
             <View className="w-14 h-14 rounded-2xl bg-secondary-container items-center justify-center">
                <MaterialIcons name="flight-takeoff" size={28} color="#AB3500" />
             </View>
             <View className="flex-1">
               <Text className="font-headline font-bold text-xl text-on-surface tracking-tight mb-0.5">
                 Create New Trip
               </Text>
               <Text className="font-body text-xs text-on-surface-variant leading-relaxed pr-2">
                 Set up parameters, budget, dates, and assign your audit teams.
               </Text>
             </View>
             <View className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center">
               <MaterialIcons name="chevron-right" size={20} color="#630ED4" />
             </View>
          </TouchableOpacity>

          {/* Active Trips Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="font-headline font-bold text-2xl text-on-surface tracking-tight">
              Managed Trips
            </Text>
          </View>

          {/* Trips List */}
          <View className="gap-6 mb-4">
            <TouchableOpacity activeOpacity={0.9} onPress={() => router.push("/auditor/trip-details")}>
              <View pointerEvents="none">
                <ActiveTripCard
                  image={CityImage}
                  title='Q4 Strategy Summit'
                  location='San Francisco'
                  budget={12500}
                  spent={8450}
                  currency='$'
                  startDate='Oct 12'
                  endDate='Oct 15'
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

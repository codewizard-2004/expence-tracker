import CityImage from "@/assets/images/city.png";
import ActiveTripCard from '@/components/ActiveTripCard';
import SecondaryAction from "@/components/SecondaryAction";
import TopNavigator from '@/components/TopNavigator';
import TotalSpendCard from '@/components/TotalSpendCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmployeeHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface pt-8">
      <StatusBar style="dark" />
      {/* Header - Fixed at top */}
      <TopNavigator mode='employee' />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="px-6 flex-1">
          {/* Hero Summary */}
          <View className="mb-10 mt-2">
            <View className="mb-6">
              <Text className="font-headline font-extrabold text-4xl text-on-surface mb-2 tracking-tight">
                Financial{`\n`}Intelligence
              </Text>
              <Text className="text-on-surface-variant text-lg">
                Your active journeys, curated and tracked by AI.
              </Text>
            </View>

            <TotalSpendCard amount={12450.80} currency="$" percentageChange={4.2} />
          </View>

          {/* Active Trips Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="font-headline font-bold text-2xl text-on-surface">
              Your Active Trips
            </Text>
            <TouchableOpacity className="flex-row items-center gap-1">
              <Text className="text-primary font-bold text-sm">View All</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#630ED4" />
            </TouchableOpacity>
          </View>

          {/* Trips List */}
          <View className="gap-6 mb-12">
            {/* Trip Card 1 */}
            <ActiveTripCard
              image={CityImage}
              title='Q4 Strategy Summit'
              location='New York'
              budget={5000}
              spent={2840}
              currency='$'
              startDate='Oct 12'
              endDate='Oct 18'
            />

          </View>

          {/* Secondary Action - Upload Receipt */}
          <SecondaryAction />
        </View>
      </ScrollView>
    </View>
  );
}

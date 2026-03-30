import EmployeeImage from "@/assets/images/employee.png";
import AnalyticsCard from "@/components/AnalyticsCard";
import ProgressBar from "@/components/ProgressBar";
import TopNavigator from "@/components/TopNavigator";
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Pie Chart Data ---
const EXPENSE_DATA = [
  { label: 'Travel', subtitle: 'Flights & Trains', amount: 1840, color: '#630ED4', pct: 53 },
  { label: 'Meals', subtitle: 'Dining & Catering', amount: 942, color: '#FE6A34', pct: 27 },
  { label: 'Lodging', subtitle: 'Hotel & Housing', amount: 700, color: '#7b7487', pct: 20 },
];

const TOTAL_SPEND = 3482;



export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface pt-8">
      <StatusBar style="dark" />

      {/* Header */}
      <TopNavigator mode='employee' />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 100, 140), paddingHorizontal: 24 }}
      >
        {/* Profile Card */}
        <View className="items-center pt-4 mb-10">
          <View className="relative mb-4">
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 40,
              overflow: 'hidden',
              transform: [
                { perspective: 1000 },
                { rotateZ: '2deg' },   // slight tilt
                { rotateX: '-2deg' },    // depth
                { rotateY: '2deg' },   // side tilt
              ]
            }} className="shadow-lg relative bg-primary-container">
              <Image
                source={EmployeeImage}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
              />
            </View>
            <TouchableOpacity
              className="absolute bottom-[-2px] right-[-2px] w-9 h-9 rounded-2xl bg-[#fe6a34] items-center justify-center shadow-lg border-[3px] border-surface z-20"
              activeOpacity={0.8}
            >
              <MaterialIcons name="edit" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="font-headline font-extrabold text-2xl text-on-surface mb-1">
            John Doe
          </Text>
          <Text className="font-body font-semibold text-sm text-primary mb-3">
            Senior Consultant
          </Text>
        </View>

        {/* Expense Analytics */}
        <View className="mb-10">
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="font-headline font-extrabold text-xl text-on-surface">
                Expense Analytics
              </Text>
              <Text className="font-body text-xs text-on-surface-variant mt-1">
                Monthly spending breakdown by category
              </Text>
            </View>
          </View>

          <AnalyticsCard EXPENSE_DATA={EXPENSE_DATA} TOTAL_SPEND={TOTAL_SPEND} />
        </View>

        {/* Approval Status */}
        <View className="mb-10">
          <View className="flex-row justify-between items-start mb-4">
            <Text className="font-headline font-extrabold text-xl text-on-surface">
              Approval{'\n'}Status
            </Text>
            <View className="items-end">
              <Text className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                Total: 142
              </Text>
              <Text className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                Expenses
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <ProgressBar approved={82} disapproved={18} />
        </View>

        {/* Account Settings */}
        <View className="mb-6">
          <Text className="font-headline font-extrabold text-xl text-on-surface mb-4">
            Account Settings
          </Text>
          <TouchableOpacity
            className="flex-row items-center bg-surface-container-low rounded-2xl p-4 gap-4"
            activeOpacity={0.8}
            onPress={() => router.replace('/sign-in')}
          >
            <View className="w-10 h-10 rounded-xl bg-error-container/30 items-center justify-center">
              <MaterialIcons name="logout" size={20} color="#BA1A1A" />
            </View>
            <View className="flex-1">
              <Text className="font-body font-bold text-sm text-error">
                Logout
              </Text>
              <Text className="font-label text-[10px] text-on-surface-variant mt-0.5">
                Sign out of all devices
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#7b7487" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

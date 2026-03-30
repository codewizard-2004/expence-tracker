import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmployeeHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface pt-10">
      <StatusBar style="dark" />
      {/* Header - Fixed at top */}
      <View className="flex-row justify-between items-center w-full px-6 py-4 bg-surface z-40">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-primary-container items-center justify-center overflow-hidden shadow-sm">
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlgPru9J2fs-KkE4LJ8Eay0MmD1kBibKA5K_SUBo_leYaTd0ZYtgVOzhLQC36NETkqQoqlMOteAmnT8Sw5512QMpnuGrVPwyGpdbIrCgxVh15bO4x_BiYmu6BaNrJPL-O0-BhiX5HqN0YDQPwwLGE81ErrA8qbWc-Ky2jk7anKZ-RrUR_fVNgds0aL0dFywplo68sOmKBOA2ih8IIqYtVwL_qFCgSIxmCIXdyCYiugCkMs0veT3bRu1wwbFk9KAlVDGDdx48y6Hlda',
              }}
              className="w-full h-full"
              contentFit="cover"
            />
          </View>
          <Text className="font-headline font-bold text-2xl tracking-tighter text-primary">
            Macrosoft
          </Text>
        </View>
        <TouchableOpacity className="p-2 rounded-full active:bg-surface-container opacity-80 transition-opacity">
          <MaterialIcons name="notifications-none" size={24} color="#7b7487" />
        </TouchableOpacity>
      </View>

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

            <TouchableOpacity className="shadow-xl shadow-primary/20 rounded-[24px] overflow-hidden" activeOpacity={0.9}>
              <LinearGradient
                colors={['#630ED4', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-8"
                style={{ borderRadius: 24 }}
              >
                <View className="flex-row justify-between items-start mb-6">
                  <Text className="font-label text-xs uppercase tracking-widest text-white/80 font-bold">
                    Total Monthly Spend
                  </Text>
                  <MaterialIcons name="account-balance-wallet" size={20} color="rgba(255,255,255,0.8)" />
                </View>
                <Text className="text-4xl font-headline font-extrabold text-white mb-4">
                  $12,450.80
                </Text>
                <View className="flex-row items-center gap-2 bg-white/20 self-start px-3 py-1.5 rounded-full">
                  <MaterialIcons name="trending-up" size={14} color="white" />
                  <Text className="text-white text-xs font-semibold">
                    4.2% from last month
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
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
            <TouchableOpacity activeOpacity={0.9} className="rounded-3xl overflow-hidden shadow-lg shadow-black/10 h-[280px] border border-outline-variant/20" onPress={() => router.push('/employee/trip-details' as any)}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHmQ0Z6i6v8M4xX7Mv0JzG9l6n5h1k8u9L7v0n3f4i2c5b6a7a1b3c4d5e6f7g8h9i0j',
                }}
                className="absolute inset-0 w-full h-full"
                contentFit="cover"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
                className="absolute inset-0"
              />
              <View className="flex-1 justify-end p-6 z-10 w-full">
                <View className="flex-row justify-between items-start mb-4">
                  <View>
                    <Text className="font-headline font-bold text-xl text-white mb-1">
                      Q4 Strategy Summit
                    </Text>
                    <Text className="font-label text-sm text-white/80">
                      San Francisco, CA
                    </Text>
                  </View>
                  <View className="w-8 h-8 rounded-lg bg-white/20 items-center justify-center backdrop-blur-md">
                    <MaterialIcons name="flight-takeoff" size={16} color="white" />
                  </View>
                </View>

                <View className="gap-3">
                  <View className="flex-row justify-between items-end">
                    <Text className="text-[10px] font-label uppercase tracking-widest text-white/80 font-bold">
                      Budget Status
                    </Text>
                    <Text className="text-sm font-headline font-bold text-white">
                      $2,840 / $5,000
                    </Text>
                  </View>
                  <View className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                    <View className="h-full bg-primary-fixed-dim rounded-full" style={{ width: '56.8%' }} />
                  </View>

                  <View className="flex-row justify-between items-center pt-2">
                    <Text className="text-[10px] font-label text-white/70 font-bold">
                      Oct 12 - Oct 18
                    </Text>
                    <View className="flex-row -space-x-2">
                      <View className="w-6 h-6 rounded-full border border-white/30 bg-slate-200 overflow-hidden">
                        <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAr0ffqCZdq5ZG1kv-RUu7NxSW6MAr0a2edY49W-ui1MvQXk2GXR2LUtfOVdvRb0fT5nmn0dpVd23X0vTTlukfFi4gj51p7n-6wfmImas3PPCiDK1R0cjc3pkmXS62jYaVsbnZzaxrMcfNR3i_YjH-3xgVyDx3Q-JqBbnKqIcISUa5PXLmXAbO0uX3zMw6VGxRAIgUF5MxRIXO3DfVIDyqK-xagPEJlgJeS4h1QRCBM8YN40z22oWsURLj3FhYseRlgnN9R6xagrAsT" }} className="w-full h-full" contentFit="cover" />
                      </View>
                      <View className="w-6 h-6 rounded-full border border-white/30 bg-slate-300 overflow-hidden">
                        <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCMfIMZjc0c79vbEXgLlI68c1XZ34GzVP2cgbnN1jf9OPe5tTi3wy8HImPOPv96ISgWkSIuWGwbbAqG9z2JVzNgEDWsOo2eBKpDhMPqYsSyJPETdIzQJ0Ct2iwOzQP5YlDobhdbVK6qQ_i-lCLKjfU4vnvuubYmelBM-aLQQy0ONjt_sLiqvkJaHza8JwaYETMc_Omw9GaZKWE1WmrCMIC3BRird7-ZHOAHHcxjoeQ0duYnhFsSteqmvFPYMj7rrwprA59h1rlTGCf" }} className="w-full h-full" contentFit="cover" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

          </View>

          {/* Secondary Action - Upload Receipt */}
          <View className="bg-surface-container rounded-3xl p-8 pb-10 items-center border border-outline-variant/10">
            <Text className="font-headline font-extrabold text-2xl text-on-surface mb-3 text-center">
              Found a new expense?
            </Text>
            <Text className="text-on-surface-variant font-medium text-center mb-8 px-2 leading-relaxed">
              Capture your receipts instantly. Our AI will automatically categorize and match them to your active trips.
            </Text>

            <TouchableOpacity className="shadow-lg shadow-secondary/30 rounded-[24px] w-full overflow-hidden" activeOpacity={0.9}>
              <LinearGradient
                colors={['#ab3500', '#fe6a34']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row items-center justify-center gap-3 py-4"
                style={{ borderRadius: 24 }}
              >
                <MaterialIcons name="cloud-upload" size={24} color="white" />
                <Text className="text-white font-headline font-bold text-lg">
                  Upload Receipt
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

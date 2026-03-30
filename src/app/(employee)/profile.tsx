import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';

// --- Pie Chart Data ---
const EXPENSE_DATA = [
  { label: 'Travel', subtitle: 'Flights & Trains', amount: 1840, color: '#630ED4', pct: 53 },
  { label: 'Meals', subtitle: 'Dining & Catering', amount: 942, color: '#FE6A34', pct: 27 },
  { label: 'Lodging', subtitle: 'Hotel & Housing', amount: 700, color: '#7b7487', pct: 20 },
];

const TOTAL_SPEND = 3482;

// --- SVG Donut Chart Component ---
function DonutChart({ size = 180, strokeWidth = 28 }: { size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  // Build arcs: each segment is an offset along the circle
  let cumulativeOffset = 0;
  // Start from the top (-90deg rotation applied via G transform)
  const segments = EXPENSE_DATA.map((seg) => {
    const segLen = (seg.pct / 100) * circumference;
    const gap = 4; // small gap between segments
    const dash = `${segLen - gap} ${circumference - segLen + gap}`;
    const offset = -cumulativeOffset;
    cumulativeOffset += segLen;
    return { ...seg, dash, offset };
  });

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="#EDE5F4"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Rotate so arcs start from 12 o'clock */}
        <G rotation={-90} origin={`${cx}, ${cy}`}>
          {segments.map((seg, i) => (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={seg.dash}
              strokeDashoffset={seg.offset}
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </G>
      </Svg>
      {/* Center label */}
      <View className="absolute items-center justify-center">
        <Text className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant font-bold">
          Total Spend
        </Text>
        <Text className="font-headline font-extrabold text-2xl text-on-surface">
          ${TOTAL_SPEND.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />

      {/* Header */}
      <View
        className="flex-row justify-between items-center w-full px-6 py-4 bg-surface z-40"
        style={{ paddingTop: insets.top + 8 }}
      >
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
        <TouchableOpacity className="p-2 rounded-full">
          <MaterialIcons name="notifications-none" size={24} color="#7b7487" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 100, 140), paddingHorizontal: 24 }}
      >
        {/* Profile Card */}
        <View className="items-center pt-4 mb-10">
          <View className="relative mb-4">
            <View className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-primary shadow-lg">
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlgPru9J2fs-KkE4LJ8Eay0MmD1kBibKA5K_SUBo_leYaTd0ZYtgVOzhLQC36NETkqQoqlMOteAmnT8Sw5512QMpnuGrVPwyGpdbIrCgxVh15bO4x_BiYmu6BaNrJPL-O0-BhiX5HqN0YDQPwwLGE81ErrA8qbWc-Ky2jk7anKZ-RrUR_fVNgds0aL0dFywplo68sOmKBOA2ih8IIqYtVwL_qFCgSIxmCIXdyCYiugCkMs0veT3bRu1wwbFk9KAlVDGDdx48y6Hlda',
                }}
                className="w-full h-full"
                contentFit="cover"
              />
            </View>
            {/* Online indicator */}
            <View className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white" />
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
                Expense{'\n'}Analytics
              </Text>
              <Text className="font-body text-xs text-on-surface-variant mt-1">
                Monthly spending{'\n'}breakdown by category
              </Text>
            </View>
          </View>

          {/* Donut Chart Card */}
          <View className="bg-surface-container-low rounded-[24px] p-6 items-center mb-6">
            <DonutChart />
          </View>

          {/* Legend / Category List */}
          <View className="gap-3">
            {EXPENSE_DATA.map((cat, idx) => (
              <View
                key={idx}
                className="flex-row items-center bg-surface-container-low rounded-2xl p-4 gap-4"
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: cat.color + '18' }}
                >
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-body font-bold text-sm text-on-surface">
                    {cat.label}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-0.5">
                    <Text className="font-label text-[10px] text-on-surface-variant">
                      {cat.subtitle}
                    </Text>
                    <View className="bg-primary-fixed px-1.5 py-0.5 rounded-full">
                      <Text className="text-[9px] font-label font-bold text-primary">
                        {cat.pct}%
                      </Text>
                    </View>
                  </View>
                </View>
                <Text className="font-headline font-bold text-base text-on-surface">
                  ${cat.amount.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
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
          <View className="h-3 bg-surface-container-high rounded-full overflow-hidden flex-row mb-4">
            <View className="h-full bg-primary rounded-full" style={{ width: '82%' }} />
            <View className="h-full bg-secondary" style={{ width: '18%' }} />
          </View>

          <View className="flex-row justify-between">
            <View className="flex-row items-center gap-2">
              <View className="w-2.5 h-2.5 rounded-full bg-primary" />
              <View>
                <Text className="font-body font-bold text-sm text-on-surface">
                  82%
                </Text>
                <Text className="font-label text-[10px] text-on-surface-variant">
                  Approved (116)
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-2.5 h-2.5 rounded-full bg-secondary" />
              <View>
                <Text className="font-body font-bold text-sm text-secondary">
                  18%
                </Text>
                <Text className="font-label text-[10px] text-on-surface-variant">
                  Disapproved (26)
                </Text>
              </View>
            </View>
          </View>
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

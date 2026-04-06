import EmployeeImage from "@/assets/images/employee.png";
import AnalyticsCard from "@/components/AnalyticsCard";
import ProgressBar from "@/components/ProgressBar";
import TopNavigator from "@/components/TopNavigator";
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useRefresh } from '../../hooks/useRefresh';
import { useFocusEffect } from 'expo-router';

export default function AuditorProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session, userProfile, signOut } = useAuth();
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [totalAudits, setTotalAudits] = useState<number>(0);
  const [approvalStats, setApprovalStats] = useState({ total: 0, approvedRaw: 0, disapprovedRaw: 0, appealedRaw: 0 });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (!session?.user) return;
    try {
      const { data: receipts, error } = await supabase
        .from('TRIP_RECEIPTS')
        .select('*');

      if (error) throw error;
      const count = receipts?.length || 0;
      let appCount = 0;
      let rejCount = 0;
      let flaggedCount = 0;
      let appealedCount = 0;

      (receipts || []).forEach(r => {
        if (r.status === 'approved') appCount++;
        else if (r.status === 'rejected') rejCount++;
        else if (r.status === 'appealed') appealedCount++;
        else flaggedCount++; // Pending essentially means manual/flagged wait
      });

      setTotalAudits(count);

      setApprovalStats({
        total: count,
        approvedRaw: appCount,
        disapprovedRaw: rejCount,
        appealedRaw: appealedCount
      });

      if (count > 0) {
        const rawData = [
          { label: 'Approved', icon: 'check-circle', subtitle: 'Auto & Manual', amount: appCount, color: '#630ED4' },
          { label: 'Flagged/Pending', icon: 'warning', subtitle: 'AI Checks', amount: flaggedCount, color: '#7b7487' },
          { label: 'Rejected', icon: 'cancel', subtitle: 'Policy Violation', amount: rejCount, color: '#FBC02D' },
          { label: 'Appealed', icon: 'edit-note', subtitle: 'Manual Review', amount: appealedCount, color: '#FE6A34' },
        ].sort((a, b) => b.amount - a.amount).filter(d => d.amount > 0);

        setExpenseData(rawData.map(d => ({ ...d, pct: Math.round((d.amount / count) * 100) })));
      } else {
        setExpenseData([]);
      }
    } catch (e) {
      console.error("Error fetching auditor analytics:", e);
    } finally {
      if (loading) setLoading(false);
    }
  }, [session, loading]);

  useFocusEffect(
    useCallback(() => {
      fetchAnalytics();
    }, [fetchAnalytics])
  );

  const { refreshing, onRefresh } = useRefresh(fetchAnalytics);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#630ED4" />
      </View>
    );
  }

  const decidedCount = approvalStats.total || 1; // prevent div 0
  const approvedPct = Math.round((approvalStats.approvedRaw / decidedCount) * 100);
  const disapprovedPct = Math.round((approvalStats.disapprovedRaw / decidedCount) * 100);
  const appealedPct = Math.round((approvalStats.appealedRaw / decidedCount) * 100);

  return (
    <View className="flex-1 bg-surface pt-8">
      <StatusBar style="dark" />

      {/* Header */}
      <TopNavigator mode='auditor' />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 100, 140), paddingHorizontal: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#630ED4" />}
      >
        {/* Profile Card */}
        <View className="items-center pt-8 mb-10">
          <View className="relative mb-6">
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
                source={userProfile?.logo ? { uri: userProfile.logo } : EmployeeImage}
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
          <Text className="font-headline font-extrabold text-2xl text-on-surface mb-1 tracking-tight">
            {userProfile?.name || 'Auditor Profile'}
          </Text>
          <Text className="font-body font-semibold text-sm text-primary mb-3">
            {userProfile?.rank || 'Lead Financial Compliance'}
          </Text>
        </View>

        {/* Audit Analytics */}
        <View className="mb-10">
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="font-headline font-extrabold text-xl text-on-surface tracking-tight">
                Audit Analytics
              </Text>
              <Text className="font-body text-xs text-on-surface-variant mt-1">
                Monthly receipts breakdown by status
              </Text>
            </View>
          </View>

          {expenseData.length > 0 ? (
            <AnalyticsCard EXPENSE_DATA={expenseData} TOTAL_SPEND={totalAudits} />
          ) : (
            <View className="items-center justify-center py-10 bg-surface-container-low rounded-[32px] border border-outline-variant/30">
              <MaterialIcons name="insights" size={40} color="#7b748780" className="mb-3" />
              <Text className="text-on-surface-variant font-medium">No recorded audit analytics.</Text>
              <Text className="text-outline-variant text-[11px] mt-1">Pending receipts will appear here!</Text>
            </View>
          )}
        </View>

        {/* Automation Status */}
        <View className="mb-10">
          <View className="flex-row justify-between items-start mb-4">
            <Text className="font-headline font-extrabold text-xl text-on-surface tracking-tight">
              Automation{'\n'}Status
            </Text>
            <View className="items-end">
              <Text className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                Total: {approvalStats.total}
              </Text>
              <Text className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                Receipts
              </Text>
            </View>
          </View>

          {/* Progress Bar (AI processed vs Manual Overrides) */}
          <View className="mb-2">
            <Text className="font-body text-xs text-on-surface-variant mb-2">Automated by AI vs Manual Review</Text>
          </View>
          <ProgressBar approved={approvedPct} disapproved={disapprovedPct} appealed={appealedPct} />
        </View>

        {/* Account Settings */}
        <View className="mb-6">
          <Text className="font-headline font-extrabold text-xl text-on-surface mb-4 tracking-tight">
            Account Settings
          </Text>
          <TouchableOpacity
            className="flex-row items-center bg-surface-container-low rounded-2xl p-4 gap-4"
            activeOpacity={0.8}
            onPress={signOut}
          >
            <View className="w-10 h-10 rounded-[14px] bg-error-container/30 items-center justify-center">
              <MaterialIcons name="logout" size={20} color="#BA1A1A" />
            </View>
            <View className="flex-1">
              <Text className="font-body font-bold text-sm text-error">
                Logout
              </Text>
              <Text className="font-label text-[10px] text-on-surface-variant mt-1 tracking-wider uppercase">
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

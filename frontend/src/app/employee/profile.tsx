import EmployeeImage from "@/assets/images/employee.png";
import AnalyticsCard from "@/components/AnalyticsCard";
import ProgressBar from "@/components/ProgressBar";
import TopNavigator from "@/components/TopNavigator";
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session, userProfile, signOut } = useAuth();
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [totalSpend, setTotalSpend] = useState<number>(0);
  const [approvalStats, setApprovalStats] = useState({ total: 0, approvedRaw: 0, disapprovedRaw: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) return;

    const fetchAnalytics = async () => {
      try {
        const { data: receipts, error } = await supabase
          .from('TRIP_RECEIPTS')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) throw error;
        
        let total = 0;
        let foodAmount = 0;
        let travelAmount = 0;
        let accomAmount = 0;
        
        let appCount = 0;
        let rejCount = 0;

        (receipts || []).forEach(r => {
          const amt = Number(r.amount) || 0;
          total += amt;
          
          const cat = r.category?.toLowerCase();
          if (cat === 'food') foodAmount += amt;
          else if (cat === 'travel') travelAmount += amt;
          else if (cat === 'accommodation') accomAmount += amt;
          
          if (r.status === 'approved') appCount++;
          else if (r.status === 'rejected') rejCount++;
        });

        setTotalSpend(total);
        setApprovalStats({ 
          total: receipts?.length || 0, 
          approvedRaw: appCount, 
          disapprovedRaw: rejCount 
        });

        if (total > 0) {
          setExpenseData([
            { label: 'Travel', icon: 'flight', subtitle: 'Flights & Trains', amount: travelAmount, color: '#630ED4', pct: Math.round((travelAmount / total) * 100) },
            { label: 'Meals', icon: 'restaurant', subtitle: 'Dining & Catering', amount: foodAmount, color: '#FE6A34', pct: Math.round((foodAmount / total) * 100) },
            { label: 'Lodging', icon: 'hotel', subtitle: 'Hotel & Housing', amount: accomAmount, color: '#7b7487', pct: Math.round((accomAmount / total) * 100) },
          ].sort((a, b) => b.amount - a.amount));
        } else {
          setExpenseData([]);
        }
      } catch (e) {
        console.error("Error fetching profile analytics:", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [session]);

  if (loading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#630ED4" />
      </View>
    );
  }

  const decidedCount = approvalStats.approvedRaw + approvalStats.disapprovedRaw;
  const approvedPct = decidedCount > 0 ? Math.round((approvalStats.approvedRaw / decidedCount) * 100) : 0;
  const disapprovedPct = decidedCount > 0 ? Math.round((approvalStats.disapprovedRaw / decidedCount) * 100) : 0;

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
          <Text className="font-headline font-extrabold text-2xl text-on-surface mb-1">
            {userProfile?.name || 'Employee Profile'}
          </Text>
          <Text className="font-body font-semibold text-sm text-primary mb-3">
            {userProfile?.rank || 'Staff'}
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

          {expenseData.length > 0 ? (
            <AnalyticsCard EXPENSE_DATA={expenseData} TOTAL_SPEND={totalSpend} />
          ) : (
            <View className="items-center justify-center py-10 bg-surface-container-low rounded-[32px] border border-outline-variant/30">
              <MaterialIcons name="insights" size={40} color="#7b748780" className="mb-3" />
              <Text className="text-on-surface-variant font-medium">No recorded expense analytics.</Text>
              <Text className="text-outline-variant text-[11px] mt-1">Start uploading receipts to see insights!</Text>
            </View>
          )}
        </View>

        {/* Approval Status */}
        <View className="mb-10">
          <View className="flex-row justify-between items-start mb-4">
            <Text className="font-headline font-extrabold text-xl text-on-surface">
              Approval{'\n'}Status
            </Text>
            <View className="items-end">
              <Text className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                Total: {approvalStats.total}
              </Text>
              <Text className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                Expenses
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <ProgressBar approved={approvedPct} disapproved={disapprovedPct} />
        </View>

        {/* Account Settings */}
        <View className="mb-6">
          <Text className="font-headline font-extrabold text-xl text-on-surface mb-4">
            Account Settings
          </Text>
          <TouchableOpacity
            className="flex-row items-center bg-surface-container-low rounded-2xl p-4 gap-4"
            activeOpacity={0.8}
            onPress={signOut}
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

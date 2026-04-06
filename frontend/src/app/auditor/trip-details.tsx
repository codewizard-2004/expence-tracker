import HeroTripCard from '@/components/HeroTripCard';
import TripBudgetCard from '@/components/TripBudgetCard';
import TripObjectives from '@/components/TripObjectives';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useRefresh } from '../../hooks/useRefresh';

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'food': return 'restaurant';
    case 'travel': return 'flight';
    case 'accommodation': return 'hotel';
    default: return 'receipt';
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
};

const formatDateShort = (dateString: string) => {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
};

// ─── Receipt Audit Modal ───────────────────────────────────────────────────────
const ReceiptAuditModal = ({ visible, onClose, receipt, onAuditSuccess }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!receipt) return null;

  const isAppealed = receipt.status === 'appealed';
  const isApproved = receipt.status === 'approved';
  const isRejected = receipt.status === 'rejected';
  const isPending = !receipt.status;

  const handleOverrideAction = async (newStatus: 'approved' | 'rejected') => {
    setIsSubmitting(true);
    try {
      // 1. Check if we need to modify expenditures securely
      if (newStatus === 'approved' && receipt.status !== 'approved') {
        // We are approving something that wasn't approved. Add to expenditure.
        const { data: userTrip, error: utError } = await supabase
          .from('USERTRIPS')
          .select('expenditure')
          .eq('user_id', receipt.user_id)
          .eq('trip_id', receipt.trip_id)
          .single();
        if (!utError && userTrip) {
          const currentExp = Number(userTrip.expenditure) || 0;
          await supabase
            .from('USERTRIPS')
            .update({ expenditure: currentExp + Number(receipt.amount || 0) })
            .eq('user_id', receipt.user_id)
            .eq('trip_id', receipt.trip_id);
        }
      } else if (newStatus === 'rejected' && receipt.status === 'approved') {
        // We are rejecting something that was already approved. Subtract expenditure.
        const { data: userTrip, error: utError } = await supabase
          .from('USERTRIPS')
          .select('expenditure')
          .eq('user_id', receipt.user_id)
          .eq('trip_id', receipt.trip_id)
          .single();
        if (!utError && userTrip) {
          const currentExp = Math.max(0, (Number(userTrip.expenditure) || 0) - Number(receipt.amount || 0));
          await supabase
            .from('USERTRIPS')
            .update({ expenditure: currentExp })
            .eq('user_id', receipt.user_id)
            .eq('trip_id', receipt.trip_id);
        }
      }

      // 2. Update status
      const { error: updateError } = await supabase
        .from('TRIP_RECEIPTS')
        .update({ status: newStatus })
        .eq('id', receipt.id);

      if (updateError) throw updateError;

      onClose();
      if (onAuditSuccess) onAuditSuccess();

    } catch (e) {
      console.error('Error overriding status:', e);
      alert('Failed to override status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-[#1D1A24]/60">
        <View className="bg-surface rounded-t-[32px] p-6 max-h-[90%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="font-headline font-bold text-xl text-on-surface tracking-tight">
              Audit Receipt
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              className="p-2 bg-surface-container-high rounded-full"
            >
              <MaterialIcons name="close" size={20} color="#4A4455" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Receipt Image */}
            <View className="w-full h-52 bg-surface-container-high rounded-2xl mb-6 overflow-hidden border border-outline-variant/20 relative">
              {receipt.url ? (
                <>
                  <Image
                    source={{ uri: receipt.url }}
                    style={{ width: '100%', height: '100%' } as any}
                    contentFit="contain"
                  />
                  <TouchableOpacity
                    className="absolute bottom-3 right-3 bg-black/60 p-2 rounded-xl"
                    onPress={() => window.open ? window.open(receipt.url, '_blank') : null}
                  >
                    <MaterialIcons name="open-in-new" size={20} color="white" />
                  </TouchableOpacity>
                </>
              ) : (
                <View className="flex-1 items-center justify-center gap-2">
                  <MaterialIcons name="receipt-long" size={48} color="#7b748780" />
                  <Text className="text-on-surface-variant font-body text-sm">
                    No image attached
                  </Text>
                </View>
              )}
            </View>

            {/* AI Decision Block / Details Block */}
            <View className="bg-surface-container border border-outline-variant/20 rounded-2xl p-5 mb-6">
              <Text className="font-headline font-bold text-lg text-on-surface mb-4 border-b border-outline-variant/20 pb-2">
                Document Details
              </Text>

              <View className="gap-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-on-surface-variant font-label text-xs uppercase tracking-wider">Submitter</Text>
                  <Text className="text-on-surface font-body font-semibold text-sm max-w-[60%] text-right">{receipt.userName || 'N/A'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-on-surface-variant font-label text-xs uppercase tracking-wider">Merchant</Text>
                  <Text className="text-on-surface font-body font-semibold text-sm max-w-[60%] text-right">{receipt.merchant_name || 'N/A'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-on-surface-variant font-label text-xs uppercase tracking-wider">Location</Text>
                  <Text className="text-on-surface font-body font-semibold text-sm max-w-[60%] text-right">{receipt.merchant_location || 'N/A'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-on-surface-variant font-label text-xs uppercase tracking-wider">Category</Text>
                  <Text className="text-on-surface font-body font-semibold text-sm capitalize">{receipt.category || 'N/A'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-on-surface-variant font-label text-xs uppercase tracking-wider">Receipt Date</Text>
                  <Text className="text-on-surface font-body font-semibold text-sm">{receipt.receipt_date ? formatDate(receipt.receipt_date) : 'N/A'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-on-surface-variant font-label text-xs uppercase tracking-wider">Upload Date</Text>
                  <Text className="text-on-surface font-body font-semibold text-sm">{receipt.created_at ? formatDate(receipt.created_at) : 'N/A'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-on-surface-variant font-label text-xs uppercase tracking-wider">Amount</Text>
                  <Text className="text-on-surface font-body font-bold text-sm">{receipt.currency || ''}{receipt.amount != null ? Number(receipt.amount).toFixed(2) : '—'}</Text>
                </View>

                {/* Status and reason block */}
                <View className={`mt-2 p-3 border rounded-xl ${isApproved ? 'bg-primary/10 border-primary/20' : isRejected ? 'bg-[#BA1A1A]/10 border-[#BA1A1A]/30' : isAppealed ? 'bg-secondary/10 border-secondary/30' : 'bg-surface-container-high border-outline-variant/30'}`}>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-on-surface-variant font-label text-xs uppercase tracking-wider">AI Decision</Text>
                    <Text className={`font-headline font-bold text-sm uppercase ${isApproved ? 'text-primary' : isRejected ? 'text-[#BA1A1A]' : isAppealed ? 'text-secondary' : 'text-on-surface-variant'}`}>
                      {receipt.status || 'PENDING'}
                    </Text>
                  </View>
                  {receipt.ai_reason && (
                    <View className="mt-2 pt-2 border-t border-black/5">
                      <Text className="text-on-surface-variant font-label text-[10px] uppercase tracking-wider mb-1">AI Reasoning</Text>
                      <Text className="text-on-surface font-body text-sm leading-relaxed">{receipt.ai_reason}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Appeal Block */}
            {isAppealed && (
              <View className="bg-secondary/10 p-4 mb-6 rounded-2xl border border-secondary/20">
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="error-outline" size={18} color="#FE6A34" />
                  <Text className="text-secondary font-bold text-xs uppercase tracking-wider">
                    Employee Appeal Explanation
                  </Text>
                </View>
                <Text className="text-on-surface font-body text-sm italic">
                  {receipt.appealExplanation || 'The employee has submitted an appeal for this receipt.'}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity
                disabled={isSubmitting}
                onPress={() => handleOverrideAction('rejected')}
                className="flex-1 bg-surface py-4 rounded-full items-center justify-center border border-[#BA1A1A]/30"
              >
                <Text className="text-[#BA1A1A] font-headline font-bold text-sm uppercase tracking-wider">Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isSubmitting}
                onPress={() => handleOverrideAction('approved')}
                className="flex-1 bg-primary py-4 rounded-full items-center justify-center shadow-sm"
              >
                <Text className="text-white font-headline font-bold text-sm uppercase tracking-wider">Approve</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              disabled={isSubmitting}
              activeOpacity={0.8}
              onPress={onClose}
              className="bg-surface-container-highest py-4 rounded-full items-center justify-center shadow-sm"
            >
              <Text className="text-on-surface font-headline font-bold text-base">Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AuditorTripDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'details' | 'receipts'>('details');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const [tripInfo, setTripInfo] = useState<any>(null);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);

  const fetchAll = useCallback(async () => {
    if (!id) return;
    try {
      const [tripRes, expendRes, receiptsRes] = await Promise.all([
        // Trip details with location + objectives
        supabase
          .from('TRIP')
          .select(`
          id, name, description, budget, currency, startDate, endDate,
          TRIPLOCATIONS ( city, country ),
          TRIPOBJECTIVES ( title, description )
        `)
          .eq('id', id)
          .single(),

        // Sum expenditure across all employees for this trip
        supabase
          .from('USERTRIPS')
          .select('expenditure')
          .eq('trip_id', id),

        // All receipts for this trip, joined with USERS for employee names
        supabase
          .from('TRIP_RECEIPTS')
          .select(`
          id, user_id, url, category, merchant_name, merchant_location,
          receipt_date, amount, currency, user_description, extracted_description, status, ai_reason,
          created_at,
          USERS ( name )
        `)
          .eq('trip_id', id)
          .order('created_at', { ascending: false }),
      ]);

      if (tripRes.error) throw tripRes.error;
      if (expendRes.error) throw expendRes.error;
      if (receiptsRes.error) throw receiptsRes.error;

      setTripInfo(tripRes.data);

      const spent = (expendRes.data || []).reduce(
        (sum: number, row: any) => sum + Number(row.expenditure || 0), 0
      );
      setTotalSpent(spent);

      // Fetch appeal data for appealed receipts
      const receiptIds = (receiptsRes.data || [])
        .filter((r: any) => r.status === 'appealed')
        .map((r: any) => r.id);

      let appealMap: Record<number, string> = {};
      if (receiptIds.length > 0) {
        const { data: appeals } = await supabase
          .from('APPEALS')
          .select('receipt_id, explanation')
          .in('receipt_id', receiptIds);
        (appeals || []).forEach((a: any) => {
          appealMap[a.receipt_id] = a.explanation;
        });
      }

      const mapped = (receiptsRes.data || []).map((r: any) => ({
        ...r,
        userName: r.USERS?.name || 'Unknown Employee',
        appealExplanation: appealMap[r.id] || null,
      }));

      setReceipts(mapped);
    } catch (e) {
      console.error('Error fetching auditor trip details:', e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const { refreshing, onRefresh } = useRefresh(fetchAll);

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [fetchAll, refreshTick])
  );

  if ((loading && !refreshing) || (!tripInfo && !refreshing && !loading)) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#630ED4" />
      </SafeAreaView>
    );
  }

  if (!tripInfo && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center px-6">
        <MaterialIcons name="error-outline" size={48} color="#BA1A1A" />
        <Text className="text-on-surface font-headline font-bold text-lg mt-4 text-center">
          Trip Not Found
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-primary font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const trip = tripInfo;
  const locationStr = trip.TRIPLOCATIONS?.[0]?.city || 'Unknown Location';
  const imageUri = `https://loremflickr.com/800/600/city,${locationStr.replace(/\s+/g, '')}`;
  const budget = Number(trip.budget) || 0;
  const remaining = budget - totalSpent;
  const progress = budget > 0 ? Math.min(100, Math.max(0, (totalSpent / budget) * 100)) : 0;

  const mappedObjectives = (trip.TRIPOBJECTIVES || []).map((obj: any, idx: number) => ({
    title: obj.title,
    description: obj.description || '',
    color: ['#630ED4', '#AB3500', '#7C3AED'][idx % 3],
  }));

  // Receipt status helpers
  const statusColor = (status: string | null) => {
    if (status === 'approved') return { bg: 'bg-primary-container', text: 'text-primary', icon: '#630ED4' };
    if (status === 'rejected') return { bg: 'bg-secondary-container', text: 'text-secondary', icon: '#AB3500' };
    if (status === 'appealed') return { bg: 'bg-[#BA1A1A]/20', text: 'text-[#BA1A1A]', icon: '#BA1A1A' };
    return { bg: 'bg-surface-container-high', text: 'text-on-surface-variant', icon: '#7b7487' };
  };

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
          className={`flex-1 py-2.5 rounded-full items-center ${activeTab === 'details' ? 'bg-primary' : 'bg-transparent'}`}
        >
          <Text className={`font-body font-semibold text-sm ${activeTab === 'details' ? 'text-white' : 'text-on-surface-variant'}`}>
            Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('receipts')}
          className={`flex-1 py-2.5 rounded-full items-center ${activeTab === 'receipts' ? 'bg-primary' : 'bg-transparent'}`}
        >
          <Text className={`font-body font-semibold text-sm ${activeTab === 'receipts' ? 'text-white' : 'text-on-surface-variant'}`}>
            Audit Receipts {receipts.length > 0 ? `(${receipts.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <ReceiptAuditModal
        visible={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
        onAuditSuccess={() => setRefreshTick(t => t + 1)}
      />

      <ScrollView
        className="flex-1 w-full"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#630ED4" />}
      >
        {activeTab === 'details' ? (
          <View className="px-6">
            <HeroTripCard
              image={{ uri: imageUri }}
              title={trip.name || 'Untitled Trip'}
              location={locationStr}
              dateStart={formatDateShort(trip.startDate)}
              dateEnd={formatDateShort(trip.endDate)}
            />

            <TripObjectives
              OBJECTIVES={mappedObjectives}
              purpose={trip.description || 'No description provided.'}
            />

            <TripBudgetCard
              totalBudget={budget}
              currency={trip.currency || '$'}
              amountSpent={totalSpent}
              remaining={remaining}
              progress={progress}
            />

            {/* AI Insight */}
            <View className="bg-surface-container rounded-[24px] p-5 mb-8 flex-row gap-4 mt-8">
              <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                <MaterialIcons name="auto-awesome" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-on-surface font-headline font-bold text-sm mb-2">
                  AI Insight
                </Text>
                <Text className="text-on-surface-variant font-body text-xs leading-relaxed">
                  {receipts.length > 0
                    ? `${receipts.length} receipt${receipts.length > 1 ? 's' : ''} submitted for this trip. ${receipts.filter(r => r.status === 'appealed').length > 0
                      ? `${receipts.filter(r => r.status === 'appealed').length} appeal(s) pending your review.`
                      : 'No pending appeals.'
                    }`
                    : 'No receipts have been submitted for this trip yet.'}
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
                {receipts.filter(r => r.status === 'appealed').length > 0 && (
                  <View className="bg-[#BA1A1A]/10 px-3 py-1 rounded-full">
                    <Text className="font-label text-xs font-bold text-[#BA1A1A]">
                      {receipts.filter(r => r.status === 'appealed').length} Appeal{receipts.filter(r => r.status === 'appealed').length > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </View>

              {receipts.length > 0 ? (
                <View className="gap-4">
                  {receipts.map((receipt, index) => {
                    const colors = statusColor(receipt.status);
                    const isAppealed = receipt.status === 'appealed';
                    return (
                      <TouchableOpacity
                        key={receipt.id || index}
                        activeOpacity={0.8}
                        onPress={() => setSelectedReceipt(receipt)}
                        className={`rounded-3xl overflow-hidden shadow-sm border ${isAppealed
                          ? 'bg-[#BA1A1A]/10 border-[#BA1A1A]'
                          : 'bg-surface-container border-transparent'
                          }`}
                      >
                        <View className="p-5 flex-row items-center gap-4">
                          <View className={`w-12 h-12 rounded-[14px] items-center justify-center ${colors.bg}`}>
                            <MaterialIcons
                              name={getCategoryIcon(receipt.category) as any}
                              size={24}
                              color={colors.icon}
                            />
                          </View>
                          <View className="flex-1">
                            <View className="flex-row justify-between items-start">
                              <Text className={`font-body font-bold text-base flex-1 mr-2 ${isAppealed ? 'text-[#BA1A1A]' : 'text-on-surface'}`} numberOfLines={1}>
                                {receipt.merchant_name || 'Unknown Merchant'}
                              </Text>
                              <Text className="font-headline font-bold text-base text-on-surface">
                                {receipt.currency || ''}{receipt.amount != null ? Number(receipt.amount).toFixed(2) : '—'}
                              </Text>
                            </View>
                            <View className="flex-row items-center justify-between mt-1.5">
                              {isAppealed ? (
                                <Text className="font-label text-[10px] text-[#BA1A1A] font-bold uppercase tracking-wider">
                                  APPEAL PENDING • {receipt.userName}
                                </Text>
                              ) : (
                                <Text className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">
                                  {receipt.status ? receipt.status.toUpperCase() : 'PENDING'} • {receipt.userName}
                                </Text>
                              )}
                              {receipt.receipt_date && (
                                <Text className="font-label text-[10px] text-on-surface-variant">
                                  {formatDateShort(receipt.receipt_date)}
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View className="items-center py-12 bg-surface-container-low rounded-3xl border border-outline-variant/30">
                  <MaterialIcons name="receipt-long" size={40} color="#7b748780" />
                  <Text className="text-on-surface-variant font-headline font-bold text-sm mt-3">
                    No receipts submitted yet.
                  </Text>
                  <Text className="text-outline-variant font-body text-xs mt-1">
                    Employees haven't uploaded any receipts for this trip.
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

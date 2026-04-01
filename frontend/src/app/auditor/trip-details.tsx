import HeroTripCard from '@/components/HeroTripCard';
import TripBudgetCard from '@/components/TripBudgetCard';
import TripObjectives from '@/components/TripObjectives';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

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
const ReceiptAuditModal = ({ visible, onClose, receipt }: any) => {
  if (!receipt) return null;

  const isAppealed = receipt.status === 'appealed';
  const isApproved = receipt.status === 'approved';
  const isPending  = !receipt.status;

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

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Receipt Image */}
            <View className="w-full h-52 bg-surface-container-high rounded-2xl mb-6 overflow-hidden border border-outline-variant/20">
              {receipt.url ? (
                <Image
                  source={{ uri: receipt.url }}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="cover"
                />
              ) : (
                <View className="flex-1 items-center justify-center gap-2">
                  <MaterialIcons name="receipt-long" size={48} color="#7b748780" />
                  <Text className="text-on-surface-variant font-body text-sm">
                    No image attached
                  </Text>
                </View>
              )}
            </View>

            {/* Title & Meta */}
            <Text className="font-headline font-bold text-2xl text-on-surface mb-1">
              {receipt.merchant_name || 'Unknown Merchant'}
            </Text>
            <Text className="font-body text-base text-on-surface-variant mb-6">
              {receipt.currency || ''}{receipt.amount != null ? Number(receipt.amount).toFixed(2) : '—'}
              {receipt.receipt_date ? ` • ${formatDate(receipt.receipt_date)}` : ''}
              {receipt.userName ? ` • ${receipt.userName}` : ''}
            </Text>

            {/* AI Decision Block */}
            {(receipt.status || receipt.ai_reason) ? (
              <View className={`p-5 rounded-2xl mb-6 border ${
                isApproved
                  ? 'bg-primary/10 border-primary/20'
                  : isAppealed
                  ? 'bg-[#BA1A1A]/10 border-[#BA1A1A]/30'
                  : 'bg-secondary/10 border-secondary/20'
              }`}>
                <Text className={`font-headline font-bold text-xs mb-2 uppercase tracking-widest ${
                  isApproved ? 'text-primary' : isAppealed ? 'text-[#BA1A1A]' : 'text-secondary'
                }`}>
                  Lumina AI Decision: {receipt.status?.toUpperCase() || 'PENDING'}
                </Text>
                {receipt.ai_reason ? (
                  <Text className="font-body text-sm text-on-surface leading-relaxed">
                    {receipt.ai_reason}
                  </Text>
                ) : (
                  <Text className="font-body text-sm text-on-surface-variant italic">
                    AI analysis not yet available for this receipt.
                  </Text>
                )}
              </View>
            ) : (
              <View className="p-5 rounded-2xl mb-6 bg-surface-container border border-outline-variant/20">
                <Text className="font-headline font-bold text-xs mb-1 uppercase tracking-widest text-on-surface-variant">
                  Status: Pending AI Review
                </Text>
                <Text className="font-body text-sm text-on-surface-variant italic">
                  This receipt has been uploaded and is awaiting AI analysis.
                </Text>
              </View>
            )}

            {/* Appeal Block */}
            {isAppealed && (
              <View className="bg-[#BA1A1A]/10 p-4 mb-6 rounded-xl border border-[#BA1A1A]/20">
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="error-outline" size={18} color="#BA1A1A" />
                  <Text className="text-[#BA1A1A] font-bold text-xs uppercase tracking-wider">
                    Employee Appeal
                  </Text>
                </View>
                <Text className="text-[#BA1A1A] font-body text-sm italic">
                  {receipt.appealExplanation || 'The employee has submitted an appeal for this receipt.'}
                </Text>
              </View>
            )}

            {/* Override Button — shown when not approved */}
            {!isApproved && !isPending && (
              <TouchableOpacity className="bg-primary py-4 rounded-full items-center justify-center shadow-sm mb-4">
                <Text className="text-white font-headline font-bold text-base">
                  Override AI Decision
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
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

  useEffect(() => {
    if (!id) { setLoading(false); return; }

    const fetchAll = async () => {
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
              receipt_date, amount, currency, description, status, ai_reason,
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
    };

    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#630ED4" />
      </SafeAreaView>
    );
  }

  if (!tripInfo) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center px-6">
        <MaterialIcons name="error-outline" size={48} color="#7b7487" />
        <Text className="text-on-surface font-headline font-bold text-lg mt-4">
          Trip not found
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
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
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

            {/* Lumina Insight */}
            <View className="bg-surface-container rounded-[24px] p-5 mb-8 flex-row gap-4 mt-8">
              <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                <MaterialIcons name="auto-awesome" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-on-surface font-headline font-bold text-sm mb-2">
                  Lumina Insight
                </Text>
                <Text className="text-on-surface-variant font-body text-xs leading-relaxed">
                  {receipts.length > 0
                    ? `${receipts.length} receipt${receipts.length > 1 ? 's' : ''} submitted for this trip. ${
                        receipts.filter(r => r.status === 'appealed').length > 0
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
                        className={`rounded-3xl overflow-hidden shadow-sm border ${
                          isAppealed
                            ? 'bg-[#BA1A1A]/10 border-[#BA1A1A]/30'
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

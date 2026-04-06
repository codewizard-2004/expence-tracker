import CityImage from "@/assets/images/city.png";
import FileUpload from '@/components/FileUpload';
import HeroTripCard from '@/components/HeroTripCard';
import TripBudgetCard from "@/components/TripBudgetCard";
import TripObjectives from "@/components/TripObjectives";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Modal, Linking } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

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
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
};

// ─── Receipt Details Modal ───────────────────────────────────────────────────────
const ReceiptDetailsModal = ({ visible, onClose, receipt }: any) => {
  if (!receipt) return null;

  const isApproved = receipt.status === 'approved';
  const isRejected = receipt.status === 'rejected';
  const isPending  = !receipt.status;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-[#1D1A24]/60">
        <View className="bg-surface rounded-t-[32px] p-6 max-h-[90%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="font-headline font-bold text-xl text-on-surface tracking-tight">
              Receipt Details
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
                    onPress={() => Linking.openURL(receipt.url)}
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
                Processed Details
              </Text>
              
              <View className="gap-y-3">
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
                <View className={`mt-2 p-3 border rounded-xl ${isApproved ? 'bg-primary/10 border-primary/20' : isRejected ? 'bg-[#BA1A1A]/10 border-[#BA1A1A]/30' : 'bg-surface-container-high border-outline-variant/30'}`}>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-on-surface-variant font-label text-xs uppercase tracking-wider">Status</Text>
                    <Text className={`font-headline font-bold text-sm uppercase ${isApproved ? 'text-primary' : isRejected ? 'text-[#BA1A1A]' : 'text-on-surface-variant'}`}>
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

export default function TripDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'details' | 'receipts'>('details');
  const { session } = useAuth();
  const [tripInfo, setTripInfo] = useState<any>(null);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const fetchReceipts = async () => {
    if (!session?.user || !id) return;
    try {
      const { data, error } = await supabase
        .from('TRIP_RECEIPTS')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('trip_id', id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setReceipts(data);
    } catch (e) {
      console.error('Error refreshing receipts:', e);
    }
  };

  useEffect(() => {
    if (!session?.user || !id) {
       if (!id) setLoading(false);
       return;
    }

    const fetchTrip = async () => {
      try {
        const [tripRes, receiptsRes] = await Promise.all([
          supabase
            .from('USERTRIPS')
            .select(`
              expenditure,
              TRIP (
                *,
                TRIPLOCATIONS ( city ),
                TRIPOBJECTIVES ( * )
              )
            `)
            .eq('user_id', session.user.id)
            .eq('trip_id', id)
            .single(),
          supabase
            .from('TRIP_RECEIPTS')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('trip_id', id)
            .order('created_at', { ascending: false })
        ]);
        
        if (tripRes.error) throw tripRes.error;
        if (receiptsRes.error) throw receiptsRes.error;
        
        if (tripRes.data) setTripInfo(tripRes.data);
        if (receiptsRes.data) setReceipts(receiptsRes.data);
      } catch (e) {
        console.error("Error fetching trip details:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [session, id]);

  if (loading || !tripInfo) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#630ED4" />
      </SafeAreaView>
    );
  }

  const trip = tripInfo.TRIP;
  const locationStr = trip.TRIPLOCATIONS?.[0]?.city || 'Unknown Location';
  const uri = `https://loremflickr.com/800/600/city,${locationStr.replace(/\s+/g, '')}`;
  const expenditure = Number(tripInfo.expenditure) || 0;
  const budget = Number(trip.budget) || 0;
  const remaining = budget - expenditure;
  const progress = budget > 0 ? Math.min(100, Math.max(0, (expenditure / budget) * 100)) : 0;
  
  const mappedObjectives = (trip.TRIPOBJECTIVES || []).map((obj: any, idx: number) => ({
    title: obj.title,
    description: obj.description || '',
    color: ['#630ED4', '#AB3500', '#7C3AED'][idx % 3],
  }));

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

      <ReceiptDetailsModal 
        visible={!!selectedReceipt} 
        onClose={() => setSelectedReceipt(null)} 
        receipt={selectedReceipt} 
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {activeTab === 'details' ? (
          <View className="px-6">
            {/* Hero Trip Card */}
            <HeroTripCard
              image={{ uri }}
              title={trip.name || 'Untitled Trip'}
              location={locationStr}
              dateStart={formatDate(trip.startDate)}
              dateEnd={formatDate(trip.endDate)}
              budget={budget}
              expenditure={expenditure}
            />

            {/* Trip Purpose */}

            <TripObjectives OBJECTIVES={mappedObjectives} purpose={trip.description || 'No description provided.'} />

            {/* Budget Card */}
            <TripBudgetCard
              totalBudget={budget}
              currency={trip.currency || '$'}
              amountSpent={expenditure}
              remaining={remaining}
              progress={progress}
            />

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
            <FileUpload
              tripId={id as string}
              userId={session?.user?.id ?? ''}
              onUploadSuccess={fetchReceipts}
            />

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
                {receipts.length > 0 ? (
                  receipts.map((receipt: any, index: number) => (
                    <TouchableOpacity
                      key={receipt.id || index}
                      activeOpacity={0.8}
                      onPress={() => setSelectedReceipt(receipt)}
                      className="flex-row items-center bg-surface-container-low rounded-2xl p-4 gap-4"
                    >
                      <View className="w-10 h-10 rounded-xl bg-primary-fixed items-center justify-center">
                        <MaterialIcons
                          name={getCategoryIcon(receipt.category) as any}
                          size={20}
                          color="#630ED4"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="font-body font-bold text-sm text-on-surface">
                          {receipt.merchant_name || 'Unknown Merchant'}
                        </Text>
                        <Text className="font-label text-[10px] text-on-surface-variant mt-0.5 uppercase tracking-wider">
                          {formatDate(receipt.created_at) || 'No Date'}
                        </Text>
                      </View>
                      <Text className="font-headline font-bold text-sm text-on-surface">
                        {receipt.currency || '$'}{Number(receipt.amount || 0).toFixed(2)}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View className="items-center py-6 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                    <MaterialIcons name="receipt-long" size={32} color="#7b748780" className="mb-2" />
                    <Text className="text-on-surface-variant font-medium text-sm">No receipts uploaded yet.</Text>
                    <Text className="text-outline-variant text-[11px] mt-1">Tap above to add a new receipt.</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

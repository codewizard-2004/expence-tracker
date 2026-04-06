import ActiveTripCard from '@/components/ActiveTripCard';
import TopNavigator from '@/components/TopNavigator';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRefresh } from '../../hooks/useRefresh';

interface ManagedTrip {
  id: number;
  name: string;
  budget: number;
  currency: string;
  startDate: string;
  endDate: string;
  city: string;
  totalSpent: number;
}

export default function AuditorHome() {
  const router = useRouter();
  const [trips, setTrips] = useState<ManagedTrip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = useCallback(async () => {
    try {
      // Fetch all trips with their locations
      const { data: tripData, error: tripError } = await supabase
        .from('TRIP')
        .select(`
          id, name, budget, currency, startDate, endDate,
          TRIPLOCATIONS ( city )
        `)
        .order('created_at', { ascending: false });

      if (tripError) throw tripError;

      if (!tripData || tripData.length === 0) {
        setTrips([]);
        return;
      }

      // Fetch total expenditure per trip (sum across all employees)
      const tripIds = tripData.map((t: any) => t.id);
      const { data: expenditureData, error: expError } = await supabase
        .from('USERTRIPS')
        .select('trip_id, expenditure')
        .in('trip_id', tripIds);

      if (expError) throw expError;

      // Sum expenditure per trip_id
      const spentMap: Record<number, number> = {};
      (expenditureData || []).forEach((row: any) => {
        spentMap[row.trip_id] = (spentMap[row.trip_id] || 0) + Number(row.expenditure || 0);
      });

      const mapped: ManagedTrip[] = tripData.map((t: any) => ({
        id: t.id,
        name: t.name || 'Untitled Trip',
        budget: Number(t.budget) || 0,
        currency: t.currency || '$',
        startDate: t.startDate || '',
        endDate: t.endDate || '',
        city: t.TRIPLOCATIONS?.[0]?.city || 'City',
        totalSpent: spentMap[t.id] || 0,
      }));

      setTrips(mapped);
    } catch (e) {
      console.error('Error fetching managed trips:', e);
    } finally {
      if (loading) setLoading(false);
    }
  }, [loading]);

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [fetchTrips])
  );

  const { refreshing, onRefresh } = useRefresh(fetchTrips);

  const formatDate = (dateString: string) => {
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

  return (
    <View className="flex-1 bg-surface pt-8">
      <StatusBar style="dark" />
      <TopNavigator mode='auditor' />

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 140 }} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#630ED4" />}
      >
        <View className="px-6 flex-1 mt-6">

          {/* Create New Trip CTA */}
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

          {/* Managed Trips Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="font-headline font-bold text-2xl text-on-surface tracking-tight">
              Managed Trips
            </Text>
            {!loading && trips.length > 0 && (
              <View className="bg-primary/10 px-3 py-1 rounded-full">
                <Text className="font-label text-xs font-bold text-primary">
                  {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'}
                </Text>
              </View>
            )}
          </View>

          {/* Trips List */}
          <View className="gap-6 mb-4">
            {loading && !refreshing ? (
              <View className="items-center py-12">
                <ActivityIndicator size="large" color="#630ED4" />
                <Text className="text-on-surface-variant font-body text-sm mt-3">
                  Loading managed trips…
                </Text>
              </View>
            ) : trips.length > 0 ? (
              trips.map((trip) => {
                const imageUri = `https://loremflickr.com/800/600/city,${trip.city.replace(/\s+/g, '')}`;
                return (
                  <ActiveTripCard
                    key={trip.id}
                    id={trip.id}
                    image={{ uri: imageUri }}
                    title={trip.name}
                    location={trip.city}
                    budget={trip.budget}
                    spent={trip.totalSpent}
                    currency={trip.currency}
                    startDate={formatDate(trip.startDate)}
                    endDate={formatDate(trip.endDate)}
                    destination="/auditor/trip-details"
                  />
                );
              })
            ) : (
              <View className="items-center py-12 bg-surface-container-low rounded-3xl border border-outline-variant/30">
                <MaterialIcons name="luggage" size={40} color="#7b748780" />
                <Text className="text-on-surface-variant font-headline font-bold text-sm mt-3">
                  No managed trips yet.
                </Text>
                <Text className="text-outline-variant font-body text-xs mt-1">
                  Create a new trip to get started.
                </Text>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

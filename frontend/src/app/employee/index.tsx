import CityImage from "@/assets/images/city.png";
import ActiveTripCard from '@/components/ActiveTripCard';
import SecondaryAction from "@/components/SecondaryAction";
import TopNavigator from '@/components/TopNavigator';
import TotalSpendCard from '@/components/TotalSpendCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function EmployeeHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) return;

    const fetchTrips = async () => {
      try {
        const { data, error } = await supabase
          .from('USERTRIPS')
          .select(`
            expenditure,
            TRIP (
              id, name, budget, currency, startDate, endDate,
              TRIPLOCATIONS ( city )
            )
          `)
          .eq('user_id', session.user.id);
        
        if (error) throw error;
        if (data) setTrips(data);
      } catch (e) {
        console.error("Error fetching trips:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [session]);

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
            {loading ? (
              <ActivityIndicator size="large" color="#630ED4" />
            ) : trips.length > 0 ? (
              trips.map((userTrip, idx) => {
                const trip = userTrip.TRIP;
                if (!trip) return null;
                const location = trip.TRIPLOCATIONS?.[0]?.city || 'Unknown';
                // Using a semi-random recognizable hash pattern for distinct images
                const imageUri = `https://loremflickr.com/800/600/city,${location.replace(/\s+/g, '')}`;
                
                return (
                  <ActiveTripCard
                    id={trip.id}
                    key={trip.id || idx}
                    image={{ uri: imageUri }}
                    title={trip.name}
                    location={location}
                    budget={Number(trip.budget) || 0}
                    spent={Number(userTrip.expenditure) || 0}
                    currency={trip.currency || '$'}
                    startDate={formatDate(trip.startDate)}
                    endDate={formatDate(trip.endDate)}
                  />
                )
              })
            ) : (
              <View className="items-center py-8 bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
                <Text className="text-on-surface-variant font-medium">No active trips found.</Text>
              </View>
            )}
          </View>

          {/* Secondary Action - Upload Receipt */}
          <SecondaryAction />
        </View>
      </ScrollView>
    </View>
  );
}

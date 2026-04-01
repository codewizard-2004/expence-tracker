import CustomCalendar from '@/components/CustomCalendar';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

// ─── Add Location Modal (city + country) ─────────────────────────────────────
const AddLocationModal = ({ visible, onClose, onAdd }: any) => {
  const [city, setCity] = React.useState('');
  const [country, setCountry] = React.useState('');

  const handleAdd = () => {
    if (city.trim() && country.trim()) {
      onAdd({ city: city.trim(), country: country.trim() });
      setCity('');
      setCountry('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-[#1D1A24]/60">
        <View className="bg-surface rounded-t-[32px] p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="font-headline font-bold text-xl text-on-surface tracking-tight">
              Add Location
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              className="p-2 bg-surface-container-high rounded-full"
            >
              <MaterialIcons name="close" size={20} color="#4A4455" />
            </TouchableOpacity>
          </View>

          <View className="gap-4 mb-6">
            <View>
              <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">
                City
              </Text>
              <TextInput
                className="bg-surface-container-highest px-4 py-3.5 rounded-2xl text-on-surface font-body text-sm"
                placeholder="e.g. San Francisco"
                placeholderTextColor="rgba(74, 68, 85, 0.4)"
                value={city}
                onChangeText={setCity}
                autoCapitalize="words"
              />
            </View>
            <View>
              <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">
                Country
              </Text>
              <TextInput
                className="bg-surface-container-highest px-4 py-3.5 rounded-2xl text-on-surface font-body text-sm"
                placeholder="e.g. United States"
                placeholderTextColor="rgba(74, 68, 85, 0.4)"
                value={country}
                onChangeText={setCountry}
                autoCapitalize="words"
              />
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAdd}
            disabled={!city.trim() || !country.trim()}
            className="bg-primary py-4 rounded-full items-center justify-center"
            style={{ opacity: !city.trim() || !country.trim() ? 0.5 : 1 }}
          >
            <Text className="text-white font-headline font-bold text-base">Add Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ─── Helper — initials from name ─────────────────────────────────────────────
const getInitials = (name: string) => {
  const parts = name?.trim().split(' ');
  if (!parts || parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const INIT_COLORS = [
  { bg: 'bg-secondary-container', text: 'text-secondary' },
  { bg: 'bg-primary-container', text: 'text-primary' },
  { bg: 'bg-surface-container-highest', text: 'text-on-surface' },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function CreateTripScreen() {
  const router = useRouter();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [tripName, setTripName]       = useState('');
  const [startDate, setStartDate]     = useState('');
  const [endDate, setEndDate]         = useState('');
  const [budget, setBudget]           = useState('');
  const [currency, setCurrency]       = useState('USD');
  const [description, setDescription] = useState('');
  const [locations, setLocations]     = useState<{ city: string; country: string }[]>([]);
  const [objectives, setObjectives]   = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState('');

  // ── Employee search state ───────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]           = useState('');
  const [searchResults, setSearchResults]       = useState<any[]>([]);
  const [searchLoading, setSearchLoading]       = useState(false);
  const [assignedEmployees, setAssignedEmployees] = useState<any[]>([]);

  // ── Modal / UI state ────────────────────────────────────────────────────────
  const [dateTarget, setDateTarget]             = useState<'start' | 'end' | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [submitting, setSubmitting]             = useState(false);

  // ── Location helpers ─────────────────────────────────────────────────────────
  const addLocation = (loc: { city: string; country: string }) => {
    setLocations(prev => [...prev, loc]);
    setShowLocationModal(false);
  };
  const removeLocation = (index: number) => setLocations(locations.filter((_, i) => i !== index));

  // ── Date helpers ─────────────────────────────────────────────────────────────
  const handleDateSelect = (date: string) => {
    if (dateTarget === 'start') setStartDate(date);
    if (dateTarget === 'end')   setEndDate(date);
    setDateTarget(null);
  };

  // ── Objective helpers ────────────────────────────────────────────────────────
  const addObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective('');
    }
  };
  const removeObjective = (index: number) => setObjectives(objectives.filter((_, i) => i !== index));

  // ── Employee search (debounced via useCallback + timeout) ────────────────────
  const searchEmployees = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) { setSearchResults([]); return; }

    setSearchLoading(true);
    try {
      const { data, error } = await supabase
        .from('USERS')
        .select('id, name, email, rank')
        .eq('type', 'Employee')
        .ilike('name', `%${query}%`)
        .limit(10);

      if (error) throw error;
      // Filter out already-assigned employees
      const assignedIds = assignedEmployees.map(e => e.id);
      setSearchResults((data || []).filter((u: any) => !assignedIds.includes(u.id)));
    } catch (e) {
      console.error('Employee search error:', e);
    } finally {
      setSearchLoading(false);
    }
  }, [assignedEmployees]);

  const assignEmployee = (employee: any) => {
    if (!assignedEmployees.find(e => e.id === employee.id)) {
      setAssignedEmployees([...assignedEmployees, employee]);
    }
    setSearchResults(searchResults.filter(e => e.id !== employee.id));
  };

  const removeEmployee = (id: string) => {
    setAssignedEmployees(assignedEmployees.filter(e => e.id !== id));
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleCreateTrip = async () => {
    if (!tripName.trim()) {
      Alert.alert('Missing Field', 'Please enter a trip name.');
      return;
    }
    if (!startDate || !endDate) {
      Alert.alert('Missing Field', 'Please select both start and end dates.');
      return;
    }
    if (!budget || isNaN(Number(budget))) {
      Alert.alert('Missing Field', 'Please enter a valid budget amount.');
      return;
    }

    setSubmitting(true);
    try {
      // ① Insert into TRIP
      const { data: tripData, error: tripError } = await supabase
        .from('TRIP')
        .insert({
          name: tripName.trim(),
          description: description.trim() || null,
          startDate,
          endDate,
          budget: Number(budget),
          currency: currency.trim() || 'USD',
        })
        .select('id')
        .single();

      if (tripError) throw tripError;
      const tripId = tripData.id;

      // ② Insert TRIPLOCATIONS (one row per city+country pair)
      if (locations.length > 0) {
        const locationRows = locations.map(loc => ({
          trip_id: tripId,
          city: loc.city,
          country: loc.country,
        }));
        const { error: locError } = await supabase
          .from('TRIPLOCATIONS')
          .insert(locationRows);
        if (locError) throw locError;
      }

      // ③ Insert TRIPOBJECTIVES
      if (objectives.length > 0) {
        const objRows = objectives.map(title => ({
          trip_id: tripId,
          title,
          description: null,
        }));
        const { error: objError } = await supabase
          .from('TRIPOBJECTIVES')
          .insert(objRows);
        if (objError) throw objError;
      }

      // ④ Insert USERTRIPS — one row per assigned employee
      if (assignedEmployees.length > 0) {
        const userTripRows = assignedEmployees.map(emp => ({
          trip_id: tripId,
          user_id: emp.id,
          expenditure: 0,
        }));
        const { error: utError } = await supabase
          .from('USERTRIPS')
          .insert(userTripRows);
        if (utError) throw utError;
      }

      Alert.alert(
        'Trip Created!',
        `"${tripName}" has been created and ${assignedEmployees.length} employee(s) assigned.`,
        [{ text: 'Done', onPress: () => router.back() }]
      );
    } catch (e: any) {
      console.error('Create trip error:', e);
      Alert.alert('Error', e?.message || 'Failed to create the trip. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-surface">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-xl items-center justify-center bg-surface-container"
        >
          <MaterialIcons name="arrow-back" size={24} color="#1D1A24" />
        </TouchableOpacity>
        <Text className="font-headline font-bold text-lg text-on-surface tracking-tight">
          Create New Trip
        </Text>
        <View className="w-10 h-10" />
      </View>

      <CustomCalendar
        visible={!!dateTarget}
        onClose={() => setDateTarget(null)}
        onSelect={handleDateSelect}
        title={dateTarget === 'start' ? 'Select Start Date' : 'Select End Date'}
      />

      <AddLocationModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onAdd={addLocation}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 flex-1 mt-6">

          {/* ── Trip Details Card ─────────────────────────────────────────── */}
          <View className="bg-surface-container rounded-[32px] p-6 shadow-sm mb-6">
            <Text className="font-headline font-bold text-lg text-on-surface mb-5">
              Trip Details
            </Text>
            <View className="gap-5">

              {/* Trip Name */}
              <View>
                <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">
                  Trip Name
                </Text>
                <TextInput
                  className="bg-surface-container-highest px-4 py-3.5 rounded-2xl text-on-surface font-body text-sm"
                  placeholder="e.g. Q1 Marketing Summit"
                  placeholderTextColor="rgba(74, 68, 85, 0.4)"
                  value={tripName}
                  onChangeText={setTripName}
                />
              </View>

              {/* Dates */}
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">
                    Start Date
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setDateTarget('start')}
                    className="bg-surface-container-highest flex-row items-center justify-between px-4 py-3.5 rounded-2xl"
                  >
                    <Text className={`font-body text-sm ${startDate ? 'text-on-surface' : 'text-on-surface-variant/50'}`}>
                      {startDate || 'Select Date'}
                    </Text>
                    <MaterialIcons name="calendar-today" size={16} color="#4A4455" />
                  </TouchableOpacity>
                </View>
                <View className="flex-1">
                  <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">
                    End Date
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setDateTarget('end')}
                    className="bg-surface-container-highest flex-row items-center justify-between px-4 py-3.5 rounded-2xl"
                  >
                    <Text className={`font-body text-sm ${endDate ? 'text-on-surface' : 'text-on-surface-variant/50'}`}>
                      {endDate || 'Select Date'}
                    </Text>
                    <MaterialIcons name="calendar-today" size={16} color="#4A4455" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Budget + Currency */}
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">
                    Budget
                  </Text>
                  <TextInput
                    className="bg-surface-container-highest px-4 py-3.5 rounded-2xl text-on-surface font-body text-sm"
                    placeholder="5000"
                    keyboardType="numeric"
                    placeholderTextColor="rgba(74, 68, 85, 0.4)"
                    value={budget}
                    onChangeText={setBudget}
                  />
                </View>
                <View className="w-28">
                  <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">
                    Currency
                  </Text>
                  <TextInput
                    className="bg-surface-container-highest px-4 py-3.5 rounded-2xl text-on-surface font-body text-sm"
                    placeholder="USD"
                    placeholderTextColor="rgba(74, 68, 85, 0.4)"
                    autoCapitalize="characters"
                    maxLength={5}
                    value={currency}
                    onChangeText={setCurrency}
                  />
                </View>
              </View>

              {/* Description */}
              <View>
                <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">
                  Description
                </Text>
                <TextInput
                  className="bg-surface-container-highest px-4 py-3.5 rounded-2xl text-on-surface font-body text-sm min-h-[80px]"
                  placeholder="Describe the purpose of this trip..."
                  placeholderTextColor="rgba(74, 68, 85, 0.4)"
                  multiline
                  textAlignVertical="top"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {/* Locations */}
              <View>
                <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">
                  Trip Locations
                </Text>
                {locations.length > 0 && (
                  <View className="gap-2 mb-3">
                    {locations.map((loc, i) => (
                      <View key={i} className="bg-primary-container/40 border border-primary/20 flex-row items-center rounded-2xl px-4 py-3 gap-3">
                        <MaterialIcons name="location-on" size={16} color="#630ED4" />
                        <View className="flex-1">
                          <Text className="text-primary font-body text-sm font-bold">{loc.city}</Text>
                          <Text className="text-primary/70 font-body text-xs">{loc.country}</Text>
                        </View>
                        <TouchableOpacity onPress={() => removeLocation(i)}>
                          <MaterialIcons name="close" size={16} color="#630ED4" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowLocationModal(true)}
                  className="bg-surface-container-highest flex-row items-center justify-between px-4 py-3.5 rounded-2xl"
                >
                  <Text className="text-on-surface font-body text-sm">Add Location...</Text>
                  <MaterialIcons name="add-location-alt" size={20} color="#4A4455" />
                </TouchableOpacity>
              </View>

              {/* Objectives */}
              <View>
                <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">
                  Trip Objectives
                </Text>
                {objectives.length > 0 && (
                  <View className="gap-2 mb-3">
                    {objectives.map((obj, i) => (
                      <View key={i} className="flex-row items-center gap-2 bg-surface-container-high p-3 rounded-2xl">
                        <MaterialIcons name="check-circle" size={18} color="#630ED4" />
                        <Text className="flex-1 text-on-surface font-body text-sm">{obj}</Text>
                        <TouchableOpacity onPress={() => removeObjective(i)}>
                          <MaterialIcons name="close" size={18} color="#4A4455" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                <View className="flex-row items-center gap-2">
                  <TextInput
                    className="flex-1 bg-surface-container-highest px-4 py-3.5 rounded-2xl text-on-surface font-body text-sm"
                    placeholder="Add objective..."
                    placeholderTextColor="rgba(74, 68, 85, 0.4)"
                    value={newObjective}
                    onChangeText={setNewObjective}
                    onSubmitEditing={addObjective}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={addObjective}
                    className="w-12 h-12 bg-primary-container items-center justify-center rounded-2xl"
                  >
                    <MaterialIcons name="add" size={24} color="#630ED4" />
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </View>

          {/* ── Assign Employees Card ─────────────────────────────────────── */}
          <View className="bg-surface-container rounded-[32px] p-6 shadow-sm mb-6">
            <Text className="font-headline font-bold text-lg text-on-surface mb-5">
              Assign Employees
            </Text>

            {/* Search Bar */}
            <View className="bg-surface-container-highest rounded-2xl flex-row items-center px-4 py-3 mb-2">
              <MaterialIcons name="search" size={20} color="#4A4455" />
              <TextInput
                className="flex-1 ml-3 text-on-surface font-body text-sm py-1"
                placeholder="Search employees by name…"
                placeholderTextColor="rgba(74, 68, 85, 0.5)"
                value={searchQuery}
                onChangeText={searchEmployees}
                returnKeyType="search"
              />
              {searchLoading && (
                <ActivityIndicator size="small" color="#630ED4" />
              )}
              {!searchLoading && searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); }}>
                  <MaterialIcons name="close" size={18} color="#4A4455" />
                </TouchableOpacity>
              )}
            </View>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <View className="bg-surface-container-highest rounded-2xl mb-4 overflow-hidden">
                {searchResults.map((emp, idx) => (
                  <TouchableOpacity
                    key={emp.id}
                    activeOpacity={0.7}
                    onPress={() => assignEmployee(emp)}
                    className={`flex-row items-center justify-between px-4 py-3 ${
                      idx < searchResults.length - 1 ? 'border-b border-surface-container' : ''
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-9 h-9 rounded-[12px] bg-primary-container/60 items-center justify-center">
                        <Text className="text-primary font-headline font-bold text-xs">
                          {getInitials(emp.name)}
                        </Text>
                      </View>
                      <View>
                        <Text className="font-body font-bold text-sm text-on-surface">{emp.name}</Text>
                        <Text className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">
                          {emp.rank || emp.email || '—'}
                        </Text>
                      </View>
                    </View>
                    <View className="bg-primary/10 px-3 py-1.5 rounded-full flex-row items-center gap-1">
                      <MaterialIcons name="add" size={14} color="#630ED4" />
                      <Text className="text-primary font-bold text-xs">Add</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* No results hint */}
            {searchQuery.length > 0 && !searchLoading && searchResults.length === 0 && (
              <Text className="text-on-surface-variant font-body text-sm text-center py-3 mb-3">
                No employees found for "{searchQuery}".
              </Text>
            )}

            {/* Assigned Employees List */}
            {assignedEmployees.length > 0 ? (
              <View>
                <Text className="font-body text-xs text-on-surface-variant mb-3 ml-1 uppercase tracking-wider">
                  Assigned ({assignedEmployees.length})
                </Text>
                <View className="gap-3">
                  {assignedEmployees.map((emp, idx) => {
                    const colors = INIT_COLORS[idx % INIT_COLORS.length];
                    return (
                      <View
                        key={emp.id}
                        className="flex-row items-center justify-between"
                      >
                        <View className="flex-row items-center gap-3">
                          <View className={`w-10 h-10 rounded-[14px] ${colors.bg} items-center justify-center`}>
                            <Text className={`${colors.text} font-headline font-bold text-sm`}>
                              {getInitials(emp.name)}
                            </Text>
                          </View>
                          <View>
                            <Text className="font-body font-bold text-sm text-on-surface">{emp.name}</Text>
                            <Text className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">
                              {emp.rank || emp.email || '—'}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => removeEmployee(emp.id)}
                          className="bg-surface-container-highest p-2 rounded-full"
                        >
                          <MaterialIcons name="person-remove" size={16} color="#AB3500" />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : (
              <View className="items-center py-6 mt-2">
                <MaterialIcons name="group-add" size={36} color="#7b748760" />
                <Text className="text-on-surface-variant font-body text-sm mt-2">
                  No employees assigned yet.
                </Text>
                <Text className="text-outline-variant font-body text-xs mt-0.5">
                  Use the search above to find and add employees.
                </Text>
              </View>
            )}
          </View>

          {/* ── Submit Button ─────────────────────────────────────────────── */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCreateTrip}
            disabled={submitting}
            className="mb-4 mt-2 rounded-full overflow-hidden shadow-lg shadow-primary/20"
            style={{ opacity: submitting ? 0.7 : 1 }}
          >
            <LinearGradient
              colors={['#630ED4', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 99 }}
              className="py-4 flex-row items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-headline font-bold text-base">Creating Trip…</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="flight-takeoff" size={20} color="white" />
                  <Text className="text-white font-headline font-bold text-base">Initialize Trip</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

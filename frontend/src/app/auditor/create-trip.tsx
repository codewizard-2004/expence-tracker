import CustomCalendar from '@/components/CustomCalendar';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AVAILABLE_COUNTRIES = ["United States", "United Kingdom", "France", "Germany", "Japan", "Australia", "Canada", "Singapore"];

const CountryPicker = ({ visible, onClose, onSelect, available }: any) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-[#1D1A24]/60">
        <View className="bg-surface rounded-t-[32px] p-6 max-h-[70%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="font-headline font-bold text-xl text-on-surface tracking-tight">Select Destination</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={onClose} className="p-2 bg-surface-container-high rounded-full">
               <MaterialIcons name="close" size={20} color="#4A4455" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {available.map((c: string) => (
              <TouchableOpacity
                key={c}
                activeOpacity={0.7}
                onPress={() => onSelect(c)}
                className="py-4 border-b border-surface-container flex-row justify-between items-center"
              >
                <Text className="font-body font-bold text-base text-on-surface">{c}</Text>
                <MaterialIcons name="add-circle" size={22} color="#630ED4" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

export default function CreateTripScreen() {
  const router = useRouter();

  const [isTripCreated, setIsTripCreated] = useState(false);

  // Trip Form State
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  
  // Dynamic lists
  const [countries, setCountries] = useState<string[]>([]);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState('');

  // Modals
  const [dateTarget, setDateTarget] = useState<'start' | 'end' | null>(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const addCountry = (country: string) => {
    if (!countries.includes(country)) {
      setCountries([...countries, country]);
    }
    setShowCountryDropdown(false);
  };

  const removeCountry = (index: number) => {
    setCountries(countries.filter((_, i) => i !== index));
  };

  const handleDateSelect = (date: string) => {
    if (dateTarget === 'start') setStartDate(date);
    if (dateTarget === 'end') setEndDate(date);
    setDateTarget(null);
  }

  const addObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleCreateTrip = () => {
    if (tripName) {
      setIsTripCreated(true);
    }
  };

  const availableCountries = AVAILABLE_COUNTRIES.filter(c => !countries.includes(c));

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
        title={dateTarget === 'start' ? "Select Start Date" : "Select End Date"} 
      />

      <CountryPicker 
        visible={showCountryDropdown}
        onClose={() => setShowCountryDropdown(false)}
        onSelect={addCountry}
        available={availableCountries}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 flex-1 mt-6">
          
            <View className="bg-surface-container rounded-[32px] p-6 shadow-sm mb-6">
              <Text className="font-headline font-bold text-lg text-on-surface mb-5">Trip Details</Text>
              <View className="gap-5">
                <View>
                  <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">Trip Name</Text>
                  <TextInput 
                    className="bg-surface-container-highest flex-row items-center px-4 py-3.5 rounded-2xl text-on-surface font-body text-sm"
                    placeholder="e.g. Q1 Marketing Summit"
                    placeholderTextColor="rgba(74, 68, 85, 0.4)"
                    value={tripName}
                    onChangeText={setTripName}
                  />
                </View>
                
                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">Start Date</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setDateTarget('start')} className="bg-surface-container-highest flex-row items-center justify-between px-4 py-3.5 rounded-2xl">
                       <Text className={`font-body text-sm ${startDate ? 'text-on-surface' : 'text-on-surface-variant/50'}`}>
                         {startDate || 'Select Date'}
                       </Text>
                       <MaterialIcons name="calendar-today" size={16} color="#4A4455" />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-1">
                    <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">End Date</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setDateTarget('end')} className="bg-surface-container-highest flex-row items-center justify-between px-4 py-3.5 rounded-2xl">
                       <Text className={`font-body text-sm ${endDate ? 'text-on-surface' : 'text-on-surface-variant/50'}`}>
                         {endDate || 'Select Date'}
                       </Text>
                       <MaterialIcons name="calendar-today" size={16} color="#4A4455" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View>
                  <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">Budget ($)</Text>
                  <TextInput 
                    className="bg-surface-container-highest flex-row items-center px-4 py-3.5 rounded-2xl text-on-surface font-body text-sm"
                    placeholder="5000"
                    keyboardType="numeric"
                    placeholderTextColor="rgba(74, 68, 85, 0.4)"
                    value={budget}
                    onChangeText={setBudget}
                  />
                </View>

                {/* Description */}
                <View>
                  <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">Description</Text>
                  <TextInput 
                    className="bg-surface-container-highest flex-row flex-start px-4 py-3.5 rounded-2xl text-on-surface font-body text-sm min-h-[80px]"
                    placeholder="Describe the purpose of this trip..."
                    placeholderTextColor="rgba(74, 68, 85, 0.4)"
                    multiline
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>

                {/* Countries */}
                <View>
                  <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">Countries Involved</Text>
                  {countries.length > 0 && (
                    <View className="flex-row flex-wrap gap-2 mb-3">
                      {countries.map((c, i) => (
                        <View key={i} className="bg-primary-container/40 border border-primary/20 flex-row items-center rounded-full px-3 py-1.5 gap-1.5">
                          <Text className="text-primary font-body text-xs font-bold">{c}</Text>
                          <TouchableOpacity onPress={() => removeCountry(i)}>
                            <MaterialIcons name="close" size={14} color="#630ED4" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                  <TouchableOpacity activeOpacity={0.8} onPress={() => setShowCountryDropdown(true)} className="bg-surface-container-highest flex-row items-center justify-between px-4 py-3.5 rounded-2xl">
                    <Text className="text-on-surface font-body text-sm">Add Country...</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={20} color="#4A4455" />
                  </TouchableOpacity>
                </View>

                {/* Objectives */}
                <View>
                  <Text className="font-body text-xs text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">Trip Objectives</Text>
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
                    />
                    <TouchableOpacity onPress={addObjective} className="w-12 h-12 bg-primary-container items-center justify-center rounded-2xl">
                      <MaterialIcons name="add" size={24} color="#630ED4" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Employee Assignment Section */}
            <View className="bg-surface-container rounded-[32px] p-6 shadow-sm mb-6">
              <Text className="font-headline font-bold text-lg text-on-surface mb-5">Assign Employees</Text>

              <View className="bg-surface-container-highest rounded-2xl flex-row items-center px-4 py-3 mb-4">
                 <MaterialIcons name="search" size={20} color="#4A4455" />
                 <TextInput 
                   className="flex-1 ml-3 text-on-surface font-body text-sm py-1"
                   placeholder="Search employees by name or ID"
                   placeholderTextColor="rgba(74, 68, 85, 0.5)"
                 />
              </View>

              {/* Mock Employee List */}
              <View className="gap-3">
                 <View className="flex-row items-center justify-between border-b border-outline-variant/10 pb-3">
                   <View className="flex-row items-center gap-3">
                     <View className="w-10 h-10 rounded-[14px] bg-secondary-container items-center justify-center">
                       <Text className="text-secondary font-headline font-bold">JD</Text>
                     </View>
                     <View>
                       <Text className="font-body font-bold text-sm text-on-surface">Jane Doe</Text>
                       <Text className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">Engineering Lead</Text>
                     </View>
                   </View>
                   <TouchableOpacity className="bg-primary/10 px-4 py-2 rounded-full">
                      <Text className="text-primary font-bold text-xs">Assign</Text>
                   </TouchableOpacity>
                 </View>
                 <View className="flex-row items-center justify-between pt-1">
                   <View className="flex-row items-center gap-3">
                     <View className="w-10 h-10 rounded-[14px] bg-primary-container items-center justify-center">
                       <Text className="text-primary font-headline font-bold">AS</Text>
                     </View>
                     <View>
                       <Text className="font-body font-bold text-sm text-on-surface">Alice Smith</Text>
                       <Text className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">Product Manager</Text>
                     </View>
                   </View>
                   <TouchableOpacity className="bg-primary px-4 py-2 rounded-full shadow-sm">
                      <Text className="text-white font-bold text-xs">Assigned</Text>
                   </TouchableOpacity>
                 </View>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} className="mb-4 mt-2 bg-primary py-4 rounded-full items-center justify-center shadow-sm">
              <Text className="text-white font-headline font-bold text-base">Initialize Trip</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

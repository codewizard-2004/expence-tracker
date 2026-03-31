import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

type CustomCalendarProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (dateString: string) => void;
  title: string;
};

const CustomCalendar = ({ visible, onClose, onSelect, title }: CustomCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  
  const handlePrevYear = () => setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1));
  const handleNextYear = () => setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-[#1D1A24]/60 justify-center items-center px-4">
        <View className="bg-surface w-full max-w-[400px] rounded-[32px] p-6 shadow-xl">
           <Text className="font-headline font-bold text-xl text-on-surface mb-4 tracking-tight text-center">{title}</Text>
           
           {/* Month/Year controls */}
           <View className="flex-row justify-between items-center mb-6 px-1">
             <View className="flex-row items-center gap-1">
               <TouchableOpacity onPress={handlePrevYear} className="p-2.5 bg-surface-container rounded-full">
                 <MaterialIcons name="keyboard-double-arrow-left" size={20} color="#630ED4" />
               </TouchableOpacity>
               <TouchableOpacity onPress={handlePrevMonth} className="p-2.5 bg-surface-container rounded-full">
                 <MaterialIcons name="chevron-left" size={20} color="#630ED4" />
               </TouchableOpacity>
             </View>

             <Text className="font-headline font-bold text-base text-on-surface text-center flex-1">
               {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
             </Text>

             <View className="flex-row items-center gap-1">
               <TouchableOpacity onPress={handleNextMonth} className="p-2.5 bg-surface-container rounded-full">
                 <MaterialIcons name="chevron-right" size={20} color="#630ED4" />
               </TouchableOpacity>
               <TouchableOpacity onPress={handleNextYear} className="p-2.5 bg-surface-container rounded-full">
                 <MaterialIcons name="keyboard-double-arrow-right" size={20} color="#630ED4" />
               </TouchableOpacity>
             </View>
           </View>

           {/* Days of Week Headers */}
           <View className="flex-row justify-between mb-2">
             {daysOfWeek.map(d => (
               <View key={d} className="w-[14.28%] items-center">
                 <Text className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest">{d}</Text>
               </View>
             ))}
           </View>

           {/* Calendar Grid */}
           <View className="flex-row flex-wrap mb-8">
             {blanks.map(b => (
               <View key={`b-${b}`} className="w-[14.28%] aspect-square" />
             ))}
             {days.map(d => (
               <View key={d} className="w-[14.28%] aspect-square items-center justify-center p-1">
                 <TouchableOpacity 
                   activeOpacity={0.7}
                   onPress={() => onSelect(`${monthNames[currentMonth.getMonth()].substring(0, 3)} ${d}, ${currentMonth.getFullYear()}`)}
                   className="w-full h-full rounded-full bg-surface-container-high items-center justify-center"
                 >
                   <Text className="font-body text-sm font-bold text-on-surface">{d}</Text>
                 </TouchableOpacity>
               </View>
             ))}
           </View>

           <TouchableOpacity activeOpacity={0.8} onPress={onClose} className="bg-surface-container-highest py-4 rounded-full items-center">
             <Text className="font-headline font-bold text-on-surface">Cancel</Text>
           </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default CustomCalendar;

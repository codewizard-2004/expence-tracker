import Sparkles from '@/components/Sparkles';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const router = useRouter();
  const [role, setRole] = useState<'employee' | 'auditor'>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Background Sparkles */}
        <Sparkles />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="flex-row items-center gap-2 pt-4 pb-8 rounded-2xl">
            <LinearGradient
              colors={['#630ED4', '#7C3AED']}
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            >
              <MaterialIcons name="account-balance-wallet" size={24} color="white" />
            </LinearGradient>
            <Text className="font-headline font-black text-2xl tracking-tighter text-primary">
              Macrosoft
            </Text>
          </View>

          {/* Tab Switcher */}

          {/* Welcome Text */}
          <View className="mb-10 items-center">
            <Text className="font-headline text-3xl font-extrabold text-on-surface mb-2">
              Welcome Back
            </Text>
            <Text className="text-on-surface-variant font-medium text-center">
              Please select your access tier to continue.
            </Text>
          </View>

          {/* Roles */}
          <View className="flex-row gap-4 mb-8">
            <TouchableOpacity
              onPress={() => setRole('employee')}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all ${role === 'employee'
                ? 'border-primary bg-primary-fixed/10'
                : 'border-outline-variant/30 bg-transparent'
                }`}
            >
              <View
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${role === 'employee' ? 'bg-primary' : 'bg-surface-container-high'
                  }`}
              >
                <MaterialIcons
                  name="badge"
                  size={24}
                  color={role === 'employee' ? 'white' : '#4a4455'}
                />
              </View>
              <Text className="font-bold text-sm text-on-surface">Employee</Text>
              <Text
                className={`text-[10px] font-medium tracking-wider uppercase mt-1 ${role === 'employee' ? 'text-primary' : 'text-outline'
                  }`}
              >
                Submit Expenses
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRole('auditor')}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all ${role === 'auditor'
                ? 'border-primary bg-primary-fixed/10'
                : 'border-outline-variant/30 bg-transparent'
                }`}
            >
              <View
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${role === 'auditor' ? 'bg-primary' : 'bg-surface-container-high'
                  }`}
              >
                <MaterialIcons
                  name="rule"
                  size={24}
                  color={role === 'auditor' ? 'white' : '#4a4455'}
                />
              </View>
              <Text className="font-bold text-sm text-on-surface">Auditor</Text>
              <Text
                className={`text-[10px] font-medium tracking-wider uppercase mt-1 ${role === 'auditor' ? 'text-primary' : 'text-outline'
                  }`}
              >
                Review & Approve
              </Text>
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <View className="flex-col gap-6">
            <View>
              <Text className="text-[11px] font-bold text-outline-variant uppercase tracking-widest pl-1 mb-1">
                Corporate Email
              </Text>
              <View className="relative flex-row items-center border-b-2 border-transparent bg-surface-container-highest rounded-xl h-14 pl-4 pr-4">
                <MaterialIcons name="alternate-email" size={20} color="#7b7487" />
                <TextInput
                  className="flex-1 ml-3 text-on-surface font-body h-full"
                  placeholder="name@macrosoft.com"
                  placeholderTextColor="#7b748780"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View>
              <View className="flex-row justify-between items-end mb-1">
                <Text className="text-[11px] font-bold text-outline-variant uppercase tracking-widest pl-1">
                  Security Key
                </Text>
                <TouchableOpacity>
                  <Text className="text-[11px] font-bold text-secondary uppercase tracking-widest">
                    Forgot?
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="relative flex-row items-center border-b-2 border-transparent bg-surface-container-highest rounded-xl h-14 pl-4 pr-4">
                <MaterialIcons name="lock-outline" size={20} color="#7b7487" />
                <TextInput
                  className="flex-1 ml-3 text-on-surface font-body h-full"
                  placeholder="••••••••"
                  placeholderTextColor="#7b748780"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={20}
                    color="#7b7487"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Button */}
            <View className="pt-4">
              <TouchableOpacity className="shadow-xl rounded-xl overflow-hidden" onPress={() => router.replace(`/${role}` as any)}>
                <LinearGradient
                  colors={['#630ED4', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-5 flex-row items-center justify-center gap-3"
                >
                  <Text className="text-white font-headline font-bold text-lg">
                    Access Dashboard
                  </Text>
                  <MaterialIcons name="arrow-forward" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

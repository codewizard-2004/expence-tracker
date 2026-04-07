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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [role, setRole] = useState<'Employee' | 'Auditor'>('Employee');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | 'O'>('M');
  const [rank, setRank] = useState('L1');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const ranks = Array.from({ length: 10 }, (_, i) => `L${i + 1}`);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill out all required fields.');
      return;
    }

    setLoading(true);
    let logo = '';
    const randomId = Math.floor(Math.random() * 100);
    if (gender === 'M') {
      logo = `https://randomuser.me/api/portraits/men/${randomId}.jpg`;
    } else if (gender === 'F') {
      logo = `https://randomuser.me/api/portraits/women/${randomId}.jpg`;
    } else {
      logo = `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 10)}.jpg`;
    }

    const { error, role: userRole } = await signUp(email, password, {
      name,
      gender,
      rank,
      type: role,
      logo,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Error', error.message);
    } else {
      Alert.alert('Success', 'Account created successfully!');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Sparkles />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="flex-row items-center gap-2 pt-4 pb-4 rounded-2xl">
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

          {/* Welcome Text */}
          <View className="mb-6 items-center">
            <Text className="font-headline text-3xl font-extrabold text-on-surface mb-2">
              Create Account
            </Text>
            <Text className="text-on-surface-variant font-medium text-center">
              Join us to manage expenses efficiently.
            </Text>
          </View>

          <View className="flex-col gap-5">
            {/* Name */}
            <View>
              <Text className="text-[11px] font-bold text-outline-variant uppercase tracking-widest pl-1 mb-1">
                Full Name
              </Text>
              <View className="relative flex-row items-center border-b-2 border-transparent bg-surface-container-highest rounded-xl h-14 pl-4 pr-4">
                <MaterialIcons name="person-outline" size={20} color="#7b7487" />
                <TextInput
                  className="flex-1 ml-3 text-on-surface font-body h-full"
                  placeholder="John Doe"
                  placeholderTextColor="#7b748780"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Email */}
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

            {/* Password */}
            <View>
              <Text className="text-[11px] font-bold text-outline-variant uppercase tracking-widest pl-1 mb-1">
                Security Key (Password)
              </Text>
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

            {/* Row for Gender and Role */}
            <View className="flex-row gap-4">
              {/* Gender */}
              <View className="flex-1">
                <Text className="text-[11px] font-bold text-outline-variant uppercase tracking-widest pl-1 mb-2">
                  Gender
                </Text>
                <View className="flex-row gap-2">
                  {['M', 'F', 'O'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      onPress={() => setGender(g as any)}
                      className={`flex-1 items-center justify-center py-3 rounded-xl border ${gender === g ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/30 bg-surface-container-highest'}`}
                    >
                      <Text className={`font-bold ${gender === g ? 'text-primary' : 'text-on-surface'}`}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Role */}
              <View className="flex-1">
                <Text className="text-[11px] font-bold text-outline-variant uppercase tracking-widest pl-1 mb-2">
                  Account Type
                </Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => setRole('Employee')}
                    className={`flex-1 items-center justify-center py-2 rounded-xl border ${role === 'Employee' ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/30 bg-surface-container-highest'}`}
                  >
                    <MaterialIcons name="badge" size={16} color={role === 'Employee' ? '#630ED4' : '#7b7487'} />
                    <Text className={`text-[10px] mt-1 font-bold ${role === 'Employee' ? 'text-primary' : 'text-on-surface'}`}>Emp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setRole('Auditor')}
                    className={`flex-1 items-center justify-center py-2 rounded-xl border ${role === 'Auditor' ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/30 bg-surface-container-highest'}`}
                  >
                    <MaterialIcons name="rule" size={16} color={role === 'Auditor' ? '#630ED4' : '#7b7487'} />
                    <Text className={`text-[10px] mt-1 font-bold ${role === 'Auditor' ? 'text-primary' : 'text-on-surface'}`}>Aud</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Rank */}
            <View>
              <Text className="text-[11px] font-bold text-outline-variant uppercase tracking-widest pl-1 mb-2">
                Corporate Rank
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {ranks.map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setRank(r)}
                    className={`px-4 py-2 mr-2 rounded-xl border ${rank === r ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/30 bg-surface-container-highest'}`}
                  >
                    <Text className={`font-bold ${rank === r ? 'text-primary' : 'text-on-surface'}`}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Sign Up Button */}
            <View className="pt-4">
              <TouchableOpacity
                className="shadow-xl rounded-xl overflow-hidden"
                onPress={handleSignUp}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#630ED4', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className={`py-5 flex-row items-center justify-center gap-3 ${loading ? 'opacity-80' : ''}`}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Text className="text-white font-headline font-bold text-lg">
                        Create Account
                      </Text>
                      <MaterialIcons name="person-add" size={20} color="white" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Sign In Link */}
            <View className="mt-4 flex-row justify-center">
              <Text className="text-on-surface-variant font-medium">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/sign-in')}>
                <Text className="text-primary font-bold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

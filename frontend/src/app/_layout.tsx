import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { AuthProvider, useAuth } from '../hooks/useAuth';

function InitialLayout() {
  const { session, role, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const segment = segments[0] as string | undefined;
    const inAuthScreen = !segment || segment === 'sign-in' || segment === 'sign-up' || segment === 'index';

    if (!session) {
      if (!inAuthScreen) {
        router.replace('/');
      }
    } else if (session && role) {
      if (segments[0] !== role.toLowerCase()) {
        router.replace(`/${role.toLowerCase()}` as any);
      }
    }
  }, [session, initialized, segments, role]);

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}

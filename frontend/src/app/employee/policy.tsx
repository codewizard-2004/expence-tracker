import React from 'react';
import { StyleSheet, View, ActivityIndicator, Platform, SafeAreaView, Text } from 'react-native';
import { WebView } from 'react-native-webview';
// Import your configured supabase client
import { supabase } from '@/lib/supabase';
import TopNavigator from '@/components/TopNavigator';

// Constants for your Supabase setup
const BUCKET_NAME = 'policy'; // Change to your actual bucket name
const FILE_PATH = 'policy.pdf'; // Change to your actual file path

export default function TravelPolicyScreen() {

  // 1. Generate the Public URL from Supabase
  const { data } = supabase
    .storage
    .from(BUCKET_NAME)
    .getPublicUrl(FILE_PATH);

  const publicUrl = data.publicUrl;

  // 2. Platform-specific logic: Android requires the Google Docs Viewer wrapper
  const sourceUri = Platform.OS === 'android'
    ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(publicUrl)}`
    : publicUrl;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header section (optional) */}
      <View style={styles.header}>
        <TopNavigator mode='employee' />
      </View>

      <View style={styles.webviewContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ uri: sourceUri }}
          style={styles.webview}
          // Enable built-in zooming for better UX
          scalesPageToFit={true}
          // Loading state configuration
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#007AFF" size="large" />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 15,
    borderBottomWidth: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});